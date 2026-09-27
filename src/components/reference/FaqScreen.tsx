import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Filter 
} from 'lucide-react';
import { FAQS_DATA } from '../../data/faqsData';

export const FaqScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(FAQS_DATA[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = FAQS_DATA.filter(faq => {
    const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              CIVIL DEFENSE FREQUENTLY ASKED QUESTIONS
            </h1>
            <p className="text-xs text-zinc-400">
              Official Reference for Radiological Incidents & Emergency Protocols
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
          placeholder="Search FAQs (e.g. phone sensor, evacuation, blackout, iodine)..."
          className="w-full bg-disaster-card border border-disaster-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['ALL', 'GENERAL', 'RADIATION', 'SAFETY', 'COMMUNICATION'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All FAQs' : cat}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 bg-disaster-card border border-disaster-border rounded-xl">
            No FAQs found matching your search.
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-disaster-card border border-disaster-border rounded-xl overflow-hidden transition-all shadow-md"
              >
                <div
                  onClick={() => toggleExpand(faq.id)}
                  className="p-4 cursor-pointer hover:bg-zinc-800/40 transition-colors flex items-start justify-between gap-3 select-none"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-blue-400 font-semibold uppercase">
                      {faq.category}
                    </span>
                    <h2 className="text-xs sm:text-sm font-bold text-white mt-1">
                      {faq.question}
                    </h2>
                  </div>

                  <div className="p-1 rounded bg-zinc-900 text-zinc-400 shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-zinc-800/60 text-xs text-zinc-300 leading-relaxed animate-fade-in">
                    <p className="mt-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                      {faq.answer}
                    </p>
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
