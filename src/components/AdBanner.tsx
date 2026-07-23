import React, { useState } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';

interface AdBannerProps {
  slotId?: string;
  variant?: 'feed' | 'detail' | 'compact';
  title?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = 'ca-app-pub-3904357053213893/1029384756',
  variant = 'feed',
  title = 'Sponsored Announcement',
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (dismissed) return null;

  return (
    <div className="my-4 max-w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 p-3.5 shadow-xl relative group">
      {/* Ad Badge Tag */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            AdMob Banner Slot
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Unit ID: {slotId.slice(-8)}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded text-[11px] flex items-center gap-1"
            title="Ad Placement Info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-500 hover:text-slate-300 p-1 rounded"
            title="Simulate Closing Ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Ad Content / Banner Mockup */}
      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-md">
            ADS
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
              <span>{title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </h4>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              Targeted sports display placement • Ready for Google AdMob SDK / AdSense tag
            </p>
          </div>
        </div>

        <a
          href="#ad-info"
          onClick={(e) => {
            e.preventDefault();
            setShowDetails(!showDetails);
          }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-md hover:brightness-110 transition shrink-0 w-full sm:w-auto text-center"
        >
          Sponsored Link
        </a>
      </div>

      {/* AdMob Integration Blueprint details */}
      {showDetails && (
        <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 animate-fadeIn">
          <p className="font-bold text-amber-400">Google AdMob / AdSense Configuration Notice:</p>
          <p className="text-slate-400">
            This container represents a 320x100 / 728x90 adaptive banner slot. Upon native build deployment, replace this element with your production AdMob Banner view (`GAMBannerView` or `AdView`).
          </p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px] text-emerald-400 overflow-x-auto">
            {`<AdMobBanner adUnitID="${slotId}" adSize="BANNER" />`}
          </div>
        </div>
      )}
    </div>
  );
};
