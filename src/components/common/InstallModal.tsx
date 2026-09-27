import React from 'react';
import { X, Download, Smartphone, Share, Monitor, CheckCircle } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const InstallModal: React.FC = () => {
  const { isInstallModalOpen, setIsInstallModalOpen, isInstallable, promptPwaInstall } = useEmergency();

  if (!isInstallModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-disaster-card border border-disaster-border rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-disaster-border bg-slate-900">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Install N-HELP Offline App</h3>
          </div>
          <button 
            onClick={() => setIsInstallModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Installing N-HELP enables **100% offline access** when power grids and cellular towers collapse. All safety guides, emergency checklists, and mesh interfaces stay saved directly on your phone.
          </p>

          {isInstallable && (
            <button
              onClick={() => {
                promptPwaInstall();
                setIsInstallModalOpen(false);
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Install N-HELP App Now</span>
            </button>
          )}

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Platform-Specific Instructions:
            </h4>

            {/* Android */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android (Chrome / Brave / Firefox)</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                Tap browser menu (⋮) in the top-right corner $\to$ Select <strong className="text-slate-200">"Add to Home screen"</strong> or <strong className="text-slate-200">"Install app"</strong>.
              </p>
            </div>

            {/* iPhone / iPad */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Share className="w-4 h-4 text-blue-400" />
                <span>iPhone & iPad (Safari)</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                Tap the <strong className="text-slate-200">Share button</strong> (square with arrow pointing up) $\to$ Scroll down and tap <strong className="text-slate-200">"Add to Home Screen"</strong>.
              </p>
            </div>

            {/* Desktop */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Monitor className="w-4 h-4 text-purple-400" />
                <span>Desktop (Chrome / Edge)</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                Click the <strong className="text-slate-200">Install icon</strong> in the browser URL address bar or select <strong className="text-slate-200">"Install N-HELP"</strong> from the menu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Zero App Store or Google Play account required. Runs standalone.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-disaster-border text-right">
          <button
            onClick={() => setIsInstallModalOpen(false)}
            className="px-4 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
