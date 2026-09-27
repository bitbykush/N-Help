import React from 'react';
import { 
  GraduationCap, 
  ShieldAlert, 
  BookOpen, 
  Cpu, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Globe, 
  Code2,
  Lock
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              ABOUT N-HELP & ACADEMIC CONTEXT
            </h1>
            <p className="text-xs text-zinc-400">
              Course CHE110: Environmental Studies Research Capstone
            </p>
          </div>
        </div>
      </div>

      {/* Course Context Card */}
      <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400 font-bold uppercase">
            COURSE CODE: CHE110
          </span>
          <span className="text-xs text-zinc-400 font-mono">Academic Session 2025-2026</span>
        </div>
        <h2 className="text-sm font-bold text-white">
          Nuclear Disaster Management: Safety Protocols and Preventive Strategies
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed">
          This project investigates civilian vulnerability during nuclear and radiological crises where power grids, cellular networks, and public emergency communication collapse simultaneously. <strong>N-HELP</strong> addresses this failure mode through zero-dependency offline web architecture and delay-tolerant mesh communication.
        </p>
      </div>

      {/* Prominent Academic & Safety Disclaimer */}
      <div className="p-4 bg-red-950/40 border border-red-500/60 rounded-xl space-y-2 text-xs text-red-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <h3 className="font-bold uppercase tracking-wider text-red-300 text-xs">
            LEGAL, SAFETY & REGULATORY DISCLAIMER
          </h3>
        </div>
        <p className="leading-relaxed text-[11px] text-red-200/90">
          N-HELP is an <strong>educational engineering prototype</strong> created for academic evaluation. It is NOT an official application of the Atomic Energy Regulatory Board (AERB), National Disaster Management Authority (NDMA), Department of Atomic Energy (DAE), or International Atomic Energy Agency (IAEA).
        </p>
        <p className="leading-relaxed text-[11px] text-red-200/90">
          In any real-world emergency, always prioritize direct verbal instructions and broadcasts issued by competent municipal, state, and national civil protection authorities over digital applications.
        </p>
      </div>

      {/* Technical Architecture & Stack */}
      <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>TECHNICAL ARCHITECTURE & SPECIFICATIONS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
            <span className="font-bold text-white block">Offline PWA Core</span>
            <p className="text-zinc-400 text-[11px]">
              Service Worker Cache-First strategy caches 100% of application assets for complete offline operation without cellular or internet access.
            </p>
          </div>

          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
            <span className="font-bold text-white block">Decentralized Mesh Radio</span>
            <p className="text-zinc-400 text-[11px]">
              BitChat-compatible Bluetooth Low Energy (BLE) peer-to-peer network architecture allowing direct device-to-device communication without cellular or internet infrastructure.
            </p>
          </div>

          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
            <span className="font-bold text-white block">Native Android Companion</span>
            <p className="text-zinc-400 text-[11px]">
              Hardware Bluetooth Low Energy advertiser and scanner in <code>android/</code> directory bridging native radios to the web interface.
            </p>
          </div>

          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
            <span className="font-bold text-white block">Local Storage Resilience</span>
            <p className="text-zinc-400 text-[11px]">
              Asynchronous IndexedDB database with transparent localStorage fallback for 72-hour survival kits, family plans, and mesh message queues.
            </p>
          </div>
        </div>
      </div>

      {/* Authoritative Reference Bibliography */}
      <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>AUTHORITATIVE CITATIONS & BIBLIOGRAPHY</span>
        </h3>

        <ul className="text-xs text-zinc-300 space-y-2 pl-1">
          <li className="p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800 flex items-start gap-2">
            <span className="font-mono text-amber-400 font-bold shrink-0">[1]</span>
            <div>
              <strong className="text-white">Atomic Energy Regulatory Board (AERB), India:</strong>
              <p className="text-zinc-400 text-[11px]">Safety Guide No. AERB/SG/EP-1: Preparedness of the Public Authority for Handling Nuclear/Radiological Emergencies.</p>
            </div>
          </li>

          <li className="p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800 flex items-start gap-2">
            <span className="font-mono text-amber-400 font-bold shrink-0">[2]</span>
            <div>
              <strong className="text-white">National Disaster Management Authority (NDMA), India:</strong>
              <p className="text-zinc-400 text-[11px]">National Disaster Management Guidelines: Management of Nuclear and Radiological Emergencies (2009).</p>
            </div>
          </li>

          <li className="p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800 flex items-start gap-2">
            <span className="font-mono text-amber-400 font-bold shrink-0">[3]</span>
            <div>
              <strong className="text-white">International Atomic Energy Agency (IAEA):</strong>
              <p className="text-zinc-400 text-[11px]">Safety Standards Series No. GS-R-2: Preparedness and Response for a Nuclear or Radiological Emergency.</p>
            </div>
          </li>

          <li className="p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800 flex items-start gap-2">
            <span className="font-mono text-amber-400 font-bold shrink-0">[4]</span>
            <div>
              <strong className="text-white">World Health Organization (WHO):</strong>
              <p className="text-zinc-400 text-[11px]">Guidelines for Iodine Prophylaxis following Nuclear Accidents: Update 1999.</p>
            </div>
          </li>

          <li className="p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800 flex items-start gap-2">
            <span className="font-mono text-amber-400 font-bold shrink-0">[5]</span>
            <div>
              <strong className="text-white">International Commission on Radiological Protection (ICRP):</strong>
              <p className="text-zinc-400 text-[11px]">Publication 103: The 2007 Recommendations of the International Commission on Radiological Protection.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
