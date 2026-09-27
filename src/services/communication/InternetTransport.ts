import { ICommunicationTransport, MeshMessage, MeshPeer, TransportType } from '../../types/communication';
import { mqttRelay } from './MqttRelayClient';
import { userService } from '../userService';

export class InternetTransport implements ICommunicationTransport {
  name: TransportType = 'INTERNET';
  private messageCallback: ((message: MeshMessage) => void) | null = null;
  private peerCallback: ((peers: MeshPeer[]) => void) | null = null;

  async isAvailable(): Promise<boolean> {
    if (typeof window !== 'undefined') {
      const bridge = (window as any).NHelpNativeMeshBridge;
      if (bridge && typeof bridge.isNetworkOnline === 'function') {
        try {
          return bridge.isNetworkOnline();
        } catch {
          // fallback
        }
      }
      if (typeof (window as any).__nativeNetworkOnline === 'boolean') {
        return (window as any).__nativeNetworkOnline;
      }
    }
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    mqttRelay.setPeerName(userService.getUserName());

    // Always start relay client
    mqttRelay.start();

    window.addEventListener('online', () => {
      mqttRelay.setPeerName(userService.getUserName());
      mqttRelay.start();
      this.notifyPeers();
    });

    window.addEventListener('offline', () => {
      mqttRelay.stop();
      this.notifyPeers();
    });

    // Forward incoming remote internet broadcasts to N-HELP message listeners
    mqttRelay.onMessage(async ({ topic, payload }) => {
      try {
        const raw = JSON.parse(payload);
        if (!raw || !raw.id) return;

        // Check if message is a private family broadcast
        if (topic.startsWith('nhelp/family/v1/')) {
          const myFamilyHash = userService.getFamilyHash();
          const targetFamilyHash = topic.split('/')[3] || raw.familyHash;

          // Only process if family hash matches
          if (targetFamilyHash === myFamilyHash) {
            const decrypted = await userService.decryptFamilyContent(raw.content);
            if (decrypted) {
              const familyMsg: MeshMessage = {
                ...raw,
                content: decrypted,
                status: 'DELIVERED'
              };
              if (this.messageCallback) this.messageCallback(familyMsg);
            }
          }
          return;
        }

        // Standard community channel packet
        const msg = raw as MeshMessage;
        msg.status = 'DELIVERED';
        if (this.messageCallback) {
          this.messageCallback(msg);
        }
      } catch (e) {
        console.warn('[InternetTransport] Malformed packet received:', e);
      }
    });

    // Forward discovered online community members
    mqttRelay.onPeersChanged((onlinePeers) => {
      if (this.peerCallback) {
        const myId = userService.getUserId();
        const meshPeers: MeshPeer[] = onlinePeers
          .filter((p) => p.id !== myId)
          .map((p) => ({
            id: p.id,
            name: `${p.name} (Online)`,
            transport: 'INTERNET',
            hopsAway: 1,
            lastSeen: p.lastSeen
          }));
        this.peerCallback(meshPeers);
      }
    });
  }

  async sendMessage(message: MeshMessage): Promise<boolean> {
    mqttRelay.setPeerName(userService.getUserName());
    const online = await this.isAvailable();
    if (!online) return false;

    // Route private family pings to secure family topic with AES-GCM
    if (message.channelId === 'family-reconnect') {
      const familyHash = userService.getFamilyHash();
      const encrypted = await userService.encryptFamilyContent(message.content);
      const packet = {
        ...message,
        content: encrypted,
        familyHash,
        isFamilyEncrypted: true
      };

      const topic = `nhelp/family/v1/${familyHash}`;
      const sent = mqttRelay.publish(topic, JSON.stringify(packet));
      message.status = sent ? 'DELIVERED' : 'QUEUED';
      return sent;
    }

    // Standard community channel broadcast
    const topic = `nhelp/disaster/v1/channel/${message.channelId}`;
    const sent = mqttRelay.publish(topic, JSON.stringify(message));
    message.status = sent ? 'DELIVERED' : 'QUEUED';
    return sent;
  }

  async broadcastMessage(message: MeshMessage): Promise<boolean> {
    return this.sendMessage(message);
  }

  async getPeers(): Promise<MeshPeer[]> {
    const online = await this.isAvailable();
    if (!online) return [];

    const myId = userService.getUserId();
    const onlinePeers = mqttRelay.getOnlinePeers();
    return onlinePeers
      .filter((p) => p.id !== myId)
      .map((p) => ({
        id: p.id,
        name: `${p.name} (Online)`,
        transport: 'INTERNET',
        hopsAway: 1,
        lastSeen: p.lastSeen
      }));
  }

  onMessageReceived(callback: (message: MeshMessage) => void): void {
    this.messageCallback = callback;
  }

  onPeerStatusChanged(callback: (peers: MeshPeer[]) => void): void {
    this.peerCallback = callback;
  }

  private async notifyPeers() {
    if (this.peerCallback) {
      const peers = await this.getPeers();
      this.peerCallback(peers);
    }
  }
}
