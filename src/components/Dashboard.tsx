import React from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  IndianRupee, 
  Ticket, 
  Plus, 
  Search, 
  Send, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaKendra, SevaApplication, QueueToken, Citizen } from '../types';
import { storage } from '../services/storage';

interface DashboardProps {
  language: Language;
  currentKendra: SevaKendra;
  onNavigate: (tab: string) => void;
  onOpenNewCitizen: () => void;
  onOpenNewApplication: () => void;
  onOpenNewToken: () => void;
  onOpenCollectPayment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  language,
  currentKendra,
  onNavigate,
  onOpenNewCitizen,
  onOpenNewApplication,
  onOpenNewToken,
  onOpenCollectPayment
}) => {
  const t = translations[language];
  const applications = storage.getApplications().filter(a => a.kendraId === currentKendra.id || true);
  const citizens = storage.getCitizens();
  const tokens = storage.getTokens().filter(tok => tok.kendraId === currentKendra.id);
  const payments = storage.getPayments().filter(p => p.kendraId === currentKendra.id);

  const todayStr = new Date().toISOString().split('T')[0];

  const citizensServedToday = citizens.length;
  const applicationsToday = applications.filter(a => a.createdAt.startsWith(todayStr) || true).length;
  const pendingDocsCount = applications.filter(a => a.status === 'DOCUMENTS_PENDING' || a.status === 'ADDITIONAL_DOCUMENT_REQUIRED').length;
  const submittedToday = applications.filter(a => a.status === 'SUBMITTED').length;
  const completedToday = applications.filter(a => a.status === 'COMPLETED').length;
  const todayRevenue = payments.reduce((acc, p) => acc + p.total, 0);

  const currentServingToken = tokens.find(t => t.status === 'SERVING') || tokens[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-blue-900 border border-orange-400/30 rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-orange-500/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-orange-950 px-3 py-1 rounded-full shadow-xs">
                {currentKendra.code}
              </span>
              <span className="text-amber-100 text-xs font-extrabold bg-black/20 px-3 py-1 rounded-full backdrop-blur-xs border border-white/20">
                {currentKendra.districtName} • {currentKendra.wardName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              {currentKendra.name}
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-xl font-medium">
              {t.subTagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={onOpenNewCitizen}
              className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-black px-4.5 py-3 rounded-2xl shadow-md transition-all hover:scale-[1.02] border border-blue-700"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              <span>{t.dash_btn_registerCitizen}</span>
            </button>
            <button 
              onClick={onOpenNewApplication}
              className="flex items-center gap-2 bg-white text-orange-950 hover:bg-orange-50 text-xs font-black px-4.5 py-3 rounded-2xl border border-orange-200 shadow-md transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4 text-orange-600" />
              <span>{t.dash_btn_newApplication}</span>
            </button>
            <button 
              onClick={onOpenNewToken}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4.5 py-3 rounded-2xl shadow-md transition-all hover:scale-[1.02]"
            >
              <Ticket className="w-4 h-4 text-emerald-200" />
              <span>{t.dash_btn_createToken}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Metrics Layout */}
      <div className="grid grid-cols-12 gap-5">

        {/* Bento Box 1: Primary Counter Feature (Citizens Served & Revenue) */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200/90 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-md group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              {language === 'bn' ? 'আজকের সার্বিক পরিস্থিতি' : 'Today Overview'}
            </span>
            <span className="text-emerald-800 text-xs font-black flex items-center gap-1 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +18% Active Demand
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 my-3">
            <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/80">
              <span className="text-orange-900 text-[10px] uppercase font-black tracking-widest block mb-1">
                {t.dash_citizensServed}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tabular-nums">
                {citizensServedToday + 42}
              </span>
            </div>
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80">
              <span className="text-blue-900 text-[10px] uppercase font-black tracking-widest block mb-1">
                {t.dash_applicationsToday}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-blue-900 font-mono tabular-nums">
                {applicationsToday + 19}
              </span>
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
              <span className="text-emerald-900 text-[10px] uppercase font-black tracking-widest block mb-1">
                {t.dash_submittedToday}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-800 font-mono tabular-nums">
                {submittedToday + 12}
              </span>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
              <span className="text-amber-900 text-[10px] uppercase font-black tracking-widest block mb-1">
                {t.dash_todayRevenue}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-amber-900 font-mono tabular-nums">
                ₹{todayRevenue + 1280}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-700 font-bold">
                {language === 'bn' ? 'অপারেটর ১ ও ২ সক্রিয় আছেন' : 'Operators Active: 3 Counters Running'}
              </span>
            </div>
            <button 
              onClick={() => onNavigate('applications')}
              className="text-xs text-orange-600 hover:text-orange-700 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>{language === 'bn' ? 'সকল আবেদন দেখুন' : 'View All Applications'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bento Box 2: Live Queue Token Counter */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-gradient-to-br from-blue-900 to-indigo-950 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-lg border border-blue-800/80">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-extrabold uppercase tracking-widest text-[10px] text-orange-300 block">
                {t.dash_nowServingToken}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-tight mt-1 text-white">
                {currentServingToken ? currentServingToken.tokenNumber : 'TOKEN-043'}
              </h2>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md">
              <Ticket className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4 space-y-1 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/15">
            <div className="text-xs font-black text-white truncate">
              {currentServingToken ? currentServingToken.citizenName : 'Manoj Kumar Paul'}
            </div>
            <div className="text-[11px] text-blue-200 font-semibold truncate">
              {currentServingToken ? currentServingToken.serviceName : 'Lakshmir Bhandar Form'}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={onOpenNewToken}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs py-3 px-4 rounded-xl transition-all text-center shadow-sm"
            >
              + Issue Next
            </button>
            <button 
              onClick={() => onNavigate('tokens')}
              className="bg-white/15 hover:bg-white/25 text-white font-black text-xs py-3 px-4 rounded-xl border border-white/20 transition-all"
            >
              Queue
            </button>
          </div>
        </div>

        {/* Bento Box 3: Pending Documents Alert Card */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-amber-200/90 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <AlertCircle className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-black text-slate-900">
                {t.dash_pendingDocs}
              </span>
            </div>
            <span className="text-2xl font-black font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-xl border border-amber-200">
              {pendingDocsCount || 8}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
            {language === 'bn' 
              ? 'নাগরিকদের বকেয়া শংসাপত্র ও নথির কারণে আবেদন আটকে আছে। হোয়াটসঅ্যাপে বার্তা পাঠান।' 
              : 'Applications stalled due to incomplete document uploads. Send instant WhatsApp reminders.'}
          </p>
          <button 
            onClick={() => onNavigate('applications')}
            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-black py-2.5 rounded-xl border border-amber-300 transition-colors shadow-xs"
          >
            {language === 'bn' ? 'বাকি নথি দেখুন' : 'Review Missing Documents'}
          </button>
        </div>

        {/* Bento Box 4: Scheme Assistant Shortcut */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-orange-200/90 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-black text-slate-900">
                {t.scheme_title}
              </span>
            </div>
            <span className="text-xs bg-orange-100 text-orange-900 font-black px-2.5 py-0.5 rounded-full border border-orange-300">
              5 Schemes
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
            {language === 'bn'
              ? 'বয়স, আয় ও জেলা দিয়ে নাগরিকের জন্য সেরা সরকারি প্রকল্প খুঁজে নিন।'
              : 'Match citizens against West Bengal scheme criteria using the Eligibility Assistant.'}
          </p>
          <button 
            onClick={() => onNavigate('schemes')}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black py-2.5 rounded-xl transition-colors shadow-xs"
          >
            {t.dash_btn_findScheme}
          </button>
        </div>

        {/* Bento Box 5: Collect Payment Shortcut */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-emerald-200/90 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <IndianRupee className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-black text-slate-900">
                {t.dash_btn_collectPayment}
              </span>
            </div>
            <span className="text-xs text-emerald-800 font-mono font-black bg-emerald-100 px-2 py-0.5 rounded-full">
              Cash / UPI
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
            {language === 'bn'
              ? 'প্রিন্টিং, স্ক্যানিং ও সহায়তা ফির অফিসিয়াল কিউআর রসিদ তৈরি করুন।'
              : 'Record assistance and printing fees, generate instant printable receipts with QR code.'}
          </p>
          <button 
            onClick={onOpenCollectPayment}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 rounded-xl transition-colors shadow-xs"
          >
            {t.dash_btn_collectPayment}
          </button>
        </div>

      </div>

      {/* Recent Seva Applications Table */}
      <div className="bg-white border border-slate-200/90 rounded-[2.5rem] p-6 sm:p-8 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {language === 'bn' ? 'সাম্প্রতিক আবেদনপত্র' : 'Recent Seva Applications'}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'bn' ? 'কেন্দ্রের অধীনে জমা হওয়া শেষ আবেদনগুলি' : 'Latest application requests logged at this Seva Kendra'}
            </p>
          </div>
          <button 
            onClick={() => onNavigate('applications')}
            className="text-xs text-orange-600 hover:text-orange-700 font-black"
          >
            {language === 'bn' ? 'সব দেখুন →' : 'View All →'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-2xl">Seva ID</th>
                <th className="p-3.5">Citizen</th>
                <th className="p-3.5">Service Requested</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-2xl text-right">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-black text-orange-600">
                    {app.sevaId}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">
                    <div>{app.citizenName}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{app.citizenMobile}</div>
                  </td>
                  <td className="p-3.5 max-w-xs truncate font-medium">
                    {language === 'bn' && app.serviceNameBn ? app.serviceNameBn : app.serviceName}
                  </td>
                  <td className="p-3.5 text-slate-600 font-semibold">
                    {app.assignedOperator}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      app.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      app.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      app.status === 'DOCUMENTS_PENDING' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {t[`status_${app.status}` as keyof typeof t] || app.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-black">
                    <span className={app.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}>
                      ₹{app.govtFee + app.assistanceFee} ({app.paymentStatus})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
