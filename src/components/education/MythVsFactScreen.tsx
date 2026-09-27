import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MYTH_FACT_ENTRIES } from '../../data/mythFactData';

export const MythVsFactScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(MYTH_FACT_ENTRIES[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredEntries = MYTH_FACT_ENTRIES.filter(item => {
    const matchesSeverity = selectedSeverity === 'ALL' || item.severity === selectedSeverity;
    const matchesSearch = item.myth.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.fact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.scientificExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              RADIATION MYTHS VS. SCIENTIFIC FACTS
            </h1>
            <p className="text-xs text-zinc-400">
              Debunking Deadly Misinformation & Sensationalism with Peer-Reviewed Science
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search common myths (e.g. phone sensor, boiling water, iodine, car escape)..."
          className="w-full bg-disaster-card border border-disaster-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Severity Filter Pills */}
      <div className="flex gap-2">
        {['ALL', 'CRITICAL', 'HIGH'].map(sev => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors border ${
              selectedSeverity === sev
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {sev === 'ALL' ? 'All Entries' : `${sev} Severity Myths`}
          </button>
        ))}
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 bg-disaster-card border border-disaster-border rounded-xl">
            No myths or facts matched your search criteria.
          </div>
        ) : (
          filteredEntries.map(entry => {
            const isExpanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className="bg-disaster-card border border-disaster-border rounded-xl overflow-hidden shadow-md transition-all"
              >
                <div
                  onClick={() => toggleExpand(entry.id)}
                  className="p-4 cursor-pointer hover:bg-zinc-800/40 transition-colors flex items-start justify-between gap-3 select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        entry.severity === 'CRITICAL'
                          ? 'bg-red-950/80 text-red-400 border border-red-800'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                      }`}>
                        {entry.severity} RISK MYTH
                      </span>
                    </div>

                    {/* Myth Line */}
                    <div className="flex items-start gap-2 text-xs font-semibold text-rose-300">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>MYTH: "{entry.myth}"</span>
                    </div>

                    {/* Fact Line */}
                    <div className="flex items-start gap-2 text-xs font-semibold text-emerald-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>FACT: {entry.fact}</span>
                    </div>
                  </div>

                  <div className="p-1 rounded bg-zinc-900 text-zinc-400 shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Explanation */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-zinc-800/60 text-xs animate-fade-in space-y-2.5">
                    <div className="p-3 mt-3 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        SCIENTIFIC MECHANISM & EVIDENCE
                      </span>
                      <p className="text-zinc-300 leading-relaxed text-xs">
                        {entry.scientificExplanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
