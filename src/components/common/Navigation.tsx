import React from 'react';
import { Home, AlertOctagon, Radio, BookOpen, Zap, Briefcase, Info } from 'lucide-react';
import { useEmergency, AppView } from '../../context/EmergencyContext';

export const Navigation: React.FC = () => {
  const { currentView, setCurrentView, emergencyMode } = useEmergency();

  const isBlackout = emergencyMode === 'BLACKOUT';

  const navItems: Array<{ id: AppView; label: string; icon: any; isEmergency?: boolean }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'emergency-now', label: 'Emergency', icon: AlertOctagon, isEmergency: true },
    { id: 'mesh', label: 'Mesh', icon: Radio },
    { id: 'safety-guide', label: 'Guides', icon: BookOpen },
    { id: 'blackout', label: 'Blackout', icon: Zap },
    { id: 'kit', label: 'Kit & Tools', icon: Briefcase },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 border-t ${
      isBlackout 
        ? 'bg-black border-amber-500/40 text-slate-300' 
        : 'bg-disaster-dark/95 backdrop-blur-md border-disaster-border text-slate-400'
    } px-2 py-1.5 safe-bottom`}>
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'kit' && (currentView === 'map' || currentView === 'contacts'));

          if (item.isEmergency) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative flex flex-col items-center justify-center p-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105'
                    : 'bg-red-700/80 hover:bg-red-600 text-white animate-pulse'
                }`}
              >
                <Icon className="w-5 h-5 text-white" />
                <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                isActive 
                  ? isBlackout ? 'text-amber-400 font-bold' : 'text-amber-400 font-bold' 
                  : 'hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
