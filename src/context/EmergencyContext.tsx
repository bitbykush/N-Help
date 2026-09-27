import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmergencyMode, ConnectivityStatus } from '../types/emergency';
import { commManager } from '../services/communication/CommunicationManager';

export type AppView = 
  | 'home'
  | 'emergency-now'
  | 'mesh'
  | 'safety-guide'
  | 'blackout'
  | 'kit'
  | 'map'
  | 'contacts'
  | 'radiation-basics'
  | 'myth-fact'
  | 'quiz'
  | 'bitchat-guide'
  | 'power-saver'
  | 'faq'
  | 'about'
  | 'search';

interface EmergencyContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  emergencyMode: EmergencyMode;
  setEmergencyMode: (mode: EmergencyMode) => void;
  connectivity: ConnectivityStatus;
  batteryLevel: number;
  isBatteryCharging: boolean;
  isDemoMode: boolean;
  demoStep: number;
  triggerDemoScenario: () => void;
  resetDemoScenario: () => void;
  isInstallable: boolean;
  promptPwaInstall: () => void;
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [emergencyMode, setEmergencyMode] = useState<EmergencyMode>('NORMAL');
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>('ONLINE');
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const [isBatteryCharging, setIsBatteryCharging] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Helper to determine true hardware network state (Android WebView aware)
  const getIsHardwareOnline = (): boolean => {
    if (typeof window !== 'undefined') {
      const bridge = (window as any).NHelpNativeMeshBridge;
      if (bridge && typeof bridge.isNetworkOnline === 'function') {
        try {
          return bridge.isNetworkOnline();
        } catch {
          // fallback
        }
      }
      if (typeof (window as any).__nativeNetworkOnline === 'boolean') {
        return (window as any).__nativeNetworkOnline;
      }
    }
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  };

  // Monitor Network Connectivity & Switch to MESH_MODE when offline or in Airplane mode
  useEffect(() => {
    const updateNetwork = async () => {
      if (isDemoMode) {
        setConnectivity('MESH_MODE');
        return;
      }

      const isOnline = getIsHardwareOnline();
      if (isOnline) {
        setConnectivity('ONLINE');
        await commManager.evaluateActiveTransport();
      } else {
        // Grid is down, cellular off, or Airplane mode engaged: switch to MESH_MODE
        setConnectivity('MESH_MODE');
        await commManager.evaluateActiveTransport();
      }
    };

    updateNetwork();
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);

    // Native Android Callback hook from MainActivity
    (window as any).__onNHelpNetworkStateChanged = (online: boolean) => {
      if (isDemoMode) return;
      if (online) {
        setConnectivity('ONLINE');
      } else {
        setConnectivity('MESH_MODE');
      }
      commManager.evaluateActiveTransport();
    };

    // Periodic heartbeat check (every 1.2s) to immediately catch Airplane Mode in WebView
    const heartbeat = setInterval(updateNetwork, 1200);

    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      clearInterval(heartbeat);
      delete (window as any).__onNHelpNetworkStateChanged;
    };
  }, [isDemoMode]);

  // Monitor Battery Status
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsBatteryCharging(battery.charging);

        const onLevelChange = () => setBatteryLevel(Math.round(battery.level * 100));
        const onChargingChange = () => setIsBatteryCharging(battery.charging);

        battery.addEventListener('levelchange', onLevelChange);
        battery.addEventListener('chargingchange', onChargingChange);

        return () => {
          battery.removeEventListener('levelchange', onLevelChange);
          battery.removeEventListener('chargingchange', onChargingChange);
        };
      }).catch(() => {
        // Fallback simulated battery
      });
    }
  }, []);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptPwaInstall = () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          setDeferredInstallPrompt(null);
        }
      });
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // 1-Click Academic Demo Scenario Walkthrough
  const triggerDemoScenario = () => {
    setIsDemoMode(true);
    setEmergencyMode('BLACKOUT');
    setConnectivity('MESH_MODE');
    setDemoStep(1);
    commManager.setDemoMode(true);
    setCurrentView('emergency-now');
  };

  const resetDemoScenario = () => {
    setIsDemoMode(false);
    setEmergencyMode('NORMAL');
    setConnectivity(navigator.onLine ? 'ONLINE' : 'INTERNET_DOWN');
    setDemoStep(0);
    commManager.setDemoMode(false);
    setCurrentView('home');
  };

  return (
    <EmergencyContext.Provider
      value={{
        currentView,
        setCurrentView,
        emergencyMode,
        setEmergencyMode,
        connectivity,
        batteryLevel,
        isBatteryCharging,
        isDemoMode,
        demoStep,
        triggerDemoScenario,
        resetDemoScenario,
        isInstallable: !!deferredInstallPrompt,
        promptPwaInstall,
        isInstallModalOpen,
        setIsInstallModalOpen
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within an EmergencyProvider');
  return context;
};
