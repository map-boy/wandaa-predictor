import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface AdInterstitialProps {
  isOpen: boolean;
  onClose: () => void;
  adUnitId?: string;
  onContinueToMatch?: () => void;
}

export const AdInterstitial: React.FC<AdInterstitialProps> = ({
  isOpen,
  onClose,
  adUnitId = 'ca-app-pub-3904357053213893/5839201948',
  onContinueToMatch,
}) => {
  const [countdown, setCountdown] = useState(3);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    onClose();
    if (onContinueToMatch) {
      onContinueToMatch();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl relative text-white flex flex-col justify-between min-h-[420px]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              AdMob Interstitial Unit
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ID: {adUnitId.slice(-6)}
            </span>
          </div>

          {canSkip ? (
            <button
              onClick={handleDismiss}
              className="flex items-center space-x-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-md"
            >
              <span>Skip Ad</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="text-xs font-semibold text-slate-400 px-3 py-1 bg-slate-800 rounded-lg">
              Reward / Skip in <span className="text-amber-400 font-bold">{countdown}s</span>
            </div>
          )}
        </div>

        {/* Interstitial Ad Main Body */}
        <div className="my-6 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20">
            ADS
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Sponsored Display Placement
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Wandaa Premium Partner Offer
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto mt-2 leading-relaxed">
              Enjoy 100% free sports match predictions & stats supported by display sponsors.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-left text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span>Google AdMob Interstitial Slot</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              In your production React Native / Flutter / Android app, trigger <code className="text-emerald-400">InterstitialAd.show()</code> before opening match detail pages.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleDismiss}
            className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2 ${
              canSkip
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-110'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{canSkip ? 'Continue to Match Details' : `Loading Match Data (${countdown}s)...`}</span>
          </button>
          
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3 h-3 text-slate-400" />
            <span>AdMob Monetization Framework • No real money betting</span>
          </div>
        </div>
      </div>
    </div>
  );
};
