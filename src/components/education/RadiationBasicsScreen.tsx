import React, { useState } from 'react';
import { 
  Atom, 
  Shield, 
  Clock, 
  Maximize, 
  Layers, 
  AlertCircle, 
  Activity, 
  Zap, 
  HelpCircle,
  Calculator,
  Sliders
} from 'lucide-react';
import { RADIATION_LESSONS, REACTOR_BARRIERS } from '../../data/radiationBasicsData';

export const RadiationBasicsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basics' | 'triad' | 'barriers'>('basics');
  
  // Interactive Inverse-Square Law distance slider (meters)
  const [distance, setDistance] = useState<number>(2);

  // Intensity = 1 / d^2 relative to 1 meter (100%)
  const intensityPercent = Math.round((1 / (distance * distance)) * 100);

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
            <Atom className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              RADIATION BASICS & CIVIL DEFENSE SCIENCE
            </h1>
            <p className="text-xs text-zinc-400">
              Ionizing Radiation Physics, The Golden Triad & Reactor Defense-in-Depth
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('basics')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border ${
            activeTab === 'basics'
              ? 'bg-cyan-500 text-black border-cyan-500 shadow-md'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          1. Physics & Exposure
        </button>
        <button
          onClick={() => setActiveTab('triad')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border ${
            activeTab === 'triad'
              ? 'bg-cyan-500 text-black border-cyan-500 shadow-md'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          2. The Golden Triad
        </button>
        <button
          onClick={() => setActiveTab('barriers')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border ${
            activeTab === 'barriers'
              ? 'bg-cyan-500 text-black border-cyan-500 shadow-md'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          3. Reactor Barriers
        </button>
      </div>

      {/* TAB 1: PHYSICS & EXPOSURE */}
      {activeTab === 'basics' && (
        <div className="space-y-4 animate-fade-in">
          {/* Penetration Depth Visual Guide */}
          <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Types of Ionizing Radiation & Penetration Depth</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Different radiation types interact distinctly with shielding materials and living human biological tissue:
            </p>

            <div className="space-y-2 text-xs">
              {/* Alpha */}
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-red-950/80 border border-red-700 text-red-400 flex items-center justify-center font-bold text-sm shrink-0">
                  α
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Alpha Particles (Helium Nuclei)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono">
                      Stopped by Sheet of Paper or Dead Skin
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                    Heavy, charged particles with high linear energy transfer (LET). Cannot penetrate the outer dead skin layer. Highly hazardous ONLY if radioactive alpha-emitters are inhaled, ingested, or enter open wounds.
                  </p>
                </div>
              </div>

              {/* Beta */}
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-950/80 border border-amber-700 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                  β
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Beta Particles (High-Speed Electrons)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono">
                      Stopped by Layer of Plastic or Aluminum
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                    Can penetrate several millimeters of living skin tissue, causing "beta radiation burns". Heavy clothing, safety goggles, and plastic rainwear block external beta radiation.
                  </p>
                </div>
              </div>

              {/* Gamma */}
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-950/80 border border-purple-700 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                  γ
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Gamma Rays (High-Energy Photons)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-red-400 font-mono">
                      Requires Thick Lead, Concrete, or Earth
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                    Highly penetrating electromagnetic waves. Pass easily through human bodies. Deep underground shelters, thick concrete basements, and packed soil are required to attenuate gamma intensity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Lessons from Data */}
          <div className="space-y-3">
            {RADIATION_LESSONS.map(lesson => (
              <div key={lesson.id} className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">{lesson.title}</h3>
                </div>
                <div className="p-2.5 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-cyan-300 text-xs font-semibold">
                  {lesson.keyPrinciple}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                  {lesson.content}
                </p>
                <div className="pt-2 border-t border-zinc-800 flex items-start gap-1.5 text-[11px] text-amber-300 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Civil Defense Rule:</strong> {lesson.practicalRule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: THE GOLDEN TRIAD & INTERACTIVE CALCULATOR */}
      {activeTab === 'triad' && (
        <div className="space-y-4 animate-fade-in">
          {/* Triad Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">1. TIME</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Total Absorbed Dose = Dose Rate × Time. Halving your exposure duration directly cuts your absorbed radiation dose by 50%.
              </p>
            </div>

            <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Maximize className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">2. DISTANCE</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Intensity follows the Inverse-Square Law (1/d²). Doubling your distance from a point source reduces gamma intensity to 25%.
              </p>
            </div>

            <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">3. SHIELDING</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Dense atomic nuclei absorb photons. Heavy concrete, steel, earth, or water barriers physically attenuate penetrating gamma radiation.
              </p>
            </div>
          </div>

          {/* Interactive Inverse-Square Calculator */}
          <div className="p-4 bg-disaster-card border border-amber-500/40 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Interactive Distance Attenuation Simulator (Inverse-Square Law)
                </h3>
              </div>
              <span className="font-mono text-xs text-zinc-400">I ∝ 1/d²</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-300">Distance from Point Radiation Source:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{distance} Meters</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>1m (100% baseline)</span>
                <span>5m (4%)</span>
                <span>10m (1%)</span>
              </div>
            </div>

            {/* Visual Result Gauge */}
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Relative Exposure Intensity</span>
                <span className="text-2xl font-black font-mono text-amber-400">{intensityPercent}%</span>
                <span className="text-[10px] text-zinc-500 block">of baseline 1-meter dose rate</span>
              </div>
              <div className="text-right max-w-[200px]">
                <span className="text-xs font-bold text-emerald-400">
                  {distance > 1 ? `${Math.round(100 - intensityPercent)}% Radiation Dose Reduced!` : 'Maximum Exposure at Source'}
                </span>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Every step away from radioactive debris dramatically lowers biological risk.
                </p>
              </div>
            </div>
          </div>

          {/* Half-Value Layer (HVL) Table */}
          <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Half-Value Layer (HVL) Thickness for Common Fallout (Cobalt-60 / Cesium-137)
            </h3>
            <p className="text-xs text-zinc-400">
              One HVL cuts gamma radiation in half (50%). Two HVLs cut it to 25%; three HVLs to 12.5%.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="p-2">Shielding Material</th>
                    <th className="p-2">1 HVL (50% Cut)</th>
                    <th className="p-2">Protection Factor (PF) in Typical Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300 font-mono text-[11px]">
                  <tr>
                    <td className="p-2 font-sans font-semibold text-white">Lead Sheet (Pb)</td>
                    <td className="p-2 text-cyan-400">~1.2 cm</td>
                    <td className="p-2">PF 100+ (Specialized shelter)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-semibold text-white">Solid Concrete Wall</td>
                    <td className="p-2 text-cyan-400">~6.0 cm</td>
                    <td className="p-2">PF 20 - 50 (Basement)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-semibold text-white">Compacted Earth / Soil</td>
                    <td className="p-2 text-cyan-400">~9.0 cm</td>
                    <td className="p-2">PF 40 - 100 (Underground cellar)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-semibold text-white">Standard Brickwork</td>
                    <td className="p-2 text-cyan-400">~7.5 cm</td>
                    <td className="p-2">PF 5 - 10 (Interior room)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-semibold text-white">Wood / Drywall</td>
                    <td className="p-2 text-cyan-400">~28.0 cm</td>
                    <td className="p-2 text-red-400">PF ~2 (Poor protection)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 5 REACTOR BARRIERS (NARORA / PHWR ARCHITECTURE) */}
      {activeTab === 'barriers' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              5 Physical Defence-in-Depth Barriers in Pressurized Heavy Water Reactors (PHWR)
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Nuclear power plants like Narora Atomic Power Station (NAPS) utilize five sequential, independent physical barriers between the radioactive fission products and the public environment:
            </p>
          </div>

          <div className="space-y-3">
            {REACTOR_BARRIERS.map(b => (
              <div key={b.level} className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
                      {b.level}
                    </span>
                    <h3 className="text-sm font-bold text-white">{b.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    Barrier #{b.level}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{b.description}</p>
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-red-300">
                  <span className="font-bold text-red-400">Failure / Challenge Threshold: </span>
                  <span>{b.failureThreshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
