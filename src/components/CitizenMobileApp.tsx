import React, { useState } from 'react';
import { 
  Smartphone, 
  Search, 
  FileText, 
  Sparkles, 
  Ticket, 
  MapPin, 
  PhoneCall, 
  User, 
  QrCode,
  Bell,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaKendra, Citizen } from '../types';
import { storage } from '../services/storage';

interface CitizenMobileAppProps {
  language: Language;
  currentKendra: SevaKendra;
}

export const CitizenMobileApp: React.FC<CitizenMobileAppProps> = ({
  language,
  currentKendra
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'home' | 'schemes' | 'track' | 'token'>('home');
  const [trackId, setTrackId] = useState('SEVA-2026-000184');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
          {language === 'bn' ? 'সিটিজেন মোবাইল ভিউ' : 'Citizen Companion App Interface'}
        </span>
        <h1 className="text-2xl font-black text-white">
          {language === 'bn' ? 'নাগরিক মোবাইল অ্যাপ প্রাকদর্শন' : 'Citizen Mobile App Preview'}
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          {language === 'bn' 
            ? 'নাগরিকরা কীভাবে তাদের স্মার্টফোন থেকে সরাসরি সেবার স্ট্যাটাস, টোকেন ও স্কিম ট্র্যাকিং করতে পারেন।' 
            : 'PWA Mobile interface designed for citizens to track applications, book queue tokens, and discover eligible government schemes.'}
        </p>
      </div>

      {/* Mobile Device Frame Mockup */}
      <div className="flex justify-center">
        <div className="w-full max-w-[380px] bg-black border-4 border-neutral-800 rounded-[3rem] p-4 shadow-2xl space-y-4 text-white relative">
          
          {/* Top Speaker notch */}
          <div className="w-28 h-4 bg-neutral-800 rounded-full mx-auto mb-2" />

          {/* App Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xs text-white">
                S
              </div>
              <div>
                <span className="font-extrabold text-xs block leading-tight">SEVA DESK</span>
                <span className="text-[9px] text-neutral-400">{currentKendra.name}</span>
              </div>
            </div>
            <Bell className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Dynamic Content based on Tab */}
          <div className="min-h-[440px] space-y-4 text-xs">
            
            {activeTab === 'home' && (
              <div className="space-y-4">
                {/* Greeting Card */}
                <div className="p-4 bg-gradient-to-br from-indigo-900 to-neutral-900 rounded-2xl border border-indigo-700/50">
                  <span className="text-[10px] text-indigo-300 uppercase font-bold block mb-1">Namaste, Citizen</span>
                  <h3 className="font-black text-sm text-white">Welcome to Seva Desk</h3>
                  <p className="text-[11px] text-neutral-300 mt-1">Access 18+ West Bengal government schemes seamlessly.</p>
                </div>

                {/* Quick Action Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setActiveTab('schemes')}
                    className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-left hover:border-indigo-500"
                  >
                    <Sparkles className="w-5 h-5 text-indigo-400 mb-1" />
                    <span className="font-bold text-xs block">Scheme Finder</span>
                    <span className="text-[9px] text-neutral-500">Check eligibility</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('track')}
                    className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-left hover:border-indigo-500"
                  >
                    <Search className="w-5 h-5 text-emerald-400 mb-1" />
                    <span className="font-bold text-xs block">Track Status</span>
                    <span className="text-[9px] text-neutral-500">SEVA ID Search</span>
                  </button>
                </div>

                {/* Active Application Card */}
                <div className="p-3.5 bg-neutral-900 rounded-2xl border border-neutral-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono font-bold text-indigo-400">SEVA-2026-000184</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full font-bold">READY</span>
                  </div>
                  <div className="font-bold text-xs text-white">Swasthya Sathi Renewal</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Collect card from Kendra Counter #2</div>
                </div>
              </div>
            )}

            {activeTab === 'track' && (
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-white">Track Application</h3>
                <input 
                  type="text" 
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs font-mono p-2.5 rounded-xl text-white uppercase"
                />
                <button className="w-full bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl">
                  Search SEVA ID
                </button>
              </div>
            )}

          </div>

          {/* Bottom Mobile Nav */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-around text-[10px] text-neutral-400">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center ${activeTab === 'home' ? 'text-indigo-400 font-bold' : ''}`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => setActiveTab('schemes')}
              className={`flex flex-col items-center ${activeTab === 'schemes' ? 'text-indigo-400 font-bold' : ''}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Schemes</span>
            </button>
            <button 
              onClick={() => setActiveTab('track')}
              className={`flex flex-col items-center ${activeTab === 'track' ? 'text-indigo-400 font-bold' : ''}`}
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
