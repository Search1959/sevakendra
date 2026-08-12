import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  X, 
  Play, 
  SkipForward,
  Volume2
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { QueueToken, SevaKendra } from '../types';
import { storage } from '../services/storage';

interface TokenQueueProps {
  language: Language;
  currentKendra: SevaKendra;
}

export const TokenQueueView: React.FC<TokenQueueProps> = ({
  language,
  currentKendra
}) => {
  const t = translations[language];
  const [tokens, setTokens] = useState<QueueToken[]>(storage.getTokens().filter(t => t.kendraId === currentKendra.id));
  const [showNewTokenModal, setShowNewTokenModal] = useState(false);

  const [citizenName, setCitizenName] = useState('');
  const [citizenMobile, setCitizenMobile] = useState('');
  const [serviceName, setServiceName] = useState('Lakshmir Bhandar Form');

  const servingToken = tokens.find(t => t.status === 'SERVING') || tokens[0];
  const waitingTokens = tokens.filter(t => t.status === 'WAITING');

  const handleIssueToken = (e: React.FormEvent) => {
    e.preventDefault();
    const lastNum = tokens.reduce((max, t) => Math.max(max, t.numberOnly || 0), 42);
    const newNum = lastNum + 1;

    const newToken: QueueToken = {
      id: `tok-${Date.now()}`,
      tokenNumber: `TOKEN-0${newNum}`,
      numberOnly: newNum,
      citizenName: citizenName || 'Walk-in Citizen',
      citizenMobile: citizenMobile || '9830000000',
      serviceName,
      kendraId: currentKendra.id,
      status: 'WAITING',
      createdAt: new Date().toISOString()
    };

    storage.saveToken(newToken);
    setTokens(storage.getTokens().filter(t => t.kendraId === currentKendra.id));
    setShowNewTokenModal(false);
    setCitizenName('');
    setCitizenMobile('');
  };

  const handleCallNext = () => {
    const waiting = tokens.filter(t => t.status === 'WAITING');
    if (waiting.length === 0) return;

    const current = tokens.find(t => t.status === 'SERVING');
    if (current) {
      current.status = 'COMPLETED';
      storage.saveToken(current);
    }

    const next = waiting[0];
    next.status = 'SERVING';
    next.counterNo = 1;
    storage.saveToken(next);

    setTokens(storage.getTokens().filter(t => t.kendraId === currentKendra.id));
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
            {language === 'bn' ? 'টোকেন ব্যবস্থাপনা' : 'Daily Token Queue System'}
          </span>
          <h1 className="text-2xl font-black text-white">
            {language === 'bn' ? 'লাইন ও টোকেন সার্ভিস' : 'Token & Counter Queue'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn' ? 'কেন্দ্রের ভিড় কমাতে স্বয়ংক্রিয় টোকেন নম্বর প্রদান ও ডাকার ব্যবস্থা।' : 'Streamline walk-in citizen flow with live token displays.'}
          </p>
        </div>

        <button 
          onClick={() => setShowNewTokenModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.dash_btn_createToken}</span>
        </button>
      </div>

      {/* Main Serving Screen Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Now Serving Big Display */}
        <div className="lg:col-span-7 bg-indigo-600 rounded-[2.5rem] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-indigo-600/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
                {t.dash_nowServingToken}
              </span>
              <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                Counter #1
              </span>
            </div>

            <div className="text-6xl sm:text-7xl font-black font-mono tracking-tighter my-6">
              {servingToken ? servingToken.tokenNumber : 'TOKEN-043'}
            </div>

            <div className="bg-black/20 p-5 rounded-2xl border border-white/10 backdrop-blur-sm space-y-1">
              <div className="text-lg font-bold">
                {servingToken ? servingToken.citizenName : 'Manoj Kumar Paul'}
              </div>
              <div className="text-xs text-indigo-200">
                Service: {servingToken ? servingToken.serviceName : 'Lakshmir Bhandar Form'}
              </div>
            </div>
          </div>

          <div className="pt-8 flex items-center justify-between gap-4">
            <button 
              onClick={handleCallNext}
              className="flex-1 bg-white hover:bg-neutral-100 text-indigo-950 font-black text-sm py-4 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Call Next Token</span>
            </button>
          </div>
        </div>

        {/* Waiting List Sidebar */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base">
                {language === 'bn' ? 'অপেক্ষমাণ তালিকা' : 'Waiting List'}
              </h3>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                {waitingTokens.length} Waiting
              </span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {waitingTokens.map((tok) => (
                <div key={tok.id} className="p-3.5 bg-neutral-800/50 rounded-2xl border border-neutral-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-indigo-400 block">{tok.tokenNumber}</span>
                    <span className="font-semibold text-white">{tok.citizenName}</span>
                    <span className="text-[10px] text-neutral-500 block truncate">{tok.serviceName}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {tok.createdAt.split('T')[1].substring(0, 5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setShowNewTokenModal(true)}
            className="w-full mt-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold py-3 rounded-xl border border-neutral-700 transition-colors"
          >
            + Issue Walk-in Token
          </button>
        </div>

      </div>

      {/* New Token Issue Modal */}
      {showNewTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Issue Queue Token</h3>
              <button onClick={() => setShowNewTokenModal(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueToken} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Citizen Name</label>
                <input 
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Manoj Kumar Paul"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Mobile Number</label>
                <input 
                  type="tel"
                  value={citizenMobile}
                  onChange={(e) => setCitizenMobile(e.target.value)}
                  placeholder="10 digit mobile"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Requested Service</label>
                <input 
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Lakshmir Bhandar Form"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowNewTokenModal(false)} className="px-4 py-2 bg-neutral-800 text-neutral-300 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">
                  Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
