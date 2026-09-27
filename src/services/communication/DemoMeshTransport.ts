import { ICommunicationTransport, MeshMessage, MeshPeer, TransportType } from '../../types/communication';

export class DemoMeshTransport implements ICommunicationTransport {
  name: TransportType = 'DEMO_MESH';
  private messageCallback: ((message: MeshMessage) => void) | null = null;
  private peerCallback: ((peers: MeshPeer[]) => void) | null = null;

  private virtualPeers: MeshPeer[] = [
    {
      id: 'demo-peer-alpha',
      name: 'Relay-Alpha (District Hospital)',
      transport: 'DEMO_MESH',
      hopsAway: 1,
      batteryLevel: 88,
      lastSeen: Date.now(),
      rssi: -62
    },
    {
      id: 'demo-peer-bravo',
      name: 'Relay-Bravo (Volunteer Mobile Unit)',
      transport: 'DEMO_MESH',
      hopsAway: 2,
      batteryLevel: 64,
      lastSeen: Date.now() - 5000,
      rssi: -78
    },
    {
      id: 'demo-peer-charlie',
      name: 'Relay-Charlie (Community Shelter 4)',
      transport: 'DEMO_MESH',
      hopsAway: 3,
      batteryLevel: 92,
      lastSeen: Date.now() - 12000,
      rssi: -84
    }
  ];

  async isAvailable(): Promise<boolean> {
    return true; // Always available in academic demonstration
  }

  async init(): Promise<void> {
    // Initial peer notification
    setTimeout(() => this.notifyPeers(), 500);
  }

  async sendMessage(message: MeshMessage): Promise<boolean> {
    // Simulate store-and-forward multi-hop journey:
    // Step 1: Queued (0s)
    message.status = 'QUEUED';
    message.relayPath = ['User Device'];
    message.isDemo = true;

    // Step 2: Relayed through Peer Alpha -> Peer Bravo (after 1.2s)
    setTimeout(() => {
      message.status = 'RELAYED';
      message.hops = 1;
      message.relayPath = ['User Device', 'Relay-Alpha'];
      if (this.messageCallback) this.messageCallback({ ...message });

      // Step 3: Delivered to Destination / Channel (after 2.5s)
      setTimeout(() => {
        message.status = 'DELIVERED';
        message.hops = 2;
        message.relayPath = ['User Device', 'Relay-Alpha', 'Relay-Bravo', 'Relay-Charlie'];
        if (this.messageCallback) this.messageCallback({ ...message });

        // Optional automated peer response in demo mode after 4s
        if (message.channelId === 'medical-help') {
          setTimeout(() => this.injectDemoResponse('Relay-Alpha (Hospital)', 'medical-help', 'Acknowledged. First Aid team stationed at District Center.'), 1500);
        } else if (message.channelId === 'supplies') {
          setTimeout(() => this.injectDemoResponse('Relay-Charlie (Shelter)', 'supplies', 'Clean drinking water stock available at Community Hall.'), 1500);
        }
      }, 1500);
    }, 1200);

    return true;
  }

  async broadcastMessage(message: MeshMessage): Promise<boolean> {
    return this.sendMessage(message);
  }

  private injectDemoResponse(senderName: string, channelId: any, text: string) {
    if (!this.messageCallback) return;
    const responseMsg: MeshMessage = {
      id: 'demo-resp-' + Date.now(),
      senderId: 'demo-auto-node',
      senderName,
      channelId,
      content: text,
      timestamp: Date.now(),
      ttl: 3,
      hops: 2,
      relayPath: [senderName, 'User Device'],
      status: 'DELIVERED',
      verification: 'ACADEMIC_DEMO',
      isDemo: true
    };
    this.messageCallback(responseMsg);
  }

  async getPeers(): Promise<MeshPeer[]> {
    return this.virtualPeers;
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
