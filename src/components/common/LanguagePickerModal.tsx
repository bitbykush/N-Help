import React from 'react';
import { X, Check, Globe } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { SupportedLanguage } from '../../i18n/translations';

interface Props {
  onClose: () => void;
}

export const LanguagePickerModal: React.FC<Props> = ({ onClose }) => {
  const { lang, setLang, supportedLanguages } = useTranslation();

  const handleSelect = (code: SupportedLanguage) => {
    setLang(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-disaster-card border border-disaster-border rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-disaster-border bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-white text-base">Select Language / भाषा चुनें</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          <div className="text-xs text-amber-400/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 mb-3">
            English and Hindi (हिन्दी) feature complete emergency triage translation. Regional Indian languages include extensible safety dictionaries.
          </div>

          <div className="grid grid-cols-1 gap-2">
            {supportedLanguages.map((l) => {
              const isSelected = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{l.nativeName}</div>
                    <div className="text-xs text-slate-400">{l.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {l.isFullySupported ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                        DICT
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-slate-950 border-t border-disaster-border text-center">
          <p className="text-[11px] text-slate-400">
            Emergency translation framework conforms to Course CHE110 standards.
          </p>
        </div>
      </div>
    </div>
  );
};
