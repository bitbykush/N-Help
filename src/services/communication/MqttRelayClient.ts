/**
 * Ultra-lightweight, zero-dependency MQTT 3.1.1 client over Secure WebSockets (WSS).
 * Connects N-HELP instances across the internet for live real-time disaster broadcasting.
 * Features automatic queued message flushing, dual-broker failover, and zero external packages.
 */

export interface MqttMessageEvent {
  topic: string;
  payload: string;
}

export interface OnlinePeerInfo {
  id: string;
  name: string;
  lastSeen: number;
}

export class MqttRelayClient {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private isConnecting = false;
  private shouldRun = false;
  private clientId: string;
  private messageListeners: ((event: MqttMessageEvent) => void)[] = [];
  private peerListeners: ((peers: OnlinePeerInfo[]) => void)[] = [];
  private activePeers: Map<string, OnlinePeerInfo> = new Map();
  private pingInterval: any = null;
  private presenceInterval: any = null;
  private reconnectTimeout: any = null;
  private peerName: string;
  private pendingQueue: Array<{ topic: string; message: string }> = [];

  // Redundant public brokers
  private brokers = [
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://broker.emqx.io:8084/mqtt'
  ];
  private currentBrokerIndex = 0;

  constructor() {
    const randomHex = Math.random().toString(36).substring(2, 8);
    this.clientId = `nhelp-${Date.now()}-${randomHex}`;
    this.peerName = `Civilian-${randomHex.toUpperCase()}`;
  }

  public setPeerName(name: string) {
    this.peerName = name;
    if (this.isConnected) {
      this.broadcastPresence();
    }
  }

  public getPeerName(): string {
    return this.peerName;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public start() {
    this.shouldRun = true;
    if (!this.isConnected && !this.isConnecting) {
      this.connect();
    }
  }

  public stop() {
    this.shouldRun = false;
    this.cleanup();
  }

  private cleanup() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.presenceInterval) clearInterval(this.presenceInterval);
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.pingInterval = null;
    this.presenceInterval = null;
    this.reconnectTimeout = null;

    if (this.ws) {
      try {
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.onmessage = null;
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
  }

  private connect() {
    if (!this.shouldRun || this.isConnected || this.isConnecting) return;
    this.isConnecting = true;

    const brokerUrl = this.brokers[this.currentBrokerIndex];
    console.log(`[MqttRelayClient] Connecting to emergency broker: ${brokerUrl}...`);

    try {
      this.ws = new WebSocket(brokerUrl, ['mqttv3.1', 'mqtt']);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        console.log('[MqttRelayClient] WebSocket transport open, sending MQTT CONNECT...');
        this.sendConnectPacket();
      };

      this.ws.onmessage = (event: MessageEvent) => {
        this.handleSocketMessage(new Uint8Array(event.data as ArrayBuffer));
      };

      this.ws.onclose = () => {
        console.warn('[MqttRelayClient] WebSocket disconnected.');
        this.handleDisconnect();
      };

      this.ws.onerror = (e) => {
        console.warn('[MqttRelayClient] WebSocket error event:', e);
        this.handleDisconnect();
      };
    } catch (err) {
      console.error('[MqttRelayClient] WebSocket constructor exception:', err);
      this.handleDisconnect();
    }
  }

  private handleDisconnect() {
    this.cleanup();
    if (!this.shouldRun) return;

    // Failover to secondary broker
    this.currentBrokerIndex = (this.currentBrokerIndex + 1) % this.brokers.length;

    this.reconnectTimeout = setTimeout(() => {
      if (this.shouldRun) this.connect();
    }, 2500);
  }

  private sendConnectPacket() {
    const encoder = new TextEncoder();
    const protoBytes = [0, 4, ...encoder.encode('MQTT')];
    const flags = 0x02; // Clean session
    const keepAlive = [0, 60]; // 60s
    const clientBytes = encoder.encode(this.clientId);
    const clientPayload = [clientBytes.length >> 8, clientBytes.length & 0xff, ...clientBytes];

    const body = [...protoBytes, 4, flags, ...keepAlive, ...clientPayload];
    const lengthBytes = this.encodeLength(body.length);
    const packet = new Uint8Array([0x10, ...lengthBytes, ...body]);

    this.sendRaw(packet);
  }

  private handleSocketMessage(data: Uint8Array) {
    if (data.length === 0) return;
    const packetType = data[0] >> 4;

    switch (packetType) {
      case 2: // CONNACK
        this.isConnected = true;
        this.isConnecting = false;
        console.log('[MqttRelayClient] Disaster Cloud Relay Authenticated & Connected!');

        // Subscribe to community channels, presence, and private family topics
        this.subscribe('nhelp/disaster/v1/#');
        this.subscribe('nhelp/family/v1/#');

        // Flush any messages that were queued while connecting
        this.flushPendingQueue();

        // Start 25s ping keep-alive
        this.pingInterval = setInterval(() => {
          this.sendRaw(new Uint8Array([0xc0, 0x00])); // PINGREQ
        }, 25000);

        // Start presence beacon
        this.broadcastPresence();
        this.presenceInterval = setInterval(() => {
          this.broadcastPresence();
          this.pruneStalePeers();
        }, 15000);
        break;

      case 3: // PUBLISH
        this.handlePublishPacket(data);
        break;

      case 13: // PINGRESP
        break;
    }
  }

