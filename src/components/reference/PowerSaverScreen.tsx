import React from 'react';
import { 
  Zap, 
  Battery, 
  Smartphone, 
  Moon, 
  Sun, 
  Clock, 
  Radio, 
  ShieldCheck, 
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const PowerSaverScreen: React.FC = () => {
  const { setCurrentView, batteryLevel } = useEmergency();

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              DEVICE BATTERY PRESERVATION PROTOCOL
            </h1>
            <p className="text-xs text-zinc-400">
              Extending Smartphone Lifespan During Extended Grid Blackouts
            </p>
          </div>
        </div>
      </div>

      {/* Top Protocol: Top of the Hour Protocol */}
      <div className="p-4 bg-amber-950/20 border border-amber-500/50 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            THE "TOP-OF-THE-HOUR" RADIO WINDOW PROTOCOL
          </h2>
        </div>
        <p className="text-xs text-zinc-200 leading-relaxed">
          In a long-term blackout, keeping cellular, Wi-Fi, and screens on continuously drains batteries in under 12 hours. Civil defense teams practice <strong>Synchronized Radio Windows</strong>:
        </p>
        <div className="p-3 bg-black/60 rounded-lg border border-zinc-800 text-xs font-mono text-amber-200 space-y-1">
          <p>• Power on devices ONLY for <strong>5 minutes</strong> at the top of each hour (e.g. 09:00 - 09:05, 10:00 - 10:05).</p>
          <p>• Check for incoming emergency mesh packets or AM radio broadcasts.</p>
          <p>• Power off or return to Airplane Mode with screen off for the remaining 55 minutes.</p>
          <p className="text-emerald-400 font-bold pt-1">Result: Extends a single 100% phone charge from 1 day to 6-8 days!</p>
        </div>
      </div>

      {/* Hardware Optimization Steps */}
      <div className="space-y-3">
        {/* Step 1: Display */}
        <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2.5">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              1. Display & Screen Dimming (Largest Battery Drain)
            </h3>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1.5 pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Use Pure Black OLED Theme:</strong> OLED screens consume 0 milliwatts on pixels rendering true black (<code>#000000</code>). Use N-HELP's OLED Blackout mode.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Lower Brightness to 15-20%:</strong> Brightness above 50% exponentially accelerates battery depletion.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Reduce Screen Timeout:</strong> Set auto-lock timeout to 30 seconds or 15 seconds.</span>
            </li>
          </ul>
        </div>

        {/* Step 2: Radios */}
        <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2.5">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              2. Radio Transceiver Management
            </h3>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1.5 pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Turn on Airplane Mode:</strong> When cell towers lose grid power, your phone cranks transmission power to maximum (Class 4 / 2W pulses) hunting for signals, killing batteries rapidly.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Turn off Wi-Fi & Hotspot:</strong> If home routers are unpowered, turn off Wi-Fi searching.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Keep Bluetooth Low Energy Active Only for Mesh:</strong> BLE uses a fraction of the milliwatts consumed by active 4G/5G radios.</span>
            </li>
          </ul>
        </div>

        {/* Step 3: Thermal Management */}
        <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2.5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              3. Battery Temperature & Chemical Preservation
            </h3>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1.5 pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Avoid Freezing Temperatures:</strong> Lithium-ion capacity drops up to 40% below 5°C. Keep phones in an inner coat pocket close to body heat.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Do Not Charge Frozen Cells:</strong> Never attempt to charge lithium batteries when below 0°C; this causes metallic lithium plating and permanent destruction.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Button to Launch Blackout Screen */}
      <div className="pt-2">
        <button
          onClick={() => setCurrentView('blackout')}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors uppercase tracking-wider"
        >
          <Moon className="w-4 h-4 text-amber-400" />
          <span>Switch to OLED Ultra-Low-Power Blackout Screen</span>
        </button>
      </div>
    </div>
  );
};
