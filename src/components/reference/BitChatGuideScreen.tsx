import React, { useState } from 'react';
import { 
  Radio, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Zap,
  ArrowRight,
  Battery,
  Users,
  RefreshCw
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { SyncModal } from '../common/SyncModal';

export const BitChatGuideScreen: React.FC = () => {
  const { setCurrentView } = useEmergency();
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              BITCHAT OFFLINE MESH GUIDE
            </h1>
            <p className="text-xs text-zinc-400">
              Zero-Internet Bluetooth Peer-to-Peer Communication for Grid Blackouts
            </p>
          </div>
        </div>
      </div>

      {/* Why BitChat is Vital during Nuclear / Blackout Disasters */}
      <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Zap className="w-4 h-4" />
          <span>Why You Need BitChat During Grid Collapse</span>
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed">
          During a major nuclear emergency, transmission lines trip and cellular base stations exhaust their backup batteries within 2 to 4 hours. Without cell towers, WhatsApp, SMS, and internet messaging cease to function entirely.
        </p>
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong>BitChat</strong> is an open-source, decentralized app that creates a <strong>local Bluetooth mesh network</strong> directly between smartphones. Messages hop device-to-device across phones without cellular towers, Wi-Fi routers, or central servers.
        </p>
      </div>

      {/* BitChat App Download Center */}
      <div className="p-4 bg-disaster-card border border-cyan-500/40 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            <span>Download BitChat (Pre-Install Before Emergency)</span>
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
            FREE & OPEN SOURCE
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Install BitChat on all household smartphones right now so you can communicate if the grid fails:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Android Download */}
          <div className="p-3.5 bg-black/60 rounded-xl border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5 text-sm">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android Version</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Direct APK / F-Droid</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Compatible with Android 7.0 to 14+. Works standalone with Bluetooth Low Energy hardware.
            </p>
            <div className="space-y-1.5 pt-1">
              <a
                href="https://github.com/permik/bitchat/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Android APK (GitHub)</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
              <a
                href="https://github.com/permik/bitchat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-[11px] flex items-center justify-center gap-1 border border-zinc-800 transition-colors"
              >
                <span>View Source Code & F-Droid Details</span>
              </a>
            </div>
          </div>

          {/* iOS Download */}
          <div className="p-3.5 bg-black/60 rounded-xl border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5 text-sm">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>iOS / iPhone</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">TestFlight / App Store</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Compatible with iPhone iOS 15+. Operates over Apple CoreBluetooth mesh frameworks.
            </p>
            <div className="space-y-1.5 pt-1">
              <a
                href="https://github.com/permik/bitchat#ios"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get iOS App / TestFlight</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Installation & Setup Instructions */}
      <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Step-by-Step Setup Guide for Civilians</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5 p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              1
            </span>
            <div>
              <strong className="text-white">Install the App:</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Open the downloaded <code>.apk</code> file on your Android device. If your phone prompts "Install unknown apps", tap Settings and allow your browser to install it.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              2
            </span>
            <div>
              <strong className="text-white">Grant Essential Radio Permissions:</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                When launched, grant <strong>Bluetooth</strong> and <strong>Nearby Devices</strong> permissions. On Android, also grant <strong>Location</strong> (required by Android OS for BLE beacon scanning; your GPS is not sent over the air).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              3
            </span>
            <div>
              <strong className="text-white">Set Battery to "Unrestricted":</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Go to phone Settings $\to$ Apps $\to$ BitChat $\to$ Battery $\to$ select <strong>"Unrestricted"</strong> (or disable battery optimization). This allows your phone to silently relay emergency neighbor packets even when the screen is locked in your pocket.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              4
            </span>
            <div>
              <strong className="text-white">Choose a Call Sign & Start Messaging:</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Set a recognizable display name (e.g., <code>Sharma-B12-Basement</code>). In a crisis, broadcast critical welfare reports or check nearby sheltered neighbors within 30 to 100 meters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* N-HELP NATIVE APP & MULTI-SCENARIO SYNC CENTER */}
      <div className="p-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/60 rounded-xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              N-HELP NATIVE BLUETOOTH MESH APP (STANDALONE ANDROID)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold border border-purple-700">
            NATIVE APK + WEB SYNC
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          N-HELP now includes a complete <strong>standalone native Android application</strong> (located in <code>android/</code>) engineered with Kotlin Bluetooth Low Energy (BLE) background advertising and scanning.
        </p>

        <div className="p-3 bg-black/60 rounded-lg border border-purple-900/60 space-y-2 text-xs">
          <span className="font-bold text-purple-300 block text-[11px]">
            Dual Scenario Website & App Synchronization:
          </span>
          <ul className="text-zinc-300 text-[11px] space-y-1.5 pl-1">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Online Scenario (1-Tap Deep Link):</strong> Web browser sends emergency records instantly to the Android App via custom OS intent (<code>nhelp://sync</code>). No re-typing required.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Offline Scenario (Zero-Internet Sync):</strong> Sync emergency cards via Optical Emergency QR Codes, JSON file import/export, or native Bluetooth radio gossiping.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Hardware Background Relaying:</strong> The Android app runs <code>BluetoothLeService.kt</code> as an Android Foreground Service, relaying packets even when your phone is in your pocket with the screen locked.</span>
            </li>
          </ul>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setIsSyncOpen(true)}
            className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Open Website ↔ App Sync Center</span>
          </button>
          <button
            onClick={() => setCurrentView('mesh')}
            className="flex-1 py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Open Emergency Mesh Screen</span>
          </button>
        </div>
      </div>

      {/* Sync Modal */}
      {isSyncOpen && <SyncModal onClose={() => setIsSyncOpen(false)} />}
    </div>
  );
};
