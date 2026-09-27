import { ICommunicationTransport, MeshMessage, MeshPeer, TransportType } from '../../types/communication';

export class LocalBrowserTransport implements ICommunicationTransport {
  name: TransportType = 'BROWSER_LOCAL';
  private channel: BroadcastChannel | null = null;
  private messageCallback: ((message: MeshMessage) => void) | null = null;
  private peerCallback: ((peers: MeshPeer[]) => void) | null = null;
  private peerId: string;
  private peerName: string;
  private activeLocalPeers: Map<string, MeshPeer> = new Map();
  private presenceInterval: any = null;

  constructor() {
    this.peerId = 'peer-' + Math.random().toString(36).substring(2, 8);
    this.peerName = 'Device-' + this.peerId.substring(5).toUpperCase();
  }

  async isAvailable(): Promise<boolean> {
    return typeof window !== 'undefined' && 'BroadcastChannel' in window;
  }

  async init(): Promise<void> {
    if (!('BroadcastChannel' in window)) return;

    this.channel = new BroadcastChannel('n_help_mesh_bus');

    this.channel.onmessage = (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'PING_PEER') {
        if (data.senderId !== this.peerId) {
          this.activeLocalPeers.set(data.senderId, {
            id: data.senderId,
            name: data.senderName,
            transport: 'BROWSER_LOCAL',
            hopsAway: 1,
            lastSeen: Date.now()
          });
          this.notifyPeers();

          // Send PONG response
          this.channel?.postMessage({
            type: 'PONG_PEER',
            senderId: this.peerId,
            senderName: this.peerName
          });
        }
      } else if (data.type === 'PONG_PEER') {
        if (data.senderId !== this.peerId) {
          this.activeLocalPeers.set(data.senderId, {
            id: data.senderId,
            name: data.senderName,
            transport: 'BROWSER_LOCAL',
            hopsAway: 1,
            lastSeen: Date.now()
          });
          this.notifyPeers();
        }
      } else if (data.type === 'MESH_PACKET') {
        const msg = data.message as MeshMessage;
        if (msg && msg.senderId !== this.peerId) {
          if (this.messageCallback) {
            this.messageCallback(msg);
          }
        }
      }
    };

    // Initial presence broadcast
    this.broadcastPresence();

    // Recurring presence heartbeat every 10 seconds to maintain alive peer status
    if (this.presenceInterval) clearInterval(this.presenceInterval);
    this.presenceInterval = setInterval(() => {
      this.broadcastPresence();
      this.notifyPeers();
    }, 10000);

    // Immediate ping when window gains focus/visibility
    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.broadcastPresence();
          this.notifyPeers();
        }
      });
    }
  }

  broadcastPresence(): void {
    this.channel?.postMessage({
      type: 'PING_PEER',
      senderId: this.peerId,
      senderName: this.peerName
    });
  }

  async sendMessage(message: MeshMessage): Promise<boolean> {
    if (!this.channel) return false;
    this.channel.postMessage({
      type: 'MESH_PACKET',
      message
    });
    return true;
  }

  async broadcastMessage(message: MeshMessage): Promise<boolean> {
    return this.sendMessage(message);
  }

  async getPeers(): Promise<MeshPeer[]> {
    // Purge stale peers (> 60s) with 10s heartbeat grace window
    const now = Date.now();
    for (const [id, peer] of this.activeLocalPeers.entries()) {
      if (now - (peer.lastSeen || 0) > 60000) {
        this.activeLocalPeers.delete(id);
      }
    }
    return Array.from(this.activeLocalPeers.values());
  }

  onMessageReceived(callback: (message: MeshMessage) => void): void {
    this.messageCallback = callback;
  }

  onPeerStatusChanged(callback: (peers: MeshPeer[]) => void): void {
    this.peerCallback = callback;
  }

  private notifyPeers() {
    if (this.peerCallback) {
      this.getPeers().then(this.peerCallback);
    }
  }
}
