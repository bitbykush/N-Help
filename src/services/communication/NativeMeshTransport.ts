import { ICommunicationTransport, MeshMessage, MeshPeer, TransportType } from '../../types/communication';
import { userService } from '../userService';

declare global {
  interface Window {
    NHelpNativeMeshBridge?: {
      isAvailable: () => boolean;
      sendBleMeshPacket: (jsonPayload: string) => boolean;
      getDiscoveredBlePeers: () => string; // JSON string of peers
      registerCallback: (callbackName: string) => void;
      syncRadio?: () => void;
      getRadioDiagnostics?: () => string;
    };
    __onNHelpNativePacketReceived?: (jsonPayload: string) => void;
    __onNHelpNativePeersUpdated?: (jsonPayload: string) => void;
    __onNHelpRadioChanged?: (enabled: boolean, scanning: boolean) => void;
  }
}

export class NativeMeshTransport implements ICommunicationTransport {
  name: TransportType = 'NATIVE_MESH';
  private messageCallback: ((message: MeshMessage) => void) | null = null;
  private peerCallback: ((peers: MeshPeer[]) => void) | null = null;

  async isAvailable(): Promise<boolean> {
    return typeof window !== 'undefined' && !!window.NHelpNativeMeshBridge?.isAvailable();
  }

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Attach global listener for native Android IPC bridge
    window.__onNHelpNativePacketReceived = async (jsonPayload: string) => {
      try {
        const raw = JSON.parse(jsonPayload);
        const myId = userService.getUserId();
        const myShortId = myId.slice(-6);

        // Filter out self-broadcasts picked up by the radio scanner (fixes duplicate display)
        if (raw.senderId === myId || raw.s === myShortId) {
          return;
        }

        let msg: MeshMessage;

        if (raw.content !== undefined && raw.channelId !== undefined) {
          // Standard JSON payload
          msg = raw as MeshMessage;
          msg.status = 'RELAYED';
          msg.hops = (msg.hops || 0) + 1;

          // Check if private family message
          if (msg.channelId === 'family-reconnect') {
            const myFamHash = userService.getFamilyHash();
            if ((raw as any).familyHash && (raw as any).familyHash !== myFamHash) {
              // Hopped for neighbor family: keep relaying but hide content
              msg.content = '🔒 [Encrypted Family Packet Relayed for Neighbor]';
            } else {
              const decrypted = await userService.decryptFamilyContent(msg.content);
              if (decrypted) msg.content = decrypted;
            }
          }
        } else if (raw.m !== undefined) {
          // Compact beacon payload format
          const channelMap: Record<string, any> = {
            gen: 'emergency-general',
            med: 'medical-help',
            shl: 'shelter-info',
            fam: 'family-reconnect',
            sup: 'supplies',
            mis: 'missing-persons',
            loc: 'local-information'
          };

          const targetChannel = channelMap[raw.c] || 'emergency-general';
          let displayContent = raw.m || '';

          // Private Family Encryption check over BLE
          if (targetChannel === 'family-reconnect' && raw.fam) {
            const myFamHash = userService.getFamilyHash();
            if (raw.fam === myFamHash) {
              const decrypted = await userService.decryptFamilyContent(raw.m);
              if (decrypted) displayContent = decrypted;
            } else {
              // Different family code: Hop/relay the packet, but protect privacy
              displayContent = '🔒 [Encrypted Family Check-in Relayed for Neighbor]';
            }
          }

          msg = {
            id: raw.i ? `ble-${raw.i}` : `ble-${Date.now()}`,
            senderId: raw.s || 'ble-peer',
            senderName: raw.n || raw.s || 'Civilian (BLE)',
            channelId: targetChannel,
            content: displayContent,
            timestamp: raw.t || Date.now(),
            ttl: (raw.ttl ?? 4) - 1,
            hops: (raw.h ?? 0) + 1,
            relayPath: ['BLE Mesh Hop'],
            status: 'RELAYED',
            verification: 'COMMUNITY_UNVERIFIED',
            isDemo: false
          };
        } else {
          return;
        }

        // Deliver to chat UI
        if (this.messageCallback) {
          this.messageCallback(msg);
        }

        // Multi-hop store-and-forward: re-broadcast if TTL > 0
        if (msg.ttl > 0 && window.NHelpNativeMeshBridge?.sendBleMeshPacket) {
          // Forward packet with decremented TTL
          const relayPayload = JSON.stringify({
            i: msg.id.replace('ble-', ''),
            s: raw.s || msg.senderId.slice(-6),
            n: raw.n || msg.senderName.slice(0, 10),
            c: raw.c || 'gen',
            m: raw.m || msg.content,
            fam: raw.fam,
            t: msg.timestamp,
            h: msg.hops,
            ttl: msg.ttl
          });
          window.NHelpNativeMeshBridge.sendBleMeshPacket(relayPayload);
        }
      } catch (e) {
        console.error('[NativeMeshTransport] Failed to parse native payload:', e);
      }
    };

