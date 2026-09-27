import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, ShieldAlert, CheckSquare, HelpCircle, FileText } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { SAFETY_ARTICLES } from '../../data/safetyGuidesData';
import { MYTH_FACT_ENTRIES } from '../../data/mythFactData';
import { FAQS_DATA } from '../../data/faqsData';
import { DEFAULT_KIT_ITEMS } from '../../data/kitDefaultData';
import { RADIATION_LESSONS } from '../../data/radiationBasicsData';

interface Props {
  onClose: () => void;
}

export const SearchModal: React.FC<Props> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const { setCurrentView } = useEmergency();

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const results: Array<{
      type: string;
      title: string;
      snippet: string;
      targetView: any;
      icon: any;
    }> = [];

    // Search Safety Guides
    SAFETY_ARTICLES.forEach(a => {
      if (a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.whatToDo.some(w => w.toLowerCase().includes(q))) {
        results.push({
          type: 'Safety Guide',
          title: a.title,
          snippet: a.summary,
          targetView: 'safety-guide',
          icon: BookOpen
        });
      }
    });

    // Search Radiation Basics
    RADIATION_LESSONS.forEach(l => {
      if (l.title.toLowerCase().includes(q) || l.keyPrinciple.toLowerCase().includes(q) || l.content.toLowerCase().includes(q)) {
        results.push({
          type: 'Radiation Basics',
          title: l.title,
          snippet: l.keyPrinciple,
          targetView: 'radiation-basics',
          icon: ShieldAlert
        });
      }
    });

    // Search Myth vs Fact
    MYTH_FACT_ENTRIES.forEach(m => {
      if (m.myth.toLowerCase().includes(q) || m.fact.toLowerCase().includes(q) || m.scientificExplanation.toLowerCase().includes(q)) {
        results.push({
          type: 'Myth vs Fact',
          title: m.myth,
          snippet: `FACT: ${m.fact}`,
          targetView: 'myth-fact',
          icon: FileText
        });
      }
    });

    // Search Kit Checklist
    DEFAULT_KIT_ITEMS.forEach(k => {
      if (k.name.toLowerCase().includes(q) || k.detail.toLowerCase().includes(q)) {
        results.push({
          type: 'Emergency Kit',
          title: k.name,
          snippet: k.detail,
          targetView: 'kit',
          icon: CheckSquare
        });
      }
    });

    // Search FAQs
    FAQS_DATA.forEach(f => {
      if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
        results.push({
          type: 'FAQ',
          title: f.question,
          snippet: f.answer,
          targetView: 'faq',
          icon: HelpCircle
        });
      }
    });

    return results.slice(0, 15);
  }, [query]);

  const handleSelect = (targetView: any) => {
    setCurrentView(targetView);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-disaster-card border border-disaster-border rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[75vh]">
        {/* Input Header */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-disaster-border bg-slate-900">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, radiation, iodine, water, kit..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2">
          {query.trim().length < 2 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Type at least 2 characters to search offline guides, decontamination checklists, and radiation physics...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No offline articles matching "<span className="text-white font-semibold">{query}</span>"
            </div>
          ) : (
            searchResults.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleSelect(item.targetView)}
                  className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 cursor-pointer transition-all flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-amber-400/90 uppercase tracking-wider bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                        {item.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{item.snippet}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-950 border-t border-disaster-border flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Offline Instant Search</span>
          <span>{searchResults.length} results</span>
        </div>
      </div>
    </div>
  );
};
