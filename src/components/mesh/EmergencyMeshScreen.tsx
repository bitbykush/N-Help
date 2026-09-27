import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Send, 
  Users, 
  AlertTriangle, 
  Heart, 
  Clock, 
  Share2, 
  Sparkles,
  User,
  Edit3,
  Key,
  Shield,
  Lock,
  Check,
  Download,
  Smartphone
} from 'lucide-react';
import { useCommunication } from '../../context/CommunicationContext';
import { useEmergency } from '../../context/EmergencyContext';
import { ChannelId } from '../../types/communication';

export const EmergencyMeshScreen: React.FC = () => {
  const { 
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
  } = useCommunication();

  const { isDemoMode, connectivity, setCurrentView } = useEmergency();
  const [inputText, setInputText] = useState('');
  const [familyInputText, setFamilyInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'peers' | 'visualizer' | 'family'>('chat');
  
  // Modals for editing username & family code
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [isEditFamilyOpen, setIsEditFamilyOpen] = useState(false);
  const [familyCodeInput, setFamilyCodeInput] = useState(familyCode);
  const [familyNameInput, setFamilyNameInput] = useState(familyName);
  const [isBtInstallModalOpen, setIsBtInstallModalOpen] = useState(false);

  const [radioDiagnostics, setRadioDiagnostics] = useState<{
    bluetoothEnabled: boolean;
    permissionsGranted: boolean;
    isScanning: boolean;
    isAdvertising: boolean;
    peersCount: number;
  } | null>(null);

  useEffect(() => {
    setNameInput(userName);
    setFamilyCodeInput(familyCode);
    setFamilyNameInput(familyName);
  }, [userName, familyCode, familyName]);

  useEffect(() => {
    const checkRadio = () => {
      const bridge = (window as any).NHelpNativeMeshBridge;
      if (typeof window !== 'undefined' && bridge?.getRadioDiagnostics) {
        try {
          const raw = bridge.getRadioDiagnostics();
          const parsed = JSON.parse(raw);
          setRadioDiagnostics(parsed);

          // Auto self-healing: if Bluetooth is ON and permissions are granted, but scanning is stopped, auto-sync!
          if (parsed.bluetoothEnabled && parsed.permissionsGranted && !parsed.isScanning && bridge.syncRadio) {
            bridge.syncRadio();
          }
        } catch {
          // ignore
        }
      }
    };
    checkRadio();
    const interval = setInterval(checkRadio, 1500);
    return () => clearInterval(interval);
  }, []);

  const channels: Array<{ id: ChannelId; name: string; desc: string }> = [
    { id: 'emergency-general', name: '#emergency-general', desc: 'General community crisis updates' },
    { id: 'medical-help', name: '#medical-help', desc: 'Critical injuries & first aid requests' },
    { id: 'shelter-info', name: '#shelter-info', desc: 'Shelter capacity & access status' },
    { id: 'family-reconnect', name: '#family-reconnect', desc: 'Private end-to-end encrypted family check-ins' },
    { id: 'supplies', name: '#supplies', desc: 'Drinking water, batteries, provisions' },
    { id: 'missing-persons', name: '#missing-persons', desc: 'Lost dependents & separation notices' },
    { id: 'local-information', name: '#local-information', desc: 'Road blockages & hazards' },
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await sendMessage(inputText);
    setInputText('');
  };

  const handleSendFamilyCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyInputText.trim()) return;
    await sendMessage(familyInputText.trim(), 'family-reconnect');
    setFamilyInputText('');
  };

  const handleSaveUserName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setIsEditUserOpen(false);
    }
  };

  const handleSaveFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyCodeInput.trim()) {
      setFamilyCode(familyCodeInput.trim().toUpperCase());
    }
    if (familyNameInput.trim()) {
      setFamilyName(familyNameInput.trim());
    }
    setIsEditFamilyOpen(false);
  };

  const handleLaunchBtChat = () => {
    // If running in native Android WebView, native BLE mesh radio is already active
    if (typeof window !== 'undefined' && (window as any).NHelpNativeMeshBridge) {
      alert("You are already using the native N-HELP Android app with active Bluetooth Low Energy mesh radio.");
      return;
    }

    const start = Date.now();
    // Attempt deep link into the installed Android app
    window.location.href = `nhelp://open?channel=${activeChannel}`;

    // If app is not installed, the browser remains active. Prompt APK installation.
    setTimeout(() => {
      if (!document.hidden && Date.now() - start < 3500) {
        setIsBtInstallModalOpen(true);
      }
    }, 1200);
  };

  const familyPings = [
    "I am safe.",
    "Sheltered at home.",
    "At designated community shelter.",
    "Need medical assistance.",
    "Going to agreed meeting location.",
    "Battery low (<15%).",
    "Cannot reach internet or cellular."
  ];

  const familyMessages = messages.filter(m => m.channelId === 'family-reconnect');
  const channelMessages = messages.filter(m => m.channelId === activeChannel);

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Status Dashboard (Requirement 5) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h1 className="font-black text-white text-base tracking-wider uppercase">EMERGENCY MESH</h1>
          </div>
          <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded font-bold">
            P2P DISASTER SUITE
          </span>
        </div>

        {/* Mesh Status Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Discovered Devices</div>
            <div className="text-sm font-black text-cyan-400 mt-0.5">{peers.length} Peers</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Max Mesh Hops</div>
            <div className="text-sm font-black text-white mt-0.5">3 Hops (TTL 4)</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Active Transport</div>
            <div className="text-xs font-bold text-amber-400 mt-1 truncate">
              {connectivity === 'ONLINE' ? 'Internet Cloud Relay' : 'Native BLE Mesh Radio'}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Grid State</div>
            <div className={`text-xs font-bold mt-1 ${connectivity === 'ONLINE' ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {connectivity === 'ONLINE' ? 'ONLINE (GRID ACTIVE)' : 'OFFLINE (MESH ACTIVE)'}
            </div>
          </div>
        </div>

        {/* Transmission Rule Banner */}
        <div className="p-2 rounded-lg bg-black/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <span>
            <strong>Routing Logic:</strong> When connected, messages route via Internet Grid. During grid collapse/airplane mode, messages hop phone-to-phone via <strong>Bluetooth Low Energy Radio</strong>.
          </span>
        </div>

        {/* Live Hardware BLE Radio Diagnostics Banner */}
        {radioDiagnostics ? (
          !radioDiagnostics.bluetoothEnabled ? (
            <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/60 text-xs text-red-200 flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <span className="font-bold block">⚠️ Bluetooth is turned OFF on your device</span>
                <span className="text-[11px] text-red-300">
                  Please turn ON Bluetooth so N-HELP can broadcast and scan emergency packets off-grid.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="font-bold text-[11px] text-white">Hardware BLE Mesh Radio Active</span>
                  <span className="text-[10px] text-cyan-300 block">
                    Device-to-Device Peripheral & Scanner • Advertising on 2.4 GHz Low Energy
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 font-bold">
                {radioDiagnostics.isScanning ? 'SCANNING' : 'RADIO READY'}
              </span>
            </div>
          )
        ) : (
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/70 border border-cyan-500/40 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <Radio className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">🌐 Web Browser Session: Internet Cloud Mesh Active</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    CONNECTED
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Connected live with Android APK users. To use 100% offline <strong>Bluetooth Radio</strong>, open the N-HELP Android App.
                </p>
              </div>
            </div>
            <button
              onClick={handleLaunchBtChat}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0 uppercase tracking-wide cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Use Bluetooth Mesh</span>
            </button>
          </div>
        )}

        {/* Real-time Multi-hop Relay Visualizer Banner */}
        {activeRelayingPacket && (
          <div className="p-3 bg-cyan-950/80 border border-cyan-500/60 rounded-xl space-y-2 animate-pulse">
            <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                PACKET TRANSMISSION: STORE-AND-FORWARD RELAY
              </span>
              <span className="font-mono text-[10px] uppercase bg-cyan-900/60 px-1.5 py-0.5 rounded border border-cyan-400/40">
                STATUS: {activeRelayingPacket.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              {activeRelayingPacket.relayPath.map((node, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-cyan-500 text-black font-black text-[10px] flex items-center justify-center shadow">
                      {i + 1}
                    </span>
                    <span className="text-[10px] text-white font-mono mt-1">{node}</span>
                  </div>
                  {i < activeRelayingPacket.relayPath.length - 1 && (
                    <div className="flex-1 h-0.5 bg-cyan-400/60 mx-2 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Prominent Verification Notice (Requirement 6) */}
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>UNVERIFIED COMMUNITY NETWORK:</strong> Messages in the mesh are peer-to-peer. Do not treat civilian community messages as official government emergency instructions.
          </p>
        </div>
      </div>

      {/* USER PROFILE & PRIVATE FAMILY BAR */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Username item */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Your Callsign / Name</div>
            <button
              onClick={() => setIsEditUserOpen(true)}
              className="text-xs font-bold text-white hover:text-cyan-300 flex items-center gap-1.5 group transition-colors"
            >
              <span>{userName}</span>
              <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Family Code item */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Private Family Key</div>
            <button
              onClick={() => setIsEditFamilyOpen(true)}
              className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 group transition-colors"
            >
              <span>{familyCode}</span>
              <span className="text-[10px] text-slate-400">({familyName})</span>
              <Key className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: EDIT USERNAME */}
      {isEditUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <User className="w-5 h-5 text-cyan-400" />
              <span>Set Your Callsign / Username</span>
            </div>
            <p className="text-xs text-slate-300">
              This name is attached to your broadcasts so other community members and family can identify you.
            </p>
            <form onSubmit={handleSaveUserName} className="space-y-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                placeholder="e.g. Sarah, Arjun, Medic-04..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!nameInput.trim()}
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold shadow"
                >
                  Save Callsign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT FAMILY CODE & GROUP */}
      {isEditFamilyOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Configure Private Family Security</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Family safety pings are encrypted with this secret code using <strong>AES-256-GCM</strong>. Only family devices with the exact same code can decrypt and view your pings.
            </p>
            <form onSubmit={handleSaveFamily} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">FAMILY GROUP NAME</label>
                <input
                  type="text"
                  value={familyNameInput}
                  onChange={(e) => setFamilyNameInput(e.target.value)}
                  maxLength={24}
                  placeholder="e.g. Sharma Family, Alpha Crew..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">SECRET PASSCODE / PIN (E.G. SAFE-2026)</label>
                <input
                  type="text"
                  value={familyCodeInput}
                  onChange={(e) => setFamilyCodeInput(e.target.value.toUpperCase())}
                  maxLength={20}
                  placeholder="e.g. SAFE-2026, ALPHA-7..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-amber-500 uppercase"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditFamilyOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!familyCodeInput.trim()}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow"
                >
                  Save Family Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BLUETOOTH MESH REQUIRES NATIVE APP */}
      {isBtInstallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Bluetooth Low Energy Mesh</h3>
                  <span className="text-[10px] font-mono text-amber-400">OFF-GRID RADIO HARDWARE</span>
                </div>
              </div>
              <button
                onClick={() => setIsBtInstallModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-slate-800">
              <p>
                🌐 <strong>Internet Chat is live in your browser:</strong> You are already communicating in real time across the cloud with all other website and Android app users.
              </p>
              <p>
                📡 <strong>Off-grid Bluetooth Mesh requires the Native App:</strong> Web browsers are prevented by security sandboxes from broadcasting raw 2.4 GHz Bluetooth Low Energy packets without internet.
              </p>
              <p>
                To communicate <strong>100% off-grid when cellular networks or power grids collapse</strong>, open or install the standalone N-HELP Android APK.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="./nhelp-mesh.apk"
                download="nhelp-mesh.apk"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all uppercase tracking-wide"
              >
                <Download className="w-4 h-4" />
                <span>Download Standalone Android APK (3.5 MB)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `nhelp://open?channel=${activeChannel}`;
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Already Installed? Tap to Open App</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBtInstallModalOpen(false)}
                className="w-full py-2 text-slate-400 hover:text-white text-xs font-semibold text-center"
              >
                Continue in Browser (Internet Cloud Mesh)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => {
            setActiveTab('chat');
            if (activeChannel === 'family-reconnect') {
              setActiveChannel('emergency-general');
            }
          }}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === 'chat' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Channels & Chat
        </button>
        <button
          onClick={() => {
            setActiveTab('family');
            setActiveChannel('family-reconnect');
          }}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === 'family' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Family Reconnect
        </button>
        <button
          onClick={() => setActiveTab('peers')}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === 'peers' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Discovered Peers ({peers.length})
        </button>
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === 'visualizer' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Store & Forward
        </button>
      </div>

      {/* TAB 1: CHAT & CHANNELS */}
      {activeTab === 'chat' && (
        <div className="space-y-3">
          {/* Channel Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap border transition-all ${
                  activeChannel === ch.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {ch.name}
              </button>
            ))}
          </div>

          {/* Active Channel Info */}
          <div className="px-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Channel: <strong className="text-cyan-400 font-mono">{channels.find(c => c.id === activeChannel)?.name}</strong> — {channels.find(c => c.id === activeChannel)?.desc}</span>
            <span className="text-[10px] text-slate-400">Max 140 chars/msg</span>
          </div>

          {/* Message List */}
          <div className="min-h-[260px] max-h-[380px] overflow-y-auto p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
            {channelMessages.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <Radio className="w-8 h-8 text-slate-400 stroke-1" />
                <p className="text-xs">No mesh packets on this channel yet.<br/>Type below to broadcast an emergency peer packet.</p>
              </div>
            ) : (
              channelMessages.map((m) => {
                const isMe = m.senderId === userId;

                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                    {/* Header info */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                      <span className={`font-semibold ${isMe ? 'text-cyan-300' : 'text-slate-300'}`}>
                        {isMe ? `You (${m.senderName})` : m.senderName}
                      </span>
                      <span>•</span>
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>

                      {/* Verification Badge */}
                      {m.verification === 'OFFICIAL_VERIFIED' ? (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold">
                          🛡️ VERIFIED OFFICIAL
                        </span>
                      ) : m.verification === 'ACADEMIC_DEMO' ? (
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded font-bold">
                          🧪 DEMO
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded">
                          COMMUNITY
                        </span>
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                      m.verification === 'OFFICIAL_VERIFIED'
                        ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200'
                        : isMe
                        ? 'bg-cyan-600 text-white rounded-br-none shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}>
                      {m.content}

                      {/* Message Status & Hops */}
                      <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] opacity-80 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Status: <strong>{m.status}</strong></span>
                        </span>
                        <span>{m.hops} Hops (TTL: {m.ttl})</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={140}
              placeholder={`Send broadcast as ${userName} to ${channels.find(c => c.id === activeChannel)?.name}...`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: FAMILY RECONNECT (Requirement 10) */}
      {activeTab === 'family' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Heart className="w-5 h-5 text-red-500" />
                <span>PRIVATE FAMILY RECONNECT</span>
              </div>
              <button
                onClick={() => setIsEditFamilyOpen(true)}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                <span>Key: {familyCode}</span>
              </button>
            </div>

            <div className="p-3 bg-black/60 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px]">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>AES-256 Client-Side End-to-End Encryption Active</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Messages on this channel are encrypted using your secret key <strong>{familyCode}</strong>.
                In offline Bluetooth mode, other civilian phones forward the signal across town, but cannot read your message.
              </p>
            </div>

            {/* Quick Status Pings */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">1-Tap Status Pings:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {familyPings.map((ping, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendFamilyReconnectPing(ping)}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 text-left text-xs text-white font-medium flex items-center justify-between group transition-all"
                  >
                    <span>"{ping}"</span>
                    <span className="text-[10px] font-mono text-cyan-400 group-hover:text-amber-400 font-bold">
                      Transmit →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Family Messages on this Device */}
            <div className="pt-2 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Family Feed:</div>
              <div className="min-h-[140px] max-h-[220px] overflow-y-auto p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                {familyMessages.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No family check-ins recorded yet.<br/>Tap any ping above to notify your family.
                  </div>
                ) : (
                  familyMessages.map((m) => {
                    const isMe = m.senderId === userId;
                    return (
                      <div key={m.id} className={`p-2.5 rounded-lg text-xs ${
                        isMe 
                          ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-100 ml-4' 
                          : 'bg-slate-900 border border-slate-800 text-white mr-4'
                      }`}>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-amber-300">{isMe ? `You (${userName})` : m.senderName}</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div>{m.content}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Custom Family Message Input */}
            <form onSubmit={handleSendFamilyCustom} className="pt-2 flex gap-2">
              <input
                type="text"
                value={familyInputText}
                onChange={(e) => setFamilyInputText(e.target.value)}
                maxLength={140}
                placeholder={`Type private message to ${familyName} (${familyCode})...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!familyInputText.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: NEARBY PEERS */}
      {activeTab === 'peers' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Discovered Compatible Devices</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">{peers.length} Nodes</span>
            </div>

            <div className="space-y-2">
              {peers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">Searching for peers...</div>
                  <p>
                    {connectivity === 'ONLINE'
                      ? 'Listening for nearby Bluetooth LE radios & remote cloud relay nodes.'
                      : 'Scanning 2.4 GHz Bluetooth LE emergency channels for nearby N-HELP devices.'}
                  </p>
                </div>
              ) : (
                peers.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.transport === 'NATIVE_MESH' && (
                          <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-bold">
                            📡 BLE RADIO
                          </span>
                        )}
                        {p.transport === 'INTERNET' && (
                          <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                            🌐 CLOUD
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {p.transport === 'INTERNET' ? 'Internet Cloud Relay' : 'Bluetooth Low Energy Radio'} • {p.hopsAway} Hop Away {p.rssi ? `• RSSI ${p.rssi} dBm` : ''}
                      </div>
                    </div>
                    {p.batteryLevel && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        Bat: {p.batteryLevel}%
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Native BLE Promotion Card when on Web */}
            {!radioDiagnostics && (
              <div className="mt-3 p-3 rounded-lg bg-black/60 border border-cyan-500/30 flex items-center justify-between text-xs gap-2">
                <div>
                  <span className="font-bold text-white block">Looking for Offline Bluetooth Neighbors?</span>
                  <span className="text-[11px] text-slate-400">Scanning offline 2.4 GHz BLE radios requires the native Android APK.</span>
                </div>
                <button
                  onClick={handleLaunchBtChat}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shrink-0 cursor-pointer"
                >
                  Open Radio App
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: STORE & FORWARD EXPLANATION & VISUALIZER */}
      {activeTab === 'visualizer' && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Share2 className="w-5 h-5" />
            <span>HOW STORE-AND-FORWARD MESH OPERATES</span>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-2 text-[11px]">
            <p>
              When traditional telecommunication networks and electrical grids fail during a nuclear disaster, civilian smartphones create an autonomous ad-hoc radio mesh.
            </p>
            <p>
              1. <strong>Packet Origination:</strong> You compose an emergency alert or family status ping. Your phone assigns a Time-To-Live (TTL = 4) and broadcasts the packet over 2.4 GHz Bluetooth Low Energy.
            </p>
            <p>
              2. <strong>Store & Forward Hopping:</strong> Any civilian device running N-HELP within 30–100 meters receives the packet, decrements the TTL, records the hop in its local store, and re-broadcasts it to forward the signal across physical obstacles.
            </p>
            <p>
              3. <strong>Zero-Knowledge Family Privacy:</strong> Private family messages are encrypted with your family secret code. Relaying phones advance the packet without being able to read the contents.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
