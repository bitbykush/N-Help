import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChannelId, MeshMessage, MeshPeer, TransportType } from '../types/communication';
import { commManager } from '../services/communication/CommunicationManager';
import { dbService } from '../services/db';
import { userService } from '../services/userService';

interface CommunicationContextType {
  activeChannel: ChannelId;
  setActiveChannel: (channel: ChannelId) => void;
  messages: MeshMessage[];
  peers: MeshPeer[];
  activeTransport: TransportType;
  sendMessage: (content: string, channelId?: ChannelId) => Promise<void>;
  sendFamilyReconnectPing: (statusText: string) => Promise<void>;
  activeRelayingPacket: MeshMessage | null;
  userId: string;
  userName: string;
  setUserName: (name: string) => void;
  familyCode: string;
  setFamilyCode: (code: string) => void;
  familyName: string;
  setFamilyName: (name: string) => void;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeChannel, setActiveChannel] = useState<ChannelId>('emergency-general');
  const [messages, setMessages] = useState<MeshMessage[]>([]);
  const [peers, setPeers] = useState<MeshPeer[]>([]);
  const [activeTransport, setActiveTransport] = useState<TransportType>(commManager.getActiveTransportType());
  const [activeRelayingPacket, setActiveRelayingPacket] = useState<MeshMessage | null>(null);

  // User Profile state
  const [userId] = useState<string>(userService.getUserId());
  const [userName, setUserNameState] = useState<string>(userService.getUserName());
  const [familyCode, setFamilyCodeState] = useState<string>(userService.getFamilyCode());
  const [familyName, setFamilyNameState] = useState<string>(userService.getFamilyName());

  const setUserName = (name: string) => {
    userService.setUserName(name);
    setUserNameState(userService.getUserName());
  };

  const setFamilyCode = (code: string) => {
    userService.setFamilyCode(code);
    setFamilyCodeState(userService.getFamilyCode());
  };

  const setFamilyName = (name: string) => {
    userService.setFamilyName(name);
    setFamilyNameState(userService.getFamilyName());
  };

  // Load persisted messages for channel and family
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const channelMsgs = await dbService.getMessages(activeChannel);
      let combined = [...channelMsgs];
      if (activeChannel !== 'family-reconnect') {
        const famMsgs = await dbService.getMessages('family-reconnect');
        for (const fm of famMsgs) {
          if (!combined.some((m) => m.id === fm.id)) {
            combined.push(fm);
          }
        }
      }
      if (isMounted) {
        setMessages(combined.sort((a, b) => a.timestamp - b.timestamp));
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [activeChannel]);

  // Subscribe to CommManager events
  useEffect(() => {
    const unsubMsg = commManager.onMessage((newMsg) => {
      // If packet is actively relaying, trigger visualizer
      if (newMsg.status === 'RELAYED' || newMsg.status === 'QUEUED') {
        setActiveRelayingPacket(newMsg);
        setTimeout(() => setActiveRelayingPacket(null), 4000);
      }

      setMessages((prev) => {
        const existingIdx = prev.findIndex((m) => m.id === newMsg.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newMsg;
          return updated;
        }
        // Always retain messages for activeChannel AND family-reconnect
        if (newMsg.channelId === activeChannel || newMsg.channelId === 'family-reconnect') {
          return [...prev, newMsg];
        }
        return prev;
      });
    });

    const unsubPeers = commManager.onPeers((updatedPeers) => {
      setPeers(updatedPeers);
      setActiveTransport(commManager.getActiveTransportType());
    });

    return () => {
      unsubMsg();
      unsubPeers();
    };
  }, [activeChannel]);

  const sendMessage = async (content: string, channelId?: ChannelId) => {
    const targetChannel = channelId || activeChannel;
    const currentUserId = userService.getUserId();
    const currentUserName = userService.getUserName();

    const newMsg: MeshMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      senderId: currentUserId,
      senderName: currentUserName,
      channelId: targetChannel,
      content: content.trim().substring(0, 140),
      timestamp: Date.now(),
      ttl: 4,
      hops: 0,
      relayPath: ['Your Device'],
      status: 'QUEUED',
      verification: 'COMMUNITY_UNVERIFIED',
      isDemo: false
    };

    setActiveRelayingPacket(newMsg);
    await commManager.dispatchMessage(newMsg);
  };

  const sendFamilyReconnectPing = async (statusText: string) => {
    const currentUserId = userService.getUserId();
    const currentUserName = userService.getUserName();
    const currentFamilyName = userService.getFamilyName();

    const newMsg: MeshMessage = {
      id: 'fam-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      senderId: currentUserId,
      senderName: `[${currentFamilyName}] ${currentUserName}`,
      channelId: 'family-reconnect',
      content: `STATUS PING: ${statusText}`,
      timestamp: Date.now(),
      ttl: 4,
      hops: 0,
      relayPath: ['Your Device'],
      status: 'QUEUED',
      verification: 'COMMUNITY_UNVERIFIED',
      isDemo: false
    };

    setActiveRelayingPacket(newMsg);
    await commManager.dispatchMessage(newMsg);
  };

  return (
    <CommunicationContext.Provider
      value={{
        activeChannel,
        setActiveChannel,
        messages,
        peers,
        activeTransport,
        sendMessage,
        sendFamilyReconnectPing,
        activeRelayingPacket,
        userId,
        userName,
        setUserName,
        familyCode,
        setFamilyCode,
        familyName,
        setFamilyName
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (!context) throw new Error('useCommunication must be used within a CommunicationProvider');
  return context;
};
