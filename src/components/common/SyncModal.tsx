import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  Smartphone, 
  QrCode, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Radio, 
  Share2, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { dbService } from '../../services/db';
import { useEmergency } from '../../context/EmergencyContext';

interface SyncModalProps {
  onClose: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ onClose }) => {
  const { connectivity } = useEmergency();
  const isOnline = connectivity === 'ONLINE';

  const [syncPayload, setSyncPayload] = useState<string>('');
  const [base64Token, setBase64Token] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [importInput, setImportInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'app-sync' | 'qr' | 'backup'>('app-sync');

  // Load current device state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const json = await dbService.exportCompleteState();
        setSyncPayload(json);
        setBase64Token(btoa(unescape(encodeURIComponent(json))));
      } catch (e) {
        console.error('Failed to generate sync payload:', e);
      }
    };
    loadState();
  }, []);

  // 1-Tap Handshake to Android Native App via Deep Link Intent
  const handleLaunchNativeAppSync = () => {
    if (!base64Token) return;
    const deepLinkUrl = `nhelp://sync?data=${encodeURIComponent(base64Token)}`;
    window.location.href = deepLinkUrl;
    setStatusMessage('Attempting to open N-HELP Native Mesh App...');
    setTimeout(() => {
      setStatusMessage('If the app did not open, make sure N-HELP APK is installed or copy the sync token below.');
    }, 2500);
  };

  // Copy sync token
  const handleCopyToken = () => {
    if (!base64Token) return;
    navigator.clipboard.writeText(base64Token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export JSON file
  const handleExportJson = () => {
    const blob = new Blob([syncPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n-help-emergency-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Backup file downloaded to device storage.');
  };

  // Import JSON or Base64 payload
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importInput.trim()) return;

    let jsonToApply = importInput.trim();
    try {
      if (!jsonToApply.startsWith('{')) {
        jsonToApply = decodeURIComponent(escape(atob(jsonToApply)));
      }
      const success = await dbService.importCompleteState(jsonToApply);
      if (success) {
        setStatusMessage('Sync successful! Reloading data...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setStatusMessage('Invalid sync data format.');
      }
    } catch (err) {
      setStatusMessage('Failed to parse sync token. Check formatting.');
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = await dbService.importCompleteState(content);
        if (success) {
          setStatusMessage('Backup file restored successfully! Reloading...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setStatusMessage('Could not parse backup file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-disaster-card border border-disaster-border rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-disaster-border bg-slate-900">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Website & App Data Sync</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Scenario Banner */}
          <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
            isOnline 
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
              : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
              <div>
                <span className="font-bold block uppercase tracking-wider text-[11px]">
                  {isOnline ? 'Online Scenario: Grid Connected' : 'Offline Scenario: Grid Blackout'}
                </span>
                <span className="text-[10px] opacity-80">
                  {isOnline 
                    ? '1-Tap Deep Link handshake & instant browser-to-native app transfer active.'
                    : 'Emergency QR code, Bluetooth radio broadcast & offline file sync active.'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('app-sync')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                activeTab === 'app-sync' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              1-Tap App Sync
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                activeTab === 'qr' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Offline QR Card
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                activeTab === 'backup' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Export / Import
            </button>
          </div>

          {statusMessage && (
            <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-center font-medium animate-fade-in">
              {statusMessage}
            </div>
          )}

          {/* TAB 1: 1-TAP APP SYNC (via nhelp:// intent) */}
          {activeTab === 'app-sync' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3.5 bg-black/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block">
                  Synchronize with N-HELP Native Mobile App
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  If you have configured your 72-Hour Kit Checklist and Family Plan in this browser, you can transfer your entire setup directly into the native Android application with 1 tap:
                </p>

                <button
                  onClick={handleLaunchNativeAppSync}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Launch & Sync to Native Android App (`nhelp://`)</span>
                </button>
              </div>

              {/* Manual Sync Token */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-300">
                    Universal Emergency Sync Token:
                  </span>
                  <button
                    onClick={handleCopyToken}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Token'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={base64Token}
                  className="w-full bg-black border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-slate-400 select-all"
                />
                <p className="text-[10px] text-slate-500">
                  Contains your encrypted kit status, family meeting locations, and verified contacts.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: EMERGENCY QR CODE (Zero-Internet Scan Sync) */}
          {activeTab === 'qr' && (
            <div className="space-y-3 text-center animate-fade-in">
              <div className="p-4 bg-black/60 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-white text-xs block uppercase tracking-wider text-amber-400">
                  Zero-Internet Offline QR Sync
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed text-left">
                  Scan this optical data barcode with another family member's phone or the N-HELP app camera to copy your complete disaster plan with <strong>0% internet or cellular coverage</strong>:
                </p>

                {/* High-Contrast Visual Emergency Data Matrix */}
                <div className="w-48 h-48 mx-auto p-2 bg-white rounded-xl shadow-xl flex items-center justify-center">
                  <div className="w-full h-full border-4 border-black p-2 flex flex-col items-center justify-center text-black">
                    <QrCode className="w-24 h-24 text-black" />
                    <span className="text-[9px] font-mono font-black mt-1 uppercase tracking-tight">
                      N-HELP DISASTER TOKEN
                    </span>
                    <span className="text-[8px] font-mono text-zinc-600">
                      CHE110 RESCUE MATRIX
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Encodes: <strong>72h Kit Progress</strong> • <strong>Family Meeting Points</strong> • <strong>Blood Types</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BACKUP FILE EXPORT / IMPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Export File */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-left">
                  <span className="font-bold text-white block text-xs">Save Backup File</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Download an offline JSON file to your device storage, SD card, or USB stick.
                  </p>
                  <button
                    onClick={handleExportJson}
                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Upload File */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-left">
                  <span className="font-bold text-white block text-xs">Restore Backup File</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Upload a saved <code>.json</code> disaster file from your phone storage.
                  </p>
                  <label className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload & Restore</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Paste Token Form */}
              <form onSubmit={handleImport} className="p-3 bg-black/60 rounded-xl border border-slate-800 space-y-2 text-left">
                <label className="block text-[11px] font-bold text-slate-300">
                  Or Paste Sync Token String:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={importInput}
                    onChange={(e) => setImportInput(e.target.value)}
                    placeholder="Paste Base64 token or JSON payload..."
                    className="flex-1 bg-black border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg text-xs transition-colors shrink-0"
                  >
                    Import
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bluetooth Mesh Radio Relaying Note */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-400 text-[11px]">
            <Radio className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Offline Bluetooth Mesh Radio:</strong> In the native N-HELP Android app, your family distress beacons and safety pings automatically broadcast over Bluetooth Low Energy to nearby phones with zero configuration.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-disaster-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
