import React from 'react';
import { 
  AlertOctagon, 
  Radio, 
  BookOpen, 
  Zap, 
  Briefcase, 
  MapPin, 
  ShieldAlert, 
  HelpCircle, 
  FileCheck, 
  HeartPulse, 
  Share2, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useTranslation } from '../../i18n/useTranslation';

export const HomeDashboard: React.FC = () => {
  const { setCurrentView, connectivity, batteryLevel, isDemoMode, triggerDemoScenario } = useEmergency();
  const { t } = useTranslation();

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* 1. High-Priority Emergency Now Action Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 p-5 shadow-xl shadow-red-950/50 border border-red-500/40">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              DISASTER TRIAGE READY
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.emergencyNow}
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-md font-medium leading-relaxed">
              Step-by-step guidance for sheltering, evacuation orders, gentle de-clothing, safe water, and trauma triage.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('emergency-now')}
            className="w-full sm:w-auto px-6 py-3.5 bg-black hover:bg-slate-900 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg border border-red-400/60 flex items-center justify-center gap-2 group transition-all"
          >
            <AlertOctagon className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform animate-pulse" />
            <span>OPEN EMERGENCY TRIAGE</span>
          </button>
        </div>
      </section>

      {/* 2. System Status & Readiness Overview */}
      <section className="grid grid-cols-3 gap-2 text-center">
        {/* Offline Status */}
        <div className="p-3 rounded-xl bg-disaster-card border border-disaster-border">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Offline Engine
          </div>
          <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            100% Cached
          </div>
        </div>

        {/* Connectivity Mode */}
        <div className="p-3 rounded-xl bg-disaster-card border border-disaster-border">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Network State
          </div>
          <div className={`text-xs font-bold truncate flex items-center justify-center gap-1 ${
            connectivity === 'ONLINE' ? 'text-emerald-400' : connectivity === 'MESH_MODE' ? 'text-cyan-400' : 'text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              connectivity === 'ONLINE' ? 'bg-emerald-400' : connectivity === 'MESH_MODE' ? 'bg-cyan-400' : 'bg-amber-400'
            }`} />
            {connectivity === 'ONLINE' ? 'Online' : connectivity === 'MESH_MODE' ? 'Mesh Mode' : 'Blackout'}
          </div>
        </div>

        {/* Battery Monitor */}
        <div className="p-3 rounded-xl bg-disaster-card border border-disaster-border">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Battery Level
          </div>
          <div className={`text-xs font-bold ${batteryLevel < 20 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
            {batteryLevel}% Remaining
          </div>
        </div>
      </section>

      {/* 3. The 6 Core Modules Grid */}
      <section className="space-y-2">
        <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase px-1">
          Primary Response Modules
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Card 1: Emergency Now */}
          <div
            onClick={() => setCurrentView('emergency-now')}
            className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-red-500/30 hover:border-red-500/70 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-red-400 transition-colors">
              Emergency Now
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Immediate triage: stay calm, shelter vs evacuate, decontamination.
            </p>
          </div>

          {/* Card 2: Emergency Mesh */}
          <div
            onClick={() => setCurrentView('mesh')}
            className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-500/70 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
              Emergency Mesh
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Decentralized peer communication without internet or cell networks.
            </p>
          </div>

          {/* Card 3: Safety Guide */}
          <div
            onClick={() => setCurrentView('safety-guide')}
            className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-500/70 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
              Safety Guide
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Categorized Before, During, and After civil protection manuals.
            </p>
          </div>

          {/* Card 4: Blackout Mode */}
          <div
            onClick={() => setCurrentView('blackout')}
            className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-yellow-500/30 hover:border-yellow-500/70 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">
              Blackout Mode
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              OLED pure black mode with battery optimization & sensor status.
            </p>
          </div>

          {/* Card 5: Emergency Kit */}
          <div
            onClick={() => setCurrentView('kit')}
            className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-500/70 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
              Kit & Family Plan
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Interactive survival checklist and offline family meeting card.
            </p>
          </div>

          {/* Card 6: Emergency Map */}
          <div
            onClick={() => setCurrentView('map')}
            className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/30 hover:border-blue-500/70 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
              Emergency Map
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Narora Power Station demonstration map with PAZ & UPZ zones.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Public Education & Misinformation Hub */}
      <section className="space-y-2">
        <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase px-1">
          Public Awareness & Education (CHE110)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Myth vs Fact */}
          <div 
            onClick={() => setCurrentView('myth-fact')}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Myth vs. Fact</h4>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded">15 Verified</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Debunking radiation sensing, boiling water myths, smartphone detectors, and KI misuse.
              </p>
            </div>
          </div>

          {/* Emergency Quiz */}
          <div 
            onClick={() => setCurrentView('quiz')}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Emergency Quiz</h4>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">15 Questions</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Test your knowledge on radiation, sheltering, evacuation routes, and mesh communication.
              </p>
            </div>
          </div>

          {/* Radiation Basics */}
          <div 
            onClick={() => setCurrentView('radiation-basics')}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Radiation Basics & Barriers</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Time, distance, shielding, and the 5 physical defence-in-depth barriers of a reactor.
              </p>
            </div>
          </div>

          {/* BitChat Offline Mesh Guide */}
          <div 
            onClick={() => setCurrentView('bitchat-guide')}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">BitChat Companion Guide</h4>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded">BLE Mesh</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                How Bluetooth LE mesh works without internet, permissions, store-and-forward, and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Emergency Helplines Quick Banner */}
      <section 
        onClick={() => setCurrentView('contacts')}
        className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/30 cursor-pointer transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Emergency Helplines & Contacts</h4>
            <p className="text-[11px] text-slate-400">National Emergency 112 • NDMA 1078 • Ambulance 108 • AERB Crisis</p>
          </div>
        </div>
        <span className="text-xs text-amber-400 font-semibold">View & Call →</span>
      </section>
    </div>
  );
};
