import { ICommunicationTransport, MeshMessage, MeshPeer, TransportType, MessageStatus } from '../../types/communication';
import { InternetTransport } from './InternetTransport';
import { LocalBrowserTransport } from './LocalBrowserTransport';
import { NativeMeshTransport } from './NativeMeshTransport';
import { DemoMeshTransport } from './DemoMeshTransport';
import { dbService } from '../db';
import { userService } from '../userService';

export class CommunicationManager {
  private transports: Map<TransportType, ICommunicationTransport> = new Map();
  private activeTransportType: TransportType = 'BROWSER_LOCAL';
  private messageListeners: ((msg: MeshMessage) => void)[] = [];
  private peerListeners: ((peers: MeshPeer[]) => void)[] = [];
  private seenMessageIds: Set<string> = new Set();
  private currentPeers: MeshPeer[] = [];
  private isDemoMode: boolean = false;

  constructor() {
    this.registerTransports();
    this.init();
  }

  private registerTransports() {
    this.transports.set('INTERNET', new InternetTransport());
    this.transports.set('BROWSER_LOCAL', new LocalBrowserTransport());
    this.transports.set('NATIVE_MESH', new NativeMeshTransport());
    this.transports.set('DEMO_MESH', new DemoMeshTransport());
  }

  private async init() {
    // Initialize all transports and attach packet listeners
    for (const [type, transport] of this.transports.entries()) {
      await transport.init();

      transport.onMessageReceived((msg) => {
        this.handleIncomingMessage(msg, type);
      });

      transport.onPeerStatusChanged(async () => {
        const peers = await this.getPeers();
        this.notifyPeerListeners(peers);
      });
    }

    // Auto-select transport based on environment
    await this.evaluateActiveTransport();

    // Listen to network & radio changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.evaluateActiveTransport());
      window.addEventListener('offline', () => this.evaluateActiveTransport());
      window.addEventListener('nhelp_radio_changed', () => this.evaluateActiveTransport());
      (window as any).__onNHelpRadioChanged = () => this.evaluateActiveTransport();
    }
  }

  public async setDemoMode(enabled: boolean) {
    this.isDemoMode = enabled;
    if (enabled) {
      this.activeTransportType = 'DEMO_MESH';
    } else {
      await this.evaluateActiveTransport();
    }
    const peers = await this.getPeers();
    this.notifyPeerListeners(peers);
  }

  public async evaluateActiveTransport(): Promise<TransportType> {
    if (this.isDemoMode) {
      this.activeTransportType = 'DEMO_MESH';
      return 'DEMO_MESH';
    }

    const nativeTransport = this.transports.get('NATIVE_MESH');
    const internetTransport = this.transports.get('INTERNET');

    const nativeAvailable = nativeTransport ? await nativeTransport.isAvailable() : false;
    const internetAvailable = internetTransport ? await internetTransport.isAvailable() : false;

    if (nativeAvailable && internetAvailable) {
      this.activeTransportType = 'NATIVE_MESH'; // Hybrid mode (BLE Radio + Internet Relay concurrent)
    } else if (nativeAvailable) {
      this.activeTransportType = 'NATIVE_MESH';
    } else if (internetAvailable) {
      this.activeTransportType = 'INTERNET';
    } else {
      this.activeTransportType = 'BROWSER_LOCAL';
    }

    const peers = await this.getPeers();
    this.notifyPeerListeners(peers);

    return this.activeTransportType;
  }

  public getActiveTransportType(): TransportType {
    return this.activeTransportType;
  }

  public async dispatchMessage(msg: MeshMessage): Promise<MessageStatus> {
    // Deduplication check
    if (this.seenMessageIds.has(msg.id)) {
      return msg.status;
    }
    this.seenMessageIds.add(msg.id);

    // Save to local database
    await dbService.saveMessage(msg);

    if (this.isDemoMode) {
      const demoTransport = this.transports.get('DEMO_MESH');
      if (demoTransport) await demoTransport.sendMessage(msg);
      msg.status = 'RELAYED';
      await dbService.saveMessage(msg);
      this.notifyMessageListeners(msg);
      return 'RELAYED';
    }

    let sentNative = false;
    let sentInternet = false;

    // 1. ALWAYS dispatch via Native BLE Mesh if available (reaches all nearby nodes offline & online)
    const nativeTransport = this.transports.get('NATIVE_MESH');
    if (nativeTransport && await nativeTransport.isAvailable()) {
      try {
        sentNative = await nativeTransport.sendMessage(msg);
      } catch (e) {
        console.warn('[CommManager] Native BLE dispatch error:', e);
      }
    }

    // 2. ALWAYS dispatch via Internet if available (reaches remote users over MQTT)
    const internetTransport = this.transports.get('INTERNET');
    if (internetTransport && await internetTransport.isAvailable()) {
      try {
        sentInternet = await internetTransport.sendMessage(msg);
      } catch (e) {
        console.warn('[CommManager] Internet dispatch error:', e);
      }
    }

    // 3. Fallback to Local Browser Transport (BroadcastChannel) if neither native nor internet sent
    if (!sentNative && !sentInternet) {
      const browserTransport = this.transports.get('BROWSER_LOCAL');
      if (browserTransport && await browserTransport.isAvailable()) {
        await browserTransport.sendMessage(msg);
      }
    }

    if (sentNative || sentInternet) {
      msg.status = sentInternet ? 'DELIVERED' : 'RELAYED';
    } else {
      msg.status = 'QUEUED';
    }

    await dbService.saveMessage(msg);
    this.notifyMessageListeners(msg);
    return msg.status;
  }

  private async handleIncomingMessage(msg: MeshMessage, fromTransport: TransportType) {
    const myId = userService.getUserId();
    // If packet was originated by this device (echoed by radio or network broker), do not duplicate
    if (msg.senderId === myId) {
      if (!this.seenMessageIds.has(msg.id)) {
        this.seenMessageIds.add(msg.id);
        msg.status = 'DELIVERED';
        await dbService.saveMessage(msg);
        this.notifyMessageListeners(msg);
      }
      return;
    }

    if (this.seenMessageIds.has(msg.id)) return;
    this.seenMessageIds.add(msg.id);

    // Persist received packet
    await dbService.saveMessage(msg);

    this.notifyMessageListeners(msg);
  }

  public async getPeers(): Promise<MeshPeer[]> {
    if (this.isDemoMode) {
      const demo = this.transports.get('DEMO_MESH');
      return demo ? await demo.getPeers() : [];
    }

    const peerMap = new Map<string, MeshPeer>();

    // 1. Fetch native BLE mesh peers
    const nativeTransport = this.transports.get('NATIVE_MESH');
    if (nativeTransport && await nativeTransport.isAvailable()) {
      const blePeers = await nativeTransport.getPeers();
      for (const p of blePeers) {
        peerMap.set(p.id, p);
      }
    }

    // 2. Fetch internet MQTT peers
    const internetTransport = this.transports.get('INTERNET');
    if (internetTransport && await internetTransport.isAvailable()) {
      const netPeers = await internetTransport.getPeers();
      for (const p of netPeers) {
        peerMap.set(p.id, p);
      }
    }

    // 3. Fallback to browser peers if empty
    if (peerMap.size === 0) {
      const browserTransport = this.transports.get('BROWSER_LOCAL');
      if (browserTransport && await browserTransport.isAvailable()) {
        const bPeers = await browserTransport.getPeers();
        for (const p of bPeers) {
          peerMap.set(p.id, p);
        }
      }
    }

    this.currentPeers = Array.from(peerMap.values());
    return this.currentPeers;
  }

  public onMessage(callback: (msg: MeshMessage) => void): () => void {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== callback);
    };
  }

  public onPeers(callback: (peers: MeshPeer[]) => void): () => void {
    this.peerListeners.push(callback);
    callback(this.currentPeers);
    return () => {
      this.peerListeners = this.peerListeners.filter(l => l !== callback);
    };
  }

  private notifyMessageListeners(msg: MeshMessage) {
    this.messageListeners.forEach(listener => listener(msg));
  }

  private notifyPeerListeners(peers: MeshPeer[]) {
    this.peerListeners.forEach(listener => listener(peers));
  }
}

export const commManager = new CommunicationManager();
