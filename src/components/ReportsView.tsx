import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaKendra } from '../types';
import { storage } from '../services/storage';

interface ReportsViewProps {
  language: Language;
  currentKendra: SevaKendra;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  language,
  currentKendra
}) => {
  const t = translations[language];
  const apps = storage.getApplications();
  const citizens = storage.getCitizens();
  const payments = storage.getPayments();

  const exportApplicationsCSV = () => {
    const headers = ["SEVA_ID", "Citizen_Name", "Mobile", "Service", "Status", "Date"];
    const rows = apps.map(a => [
      a.sevaId,
      a.citizenName,
      a.citizenMobile,
      a.serviceName,
      a.status,
      a.createdAt.split('T')[0]
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SevaDesk_Report_${currentKendra.code}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
            {language === 'bn' ? 'রিপোর্ট ও বিশ্লেষণ' : 'Analytics & Data Export'}
          </span>
          <h1 className="text-2xl font-black text-white">
            {language === 'bn' ? 'দৈনিক প্রতিবেদন ও এক্সপোর্ট' : 'Performance Analytics'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn' ? 'সমগ্র কেন্দ্রের দৈনিক পরিসংখ্যান ও সিএসভি এক্সপোর্ট।' : 'Export official CSV audits for district administration.'}
          </p>
        </div>

        <button 
          onClick={exportApplicationsCSV}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{t.dash_btn_exportReports}</span>
        </button>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest block mb-1">Total Applications</span>
          <span className="text-3xl font-mono font-black text-indigo-400">{apps.length}</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest block mb-1">Registered Citizens</span>
          <span className="text-3xl font-mono font-black text-white">{citizens.length}</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest block mb-1">Completed Issued</span>
          <span className="text-3xl font-mono font-black text-emerald-400">{apps.filter(a => a.status === 'COMPLETED').length}</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest block mb-1">Total Cash Collection</span>
          <span className="text-3xl font-mono font-black text-amber-400">₹{payments.reduce((a, b) => a + b.total, 0)}</span>
        </div>
      </div>

    </div>
  );
};