  private handlePublishPacket(data: Uint8Array) {
    try {
      const { length: remainingLength, bytesRead: lenBytes } = this.decodeLength(data, 1);
      const varHeaderStart = 1 + lenBytes;

      const topicLen = (data[varHeaderStart] << 8) | data[varHeaderStart + 1];
      const topicBytes = data.slice(varHeaderStart + 2, varHeaderStart + 2 + topicLen);
      const topic = new TextDecoder().decode(topicBytes);

      const payloadStart = varHeaderStart + 2 + topicLen;
      const payloadBytes = data.slice(payloadStart, 1 + lenBytes + remainingLength);
      const payload = new TextDecoder().decode(payloadBytes);

      // Handle presence beacons
      if (topic.startsWith('nhelp/disaster/v1/presence/')) {
        try {
          const peer = JSON.parse(payload) as OnlinePeerInfo;
          if (peer.id && peer.id !== this.clientId) {
            peer.lastSeen = Date.now();
            this.activePeers.set(peer.id, peer);
            this.notifyPeerListeners();
          }
        } catch {
          // ignore
        }
        return;
      }

      // Dispatch chat or family broadcast
      for (const listener of this.messageListeners) {
        listener({ topic, payload });
      }
    } catch (e) {
      console.error('[MqttRelayClient] Error parsing publish packet:', e);
    }
  }

  public subscribe(topic: string, packetId = 1) {
    if (!this.isConnected || !this.ws) return;
    const encoder = new TextEncoder();
    const topicBytes = encoder.encode(topic);

    const body = [
      packetId >> 8,
      packetId & 0xff,
      topicBytes.length >> 8,
      topicBytes.length & 0xff,
      ...topicBytes,
      0x00 // QoS 0
    ];

    const lenBytes = this.encodeLength(body.length);
    const packet = new Uint8Array([0x82, ...lenBytes, ...body]);
    this.sendRaw(packet);
  }

  public publish(topic: string, message: string): boolean {
    if (!this.isConnected || !this.ws) {
      // Buffer packet in memory until connection is ready
      console.log(`[MqttRelayClient] Queueing broadcast until relay connects: ${topic}`);
      this.pendingQueue.push({ topic, message });
      if (this.shouldRun && !this.isConnecting) {
        this.connect();
      }
      return true;
    }

    return this.sendPublishPacket(topic, message);
  }

  private sendPublishPacket(topic: string, message: string): boolean {
    try {
      const encoder = new TextEncoder();
      const topicBytes = encoder.encode(topic);
      const msgBytes = encoder.encode(message);

      const body = [
        topicBytes.length >> 8,
        topicBytes.length & 0xff,
        ...topicBytes,
        ...msgBytes
      ];

      const lenBytes = this.encodeLength(body.length);
      const packet = new Uint8Array([0x30, ...lenBytes, ...body]);
      this.sendRaw(packet);
      return true;
    } catch (e) {
      console.error('[MqttRelayClient] Error sending publish packet:', e);
      return false;
    }
  }

  private flushPendingQueue() {
    if (this.pendingQueue.length === 0) return;
    console.log(`[MqttRelayClient] Flushing ${this.pendingQueue.length} queued messages to relay...`);
    const queued = [...this.pendingQueue];
    this.pendingQueue = [];
    for (const item of queued) {
      this.sendPublishPacket(item.topic, item.message);
    }
  }

  private broadcastPresence() {
    const presenceData: OnlinePeerInfo = {
      id: this.clientId,
      name: this.peerName,
      lastSeen: Date.now()
    };
    this.sendPublishPacket(`nhelp/disaster/v1/presence/${this.clientId}`, JSON.stringify(presenceData));
  }

  private pruneStalePeers() {
    const now = Date.now();
    let changed = false;
    for (const [id, peer] of this.activePeers.entries()) {
      if (now - peer.lastSeen > 75000) {
        this.activePeers.delete(id);
        changed = true;
      }
    }
    if (changed) {
      this.notifyPeerListeners();
    }
  }

  public getOnlinePeers(): OnlinePeerInfo[] {
    this.pruneStalePeers();
    return Array.from(this.activePeers.values());
  }

  public onMessage(listener: (event: MqttMessageEvent) => void) {
    this.messageListeners.push(listener);
  }

  public onPeersChanged(listener: (peers: OnlinePeerInfo[]) => void) {
    this.peerListeners.push(listener);
  }

  private notifyPeerListeners() {
    const peers = this.getOnlinePeers();
    for (const listener of this.peerListeners) {
      listener(peers);
    }
  }

  private sendRaw(packet: Uint8Array) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(packet.buffer);
    }
  }

  private encodeLength(len: number): number[] {
    const bytes: number[] = [];
    let x = len;
    do {
      let encodedByte = x % 128;
      x = Math.floor(x / 128);
      if (x > 0) {
        encodedByte = encodedByte | 128;
      }
      bytes.push(encodedByte);
    } while (x > 0);
    return bytes;
  }

  private decodeLength(data: Uint8Array, offset: number): { length: number; bytesRead: number } {
    let multiplier = 1;
    let value = 0;
    let bytesRead = 0;
    let encodedByte = 0;
    do {
      encodedByte = data[offset + bytesRead];
      value += (encodedByte & 127) * multiplier;
      multiplier *= 128;
      bytesRead++;
    } while ((encodedByte & 128) !== 0 && bytesRead < 4);
    return { length: value, bytesRead };
  }
}

export const mqttRelay = new MqttRelayClient();
