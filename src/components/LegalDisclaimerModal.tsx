import React from 'react';
import { X, ShieldAlert, CheckCircle2, Info, Lock } from 'lucide-react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Legal & Entertainment Disclaimer</h3>
              <p className="text-xs text-slate-400">Important terms regarding predictions and ad monetization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-2xl flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block">100% Free Service</strong>
              <span>
                Wandaa Predictions does not sell tips, charge subscription fees, or accept any real money deposits or wagers.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block">For Entertainment Purposes Only</strong>
              <span>
                All predictions, confidence scores, and team form analysis are derived from mathematical modeling and publicly available statistics. Success in past fixtures does not guarantee future results.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-start space-x-2.5">
            <Lock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sky-300 block">Monetization Notice</strong>
              <span>
                This application is funded through Google AdMob and display advertising placements. Advertising partners do not influence statistical match evaluations or outcome predictions.
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-110 transition"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
};
