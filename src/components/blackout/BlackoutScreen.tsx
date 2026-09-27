import React, { useState, useEffect } from 'react';
import { 
  Battery, 
  BatteryCharging, 
  Wifi, 
  WifiOff, 
  Radio, 
  ShieldAlert, 
  Volume2, 
  Moon, 
  Sun, 
  Zap, 
  PhoneCall, 
  Compass, 
  CheckSquare, 
  FileText,
  AlertTriangle,
  Lightbulb,
  Share2
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useTranslation } from '../../i18n/useTranslation';

export const BlackoutScreen: React.FC = () => {
  const { setCurrentView, batteryLevel, isBatteryCharging, connectivity } = useEmergency();
  const { t } = useTranslation();
  
  const [isRedLightMode, setIsRedLightMode] = useState<boolean>(false);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [sosColor, setSosColor] = useState<string>('#000000');
  const [quickNote, setQuickNote] = useState<string>(() => {
    return localStorage.getItem('n_help_blackout_note') || '';
  });

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setQuickNote(val);
    localStorage.setItem('n_help_blackout_note', val);
  };

  // SOS Morse Code pattern (... --- ...)
  useEffect(() => {
    if (!sosActive) {
      setSosColor('#000000');
      return;
    }

    const dot = 200;
    const dash = 600;
    const symbolGap = 200;
    const letterGap = 600;
    const wordGap = 1400;

    // Pattern in ms: [on, off, on, off, ...]
    const pattern = [
      dot, symbolGap, dot, symbolGap, dot, letterGap, // S (...)
      dash, symbolGap, dash, symbolGap, dash, letterGap, // O (---)
      dot, symbolGap, dot, symbolGap, dot, wordGap // S (...)
    ];

    let timer: NodeJS.Timeout;
    let step = 0;

    const playStep = () => {
      if (!sosActive) return;
      const isOn = step % 2 === 0;
      setSosColor(isOn ? '#FFFFFF' : '#000000');
      const duration = pattern[step % pattern.length];
      step++;
      timer = setTimeout(playStep, duration);
    };

    playStep();

    return () => clearTimeout(timer);
  }, [sosActive]);

  const textColor = isRedLightMode ? 'text-red-500' : 'text-zinc-100';
  const borderColor = isRedLightMode ? 'border-red-950' : 'border-zinc-800';
  const cardBg = isRedLightMode ? 'bg-red-950/20' : 'bg-zinc-950';

  return (
    <div className={`min-h-screen bg-black ${textColor} p-4 pb-24 font-mono transition-colors duration-300`}>
      {/* SOS Strobe Overlay */}
      {sosActive && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-black transition-colors"
          style={{ backgroundColor: sosColor }}
        >
          <div className="bg-black/90 text-white p-6 rounded-2xl text-center border-2 border-red-500 max-w-sm">
            <h2 className="text-2xl font-black text-red-500 animate-pulse mb-2">SOS SIGNAL ACTIVE</h2>
            <p className="text-xs text-zinc-400 mb-6 font-sans">
              Displaying optical Morse Code SOS (... --- ...). Hold screen toward rescue personnel or drone observers.
            </p>
            <button
              onClick={() => setSosActive(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm"
            >
              STOP SIGNAL
            </button>
          </div>
        </div>
      )}

      {/* Screen Title & Toggles */}
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: isRedLightMode ? '#450a0a' : '#27272a' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base font-bold tracking-wider uppercase">
              OLED BLACKOUT MONITOR
            </h1>
          </div>
          <p className="text-[10px] mt-0.5 tracking-tight" style={{ color: isRedLightMode ? '#991b1b' : '#71717a' }}>
            LOW POWER DRAW (0% PIXEL POWER ON TRUE BLACK)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Red Light Filter Toggle */}
          <button
            onClick={() => setIsRedLightMode(!isRedLightMode)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isRedLightMode 
                ? 'bg-red-950/60 border-red-600 text-red-400' 
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
            title="Red Night Vision Mode protects eye rod cells in total darkness"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{isRedLightMode ? 'RED ON' : 'NIGHT RED'}</span>
          </button>
        </div>
      </div>

      {/* Battery & Hardware Radio Telemetry */}
      <div className={`p-4 rounded-xl border ${borderColor} ${cardBg} mb-4`}>
        <div className="grid grid-cols-2 gap-4">
          {/* Battery Status */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: isRedLightMode ? '#991b1b' : '#71717a' }}>
              RESERVE BATTERY
            </span>
            <div className="flex items-center gap-2">
              {isBatteryCharging ? (
                <BatteryCharging className="w-6 h-6 text-emerald-400" />
              ) : (
                <Battery className={`w-6 h-6 ${batteryLevel < 20 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`} />
              )}
              <span className="text-2xl font-black tracking-tight">{batteryLevel}%</span>
            </div>
            <p className="text-[10px] text-zinc-500">
              {isBatteryCharging ? 'Charging on auxiliary source' : 'Estimate: ~14h in low OLED draw'}
            </p>
          </div>

          {/* Radio Link Status */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: isRedLightMode ? '#991b1b' : '#71717a' }}>
              RADIO PERIPHERALS
            </span>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold text-zinc-200">
                {connectivity === 'ONLINE' ? 'CELLULAR/WIFI' : 'BLE MESH PEER'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">
              Offline P2P Mesh Radio Active
            </p>
          </div>
        </div>

        {/* Energy saving tip bar */}
        <div className="mt-3 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-amber-500">
            <Zap className="w-3.5 h-3.5" />
            <span>Power Saver Rule:</span>
          </span>
          <span className="text-zinc-400 text-[10px]">Airplane Mode + BLE mesh saves up to 40% battery</span>
        </div>
      </div>

      {/* Emergency Quick Action Matrix */}
      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: isRedLightMode ? '#991b1b' : '#71717a' }}>
          OFFLINE CACHED EMERGENCY LAUNCHPAD
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setCurrentView('emergency-now')}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-transform active:scale-95 ${
              isRedLightMode 
                ? 'bg-red-950/40 border-red-700 text-red-400 hover:bg-red-900/30' 
                : 'bg-red-950/20 border-red-900/60 text-red-200 hover:bg-red-950/40'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase">EMERGENCY NOW</div>
              <div className="text-[10px] text-zinc-400">Triage, Shelter & Decontam</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('mesh')}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-transform active:scale-95 ${
              isRedLightMode 
                ? 'bg-zinc-950 border-red-900 text-red-400' 
                : 'bg-cyan-950/20 border-cyan-900/50 text-cyan-200 hover:bg-cyan-950/40'
            }`}
          >
            <Radio className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase">MESH COMMUNICATOR</div>
              <div className="text-[10px] text-zinc-400">Offline peer-to-peer radio</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('kit')}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-transform active:scale-95 ${
              isRedLightMode 
                ? 'bg-zinc-950 border-red-900 text-red-400' 
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <CheckSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase">72H KIT CHECKLIST</div>
              <div className="text-[10px] text-zinc-400">Supplies & Water tracker</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('contacts')}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-transform active:scale-95 ${
              isRedLightMode 
                ? 'bg-zinc-950 border-red-900 text-red-400' 
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase">HOTLINES & DIRECTORY</div>
              <div className="text-[10px] text-zinc-400">112, 1078 & Ham frequencies</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('map')}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-transform active:scale-95 ${
              isRedLightMode 
                ? 'bg-zinc-950 border-red-900 text-red-400' 
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Compass className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase">OFFLINE DISASTER MAP</div>
              <div className="text-[10px] text-zinc-400">Narora PAZ/UPZ & Shelters</div>
            </div>
          </button>

          <button
            onClick={() => setSosActive(true)}
            className="p-3.5 rounded-xl border border-red-600 bg-red-600/20 text-red-200 hover:bg-red-600/30 text-left flex items-start gap-2.5 transition-transform active:scale-95"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="text-xs font-bold uppercase text-red-400">OPTICAL SOS STROBE</div>
              <div className="text-[10px] text-red-300">Morse code screen flash</div>
            </div>
          </button>
        </div>
      </div>

      {/* Civil Defense Emergency Radio Frequency Guide */}
      <div className={`p-4 rounded-xl border ${borderColor} ${cardBg} mb-4`}>
        <div className="flex items-center gap-2 mb-2.5">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            CIVIL DEFENSE AM/FM BROADCAST FREQUENCIES
          </h3>
        </div>
        <p className="text-[11px] text-zinc-400 mb-3">
          If cellular towers collapse, battery/crank AM/FM radios provide official instructions from the National Disaster Management Authority (NDMA) and All India Radio (Akashvani).
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center p-2 rounded bg-black/60 border border-zinc-900">
            <div>
              <span className="font-bold text-zinc-200">All India Radio National MW</span>
              <p className="text-[10px] text-zinc-500">Primary long-distance emergency band</p>
            </div>
            <span className="font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/50">
              666 kHz AM
            </span>
          </div>

          <div className="flex justify-between items-center p-2 rounded bg-black/60 border border-zinc-900">
            <div>
              <span className="font-bold text-zinc-200">AIR Regional Delhi / UP North</span>
              <p className="text-[10px] text-zinc-500">Northern Zone Emergency Transmitter</p>
            </div>
            <span className="font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/50">
              819 kHz AM
            </span>
          </div>

          <div className="flex justify-between items-center p-2 rounded bg-black/60 border border-zinc-900">
            <div>
              <span className="font-bold text-zinc-200">AIR FM Gold National Civil Channel</span>
              <p className="text-[10px] text-zinc-500">High-fidelity local metro broadcast</p>
            </div>
            <span className="font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900/50">
              106.4 MHz FM
            </span>
          </div>

          <div className="flex justify-between items-center p-2 rounded bg-black/60 border border-zinc-900">
            <div>
              <span className="font-bold text-zinc-200">Amateur Radio (Ham) Disaster Frequency</span>
              <p className="text-[10px] text-zinc-500">IARU Region 3 Emergency Calling</p>
            </div>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/50">
              145.500 MHz
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Scratchpad */}
      <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              OFFLINE EMERGENCY NOTEBOOK
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500">Auto-saved to device storage</span>
        </div>
        <textarea
          value={quickNote}
          onChange={handleNoteChange}
          placeholder="Record emergency notes, shelter room number, names, family rendezvous plans or blood types here..."
          className="w-full h-24 bg-black border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-mono resize-none"
        />
      </div>
    </div>
  );
};
