import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const DisclaimerBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-3 py-1.5 text-xs text-amber-300 flex items-center justify-between gap-2 z-30">
      <div className="flex items-center gap-1.5 overflow-hidden">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span className="truncate font-semibold tracking-wide">
          {t.officialWarning}
        </span>
      </div>
      <span className="text-[10px] text-amber-400/80 uppercase font-mono tracking-wider shrink-0 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
        CHE110 DEMO
      </span>
    </div>
  );
};