    window.__onNHelpNativePeersUpdated = (jsonPayload: string) => {
      try {
        const peers = JSON.parse(jsonPayload) as MeshPeer[];
        if (this.peerCallback) this.peerCallback(peers);
      } catch (e) {
        console.error('[NativeMeshTransport] Failed to parse native peers:', e);
      }
    };

    // Register callback with Android Bridge
    if (window.NHelpNativeMeshBridge?.registerCallback) {
      window.NHelpNativeMeshBridge.registerCallback('__onNHelpNativePacketReceived');
    }

    const onRadioUpdate = async () => {
      if (this.peerCallback) {
        const peers = await this.getPeers();
        this.peerCallback(peers);
      }
    };
    window.addEventListener('nhelp_radio_changed', onRadioUpdate);
    window.__onNHelpRadioChanged = onRadioUpdate;

    // Periodic peer status refresh for BLE mesh discovery
    setInterval(async () => {
      if (this.peerCallback) {
        const peers = await this.getPeers();
        this.peerCallback(peers);
      }
    }, 2500);
  }

  async sendMessage(message: MeshMessage): Promise<boolean> {
    if (!window.NHelpNativeMeshBridge) return false;
    try {
      const channelShortMap: Record<string, string> = {
        'emergency-general': 'gen',
        'medical-help': 'med',
        'shelter-info': 'shl',
        'family-reconnect': 'fam',
        'supplies': 'sup',
        'missing-persons': 'mis',
        'local-information': 'loc'
      };

      const myId = userService.getUserId();
      const myName = userService.getUserName();
      let contentToSend = message.content;
      let familyHashToSend: string | undefined = undefined;

      // Encrypt if family channel
      if (message.channelId === 'family-reconnect') {
        familyHashToSend = userService.getFamilyHash();
        contentToSend = await userService.encryptFamilyContent(message.content);
      }

      const compactPayload = JSON.stringify({
        i: message.id.slice(-6),
        s: myId.slice(-6),
        n: myName.slice(0, 10),
        c: channelShortMap[message.channelId] || 'gen',
        m: contentToSend.slice(0, 350),
        fam: familyHashToSend,
        t: message.timestamp,
        h: message.hops,
        ttl: 4
      });

      const success = window.NHelpNativeMeshBridge.sendBleMeshPacket(compactPayload);
      if (success) message.status = 'RELAYED';
      return success;
    } catch {
      return false;
    }
  }

  async broadcastMessage(message: MeshMessage): Promise<boolean> {
    return this.sendMessage(message);
  }

  async getPeers(): Promise<MeshPeer[]> {
    if (window.NHelpNativeMeshBridge?.getDiscoveredBlePeers) {
      try {
        const raw = window.NHelpNativeMeshBridge.getDiscoveredBlePeers();
        const parsed = JSON.parse(raw) as MeshPeer[];
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  }

  onMessageReceived(callback: (message: MeshMessage) => void): void {
    this.messageCallback = callback;
  }

  onPeerStatusChanged(callback: (peers: MeshPeer[]) => void): void {
    this.peerCallback = callback;
  }
}
