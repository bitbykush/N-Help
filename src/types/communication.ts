export type TransportType = 'INTERNET' | 'BROWSER_LOCAL' | 'NATIVE_MESH' | 'DEMO_MESH';

export type MessageStatus = 'QUEUED' | 'RELAYED' | 'DELIVERED' | 'FAILED';

export type VerificationType = 'OFFICIAL_VERIFIED' | 'COMMUNITY_UNVERIFIED' | 'ACADEMIC_DEMO';

export type ChannelId = 
  | 'emergency-general'
  | 'medical-help'
  | 'shelter-info'
  | 'family-reconnect'
  | 'supplies'
  | 'missing-persons'
  | 'local-information';

export interface MeshPeer {
  id: string;
  name: string;
  transport: TransportType;
  hopsAway: number;
  batteryLevel?: number;
  lastSeen: number;
  rssi?: number;
}

export interface MeshMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId?: string; // If omitted, broadcast to channel
  channelId: ChannelId;
  content: string; // Max 140 chars
  timestamp: number;
  ttl: number; // Decrement per hop
  hops: number;
  relayPath: string[]; // Node IDs: ['Device A', 'Peer B', 'Peer C']
  status: MessageStatus;
  verification: VerificationType;
  isDemo: boolean;
}

export interface ICommunicationTransport {
  name: TransportType;
  isAvailable(): Promise<boolean>;
  init(): Promise<void>;
  sendMessage(message: MeshMessage): Promise<boolean>;
  broadcastMessage(message: MeshMessage): Promise<boolean>;
  getPeers(): Promise<MeshPeer[]>;
  onMessageReceived(callback: (message: MeshMessage) => void): void;
  onPeerStatusChanged(callback: (peers: MeshPeer[]) => void): void;
}
