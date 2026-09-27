import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { SAFETY_ARTICLES } from '../../data/safetyGuidesData';
import { SafetyCategory } from '../../types/educational';

export const SafetyGuideScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(SAFETY_ARTICLES[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredArticles = SAFETY_ARTICLES.filter(article => {
    const matchesCategory = activeCategory === 'ALL' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.whatToDo.some(td => td.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              RADIOLOGICAL CIVIL DEFENSE GUIDES
            </h1>
            <p className="text-xs text-zinc-400">
              Authoritative Protocols for Before, During, and After an Emergency
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
          placeholder="Search safety guides (e.g. shelter, water, decontamination, pet)..."
          className="w-full bg-disaster-card border border-disaster-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2">
        {['ALL', 'BEFORE', 'DURING', 'AFTER'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors border ${
              activeCategory === cat
                ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All Guides' : cat === 'BEFORE' ? '1. Before Incident' : cat === 'DURING' ? '2. During Event' : '3. After & Recovery'}
          </button>
        ))}
      </div>

      {/* Guide Cards */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 bg-disaster-card border border-disaster-border rounded-xl">
            No guides found matching your search.
          </div>
        ) : (
          filteredArticles.map(article => {
            const isExpanded = expandedId === article.id;
            return (
              <div
                key={article.id}
                className="bg-disaster-card border border-disaster-border rounded-xl overflow-hidden transition-all shadow-md"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(article.id)}
                  className="p-4 cursor-pointer hover:bg-zinc-800/40 transition-colors flex items-start justify-between gap-3 select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        article.category === 'BEFORE'
                          ? 'bg-blue-950/60 text-blue-400 border border-blue-800'
                          : article.category === 'DURING'
                          ? 'bg-red-950/60 text-red-400 border border-red-800'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                      }`}>
                        {article.category}
                      </span>
                      <h2 className="text-sm font-bold text-white">{article.title}</h2>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{article.summary}</p>
                  </div>

                  <div className="p-1 rounded bg-zinc-900 text-zinc-400 shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 pt-0 space-y-4 border-t border-zinc-800/60 text-xs animate-fade-in">
                    {/* What To Do (Do's) */}
                    <div className="space-y-2 mt-3">
                      <h3 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>MANDATORY ACTIONS (WHAT TO DO)</span>
                      </h3>
                      <ul className="space-y-1.5 pl-1">
                        {article.whatToDo.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-zinc-300 leading-relaxed">
                            <span className="text-emerald-500 font-bold shrink-0">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What NOT To Do (Don'ts) */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>PROHIBITED ACTIONS (WHAT NOT TO DO)</span>
                      </h3>
                      <ul className="space-y-1.5 pl-1">
                        {article.whatNotToDo.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-red-200 leading-relaxed">
                            <span className="text-red-500 font-bold shrink-0">✕</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Rule / Takeaway */}
                    <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded-lg flex items-start gap-2 text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-400 uppercase tracking-wider block text-[10px]">
                          CRITICAL TAKEAWAY
                        </strong>
                        <span className="text-[11px] leading-relaxed">{article.important}</span>
                      </div>
                    </div>

                    {/* Sources */}
                    {article.sources && article.sources.length > 0 && (
                      <div className="pt-2 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Standards: {article.sources.join(' | ')}</span>
                      </div>
                    )}
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
