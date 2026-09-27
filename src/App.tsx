import React, { useState } from 'react';
import { useEmergency, AppView } from './context/EmergencyContext';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { InstallModal } from './components/common/InstallModal';

// Views
import { HomeDashboard } from './components/home/HomeDashboard';
import { EmergencyNow } from './components/emergency/EmergencyNow';
import { EmergencyMeshScreen } from './components/mesh/EmergencyMeshScreen';
import { BlackoutScreen } from './components/blackout/BlackoutScreen';
import { KitChecklist } from './components/tools/KitChecklist';
import { FamilyPlan } from './components/tools/FamilyPlan';
import { EmergencyMapLeaflet } from './components/tools/EmergencyMapLeaflet';
import { ContactsManager } from './components/tools/ContactsManager';
import { SafetyGuideScreen } from './components/education/SafetyGuideScreen';
import { RadiationBasicsScreen } from './components/education/RadiationBasicsScreen';
import { MythVsFactScreen } from './components/education/MythVsFactScreen';
import { QuizScreen } from './components/education/QuizScreen';
import { BitChatGuideScreen } from './components/reference/BitChatGuideScreen';
import { PowerSaverScreen } from './components/reference/PowerSaverScreen';
import { FaqScreen } from './components/reference/FaqScreen';
import { AboutProject } from './components/reference/AboutProject';

export const App: React.FC = () => {
  const { currentView, setCurrentView } = useEmergency();
  const [kitSubTab, setKitSubTab] = useState<'checklist' | 'family' | 'contacts' | 'map'>('checklist');

  // Render the appropriate main view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard />;
      case 'emergency-now':
        return <EmergencyNow />;
      case 'mesh':
        return <EmergencyMeshScreen />;
      case 'blackout':
        return <BlackoutScreen />;
      case 'kit':
        return (
          <div className="space-y-4 animate-fade-in">
            {/* Tools Sub-Navigation Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setKitSubTab('checklist')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                  kitSubTab === 'checklist'
                    ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                72h Survival Kit
              </button>
              <button
                onClick={() => setKitSubTab('family')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                  kitSubTab === 'family'
                    ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Family Plan
              </button>
              <button
                onClick={() => setKitSubTab('contacts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                  kitSubTab === 'contacts'
                    ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Helplines & Directory
              </button>
              <button
                onClick={() => setKitSubTab('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                  kitSubTab === 'map'
                    ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Disaster Map
              </button>
            </div>

            {kitSubTab === 'checklist' && <KitChecklist />}
            {kitSubTab === 'family' && <FamilyPlan />}
            {kitSubTab === 'contacts' && <ContactsManager />}
            {kitSubTab === 'map' && <EmergencyMapLeaflet />}
          </div>
        );
      case 'map':
        return <EmergencyMapLeaflet />;
      case 'contacts':
        return <ContactsManager />;
      case 'safety-guide':
        return <SafetyGuideScreen />;
      case 'radiation-basics':
        return <RadiationBasicsScreen />;
      case 'myth-fact':
        return <MythVsFactScreen />;
      case 'quiz':
        return <QuizScreen />;
      case 'bitchat-guide':
        return <BitChatGuideScreen />;
      case 'power-saver':
        return <PowerSaverScreen />;
      case 'faq':
        return <FaqScreen />;
      case 'about':
        return <AboutProject />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-disaster-dark text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Mandatory Academic & Safety Disclaimer */}
      <DisclaimerBanner />

      {/* 2. Main Sticky App Header */}
      <Header />

      {/* 3. Primary App Workspace Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-4 py-3 min-h-[calc(100vh-130px)]">
        {renderView()}
      </main>

      {/* 4. Bottom Tab Navigation Bar */}
      <Navigation />

      {/* 5. Install App (PWA) Instructions Modal */}
      <InstallModal />
    </div>
  );
};
