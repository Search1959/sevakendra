import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  Phone, 
  ArrowLeft,
  QrCode,
  FileText
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaApplication } from '../types';
import { storage } from '../services/storage';

interface PublicTrackProps {
  language: Language;
  onBackToPortal?: () => void;
}

export const PublicTrackView: React.FC<PublicTrackProps> = ({
  language,
  onBackToPortal
}) => {
  const t = translations[language];
  const [sevaIdInput, setSevaIdInput] = useState('SEVA-2026-000184');
  const [searchedApp, setSearchedApp] = useState<SevaApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const apps = storage.getApplications();
    const match = apps.find(a => a.sevaId.trim().toUpperCase() === sevaIdInput.trim().toUpperCase());

    if (match) {
      setSearchedApp(match);
    } else {
      setSearchedApp(null);
      setErrorMsg(language === 'bn' ? 'দুঃখিত, কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক SEVA ID লিখুন।' : 'No application found with this SEVA ID. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8 font-sans">
      
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Navbar Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-600/30">
              S
            </div>
            <div>
              <h1 className="font-black text-lg text-white tracking-tight">SEVA DESK</h1>
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest block">Public Citizen Portal</span>
            </div>
          </div>

          {onBackToPortal && (
            <button 
              onClick={onBackToPortal}
              className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-4 py-2 rounded-xl border border-neutral-800 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Staff Desk</span>
            </button>
          )}
        </div>

        {/* Hero Search Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 sm:p-10 text-center space-y-4 shadow-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
            {language === 'bn' ? 'নাগরিক ট্র্যাক সিস্টেম' : 'Real-Time Status Tracking'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'bn' ? 'আবেদনের বর্তমান স্থিতি জানুন' : 'Track Your Seva Application Status'}
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            {language === 'bn' 
              ? 'আপনার রসিদে থাকা ১৮ ডিজিটের ইউনিক SEVA ID প্রবেশ করে আবেদনের অবস্থা যাচাই করুন।' 
              : 'Enter your 18-character official SEVA ID printed on your acknowledgment slip.'}
          </p>

          <form onSubmit={handleTrack} className="max-w-md mx-auto pt-2 space-y-3">
            <div className="relative">
              <input 
                type="text"
                value={sevaIdInput}
                onChange={(e) => setSevaIdInput(e.target.value)}
                placeholder="e.g. SEVA-2026-000184"
                className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono font-bold text-center text-lg rounded-2xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 placeholder:text-neutral-600 uppercase tracking-widest"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              Check Status Now
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Application Result Details */}
        {searchedApp && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800">
                  {searchedApp.sevaId}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{searchedApp.serviceName}</h3>
                <p className="text-xs text-neutral-400">Applicant: {searchedApp.citizenName}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-neutral-500 block uppercase font-bold">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block mt-0.5 ${
                  searchedApp.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  searchedApp.status === 'SUBMITTED' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                  'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {t[`status_${searchedApp.status}` as keyof typeof t] || searchedApp.status}
                </span>
              </div>
            </div>

            {/* Kendra info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Operating Center</span>
                <span className="text-neutral-200 font-bold">{searchedApp.kendraName}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Assigned Officer</span>
                <span className="text-neutral-200 font-bold">{searchedApp.assignedOperator}</span>
              </div>
            </div>

            {/* Live Progress Timeline */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Application Progress Journey</h4>
              <div className="space-y-4 relative border-l border-neutral-800 pl-4 ml-2">
                {searchedApp.timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full absolute -left-[22px] top-1 border-2 border-neutral-900" />
                    <div className="text-xs font-bold text-white">{event.title}</div>
                    <p className="text-[11px] text-neutral-400">{event.description}</p>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{event.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Action Box */}
            {searchedApp.status === 'COMPLETED' && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-xs text-emerald-300">
                🎉 Your certificate/card is ready! Please visit {searchedApp.kendraName} with your original acknowledgment slip to collect your document.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
