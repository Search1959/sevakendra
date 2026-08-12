import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Ticket, 
  Calendar, 
  IndianRupee, 
  MessageSquare, 
  Building2, 
  Search, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Smartphone,
  ShieldCheck,
  UserCog,
  KeyRound
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SystemUser } from '../types';

interface SidebarProps {
  language: Language;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile?: () => void;
  currentUser?: SystemUser;
}

export const Sidebar: React.FC<SidebarProps> = ({
  language,
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  currentUser
}) => {
  const t = translations[language];

  const menuGroups = [
    {
      title: language === 'bn' ? 'প্রধান সেবা' : language === 'hi' ? 'मुख्य सेवाएं' : 'Core Services',
      items: [
        { id: 'DASHBOARD', label: t.nav_dashboard, icon: LayoutDashboard },
        { id: 'CITIZENS', label: t.nav_citizens, icon: Users },
        { id: 'SERVICES', label: t.nav_services, icon: BookOpen },
        { id: 'SCHEMES', label: t.nav_schemes, icon: Sparkles, badge: 'Finder' },
        { id: 'APPLICATIONS', label: t.nav_applications, icon: FileText }
      ]
    },
    {
      title: language === 'bn' ? 'অপারেটিং ডেস্ক' : language === 'hi' ? 'ऑपरेटिंग डेस्क' : 'Operations',
      items: [
        { id: 'TOKEN_QUEUE', label: t.nav_tokens, icon: Ticket, badge: 'Live' },
        { id: 'APPOINTMENTS', label: t.nav_appointments, icon: Calendar },
        { id: 'PAYMENTS', label: t.nav_payments, icon: IndianRupee },
        { id: 'NOTIFICATIONS', label: t.nav_notifications, icon: MessageSquare }
      ]
    },
    {
      title: language === 'bn' ? 'ম্যানেজমেন্ট' : language === 'hi' ? 'प्रबंधन एवं सार्वजनिक' : 'Management & Public',
      items: [
        { id: 'KENDRAS', label: t.nav_kendras, icon: Building2 },
        { id: 'PUBLIC_TRACK', label: t.nav_public_track, icon: Search },
        { id: 'CITIZEN_MOBILE', label: language === 'bn' ? 'নাগরিক অ্যাপ ভিউ' : language === 'hi' ? 'नागरिक ऐप व्यू' : 'Citizen Mobile App', icon: Smartphone },
        { id: 'REPORTS', label: t.nav_reports, icon: BarChart3 }
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed md:sticky top-16 left-0 z-40
        w-64 h-[calc(100vh-4rem)]
        bg-white border-r border-slate-200/90
        flex flex-col justify-between p-3.5 overflow-y-auto
        transition-transform duration-300 ease-in-out shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-5">
          {/* SYSTEM ADMIN EXCLUSIVE MENU ITEM - Only visible for SUPER_ADMIN */}
          {currentUser?.role === 'SUPER_ADMIN' && (
            <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-2.5 shadow-xs">
              <div className="text-[10px] font-black text-orange-800 uppercase tracking-[0.2em] px-2 mb-2 flex items-center justify-between">
                <span>{language === 'bn' ? 'অ্যাডমিন ডেস্ক' : language === 'hi' ? 'सिस्टम एडमिन' : 'System Admin Panel'}</span>
                <span className="bg-orange-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-black shadow-xs">
                  EXCLUSIVE
                </span>
              </div>
              <button
                onClick={() => handleItemClick('ADMIN_USER_MANAGEMENT')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs font-black ${
                  activeTab === 'ADMIN_USER_MANAGEMENT'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-white text-orange-950 hover:bg-orange-100/80 border border-orange-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCog className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="truncate">
                    {language === 'bn' ? 'ইউজার অ্যাকাউন্ট কন্ট্রোল' : language === 'hi' ? 'खाता एवं क्रेडेंशियल' : 'User Accounts & Passwords'}
                  </span>
                </div>
                <KeyRound className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              </button>
            </div>
          )}

          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all text-xs ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black shadow-md shadow-orange-500/20'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-700'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive 
                            ? 'bg-white/25 text-white' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Info Card */}
        <div className="mt-5 pt-3 border-t border-slate-200">
          <div className="bg-gradient-to-br from-blue-50 to-orange-50/50 border border-blue-200/80 rounded-2xl p-3 text-center shadow-xs">
            <span className="text-[10px] text-blue-900 font-extrabold uppercase tracking-widest block mb-1">
              SEVA DESK • CIVIC OS v2.6
            </span>
            <p className="text-[11px] text-slate-700 font-bold leading-snug">
              {language === 'bn' ? 'স্বতন্ত্র নাগরিক সহায়তা পোর্টাল' : language === 'hi' ? 'नागरिक सहायता सेवा प्रणाली' : 'Citizen Assistance Operating System'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
