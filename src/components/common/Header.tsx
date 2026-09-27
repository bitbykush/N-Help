import React, { useState } from 'react';
import { Radio, Battery, BatteryCharging, Download, Search, Globe, FlaskConical, ShieldAlert, RefreshCw } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useTranslation } from '../../i18n/useTranslation';
import { LanguagePickerModal } from './LanguagePickerModal';
import { SearchModal } from './SearchModal';
import { SyncModal } from './SyncModal';

export const Header: React.FC = () => {
  const { 
    connectivity, 
    batteryLevel, 
    isBatteryCharging, 
    isDemoMode, 
    triggerDemoScenario, 
    resetDemoScenario,
    promptPwaInstall,
    setCurrentView 
  } = useEmergency();

  const { t, currentLanguageMeta } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-disaster-dark/95 backdrop-blur-md border-b border-disaster-border px-3 py-2.5 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-black/40 border border-amber-500/30 flex items-center justify-center p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden">
            <img src="./icons/icon.svg" alt="N-HELP Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-wider text-base text-white">N-HELP</span>
              <span className="text-[10px] font-mono bg-red-600/30 text-red-400 border border-red-500/40 px-1 py-0.2 rounded font-bold">
                CIVIL
              </span>
            </div>
            <p className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right: Actions, Status & Demo Trigger */}
        <div className="flex items-center gap-1.5">
          {/* Connectivity Status Pill */}
          <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border ${
            connectivity === 'ONLINE'
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
              : connectivity === 'MESH_MODE'
              ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40 animate-pulse'
              : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              connectivity === 'ONLINE' ? 'bg-emerald-400' : connectivity === 'MESH_MODE' ? 'bg-cyan-400' : 'bg-amber-400'
            }`} />
            {connectivity === 'ONLINE' ? t.online : connectivity === 'MESH_MODE' ? t.meshMode : t.internetDown}
          </div>

          {/* Battery Pill */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            {isBatteryCharging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <Battery className={`w-3.5 h-3.5 ${batteryLevel < 20 ? 'text-red-500 animate-bounce' : 'text-emerald-400'}`} />
            )}
            <span className="text-[11px] font-bold">{batteryLevel}%</span>
          </div>

          {/* Academic Demo Mode Toggle Button */}
          <button
            onClick={isDemoMode ? resetDemoScenario : triggerDemoScenario}
            title={isDemoMode ? "Exit Demo Simulation" : "Launch 1-Click Academic Presentation Demo"}
            className={`px-2 py-1 rounded-lg text-xs font-bold font-mono tracking-wide flex items-center gap-1 border transition-all ${
              isDemoMode 
                ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-md shadow-red-500/30' 
                : 'bg-purple-950/60 text-purple-300 border-purple-500/40 hover:bg-purple-900/60'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isDemoMode ? 'EXIT DEMO' : 'DEMO MODE'}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            title="Search guides & offline knowledge"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Picker Trigger */}
          <button
            onClick={() => setIsLangOpen(true)}
            title="Select Language"
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase text-[11px]">{currentLanguageMeta.code}</span>
          </button>

          {/* Data Sync Center Trigger */}
          <button
            onClick={() => setIsSyncOpen(true)}
            title="Website & App Data Sync Center"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 hover:text-white hover:border-cyan-500/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Install PWA Button */}
          <button
            onClick={promptPwaInstall}
            title="Install N-HELP App Offline"
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm shadow-amber-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Install</span>
          </button>
        </div>
      </header>

      {/* Modals */}
      {isLangOpen && <LanguagePickerModal onClose={() => setIsLangOpen(false)} />}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      {isSyncOpen && <SyncModal onClose={() => setIsSyncOpen(false)} />}
    </>
  );
};
