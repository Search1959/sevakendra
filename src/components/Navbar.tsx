import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Globe, 
  ChevronDown,
  Wifi, 
  WifiOff, 
  Download, 
  UserCheck, 
  Bell, 
  ShieldCheck, 
  Menu,
  X,
  Sparkles,
  Home,
  LogOut
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaKendra, SystemUser, Role } from '../types';
import { storage } from '../services/storage';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentKendra: SevaKendra;
  onKendraChange: (kendra: SevaKendra) => void;
  currentUser: SystemUser;
  onUserChange: (user: SystemUser) => void;
  onSearch: (query: string) => void;
  onOpenAiAssistant: () => void;
  onOpenCitizenMobile: () => void;
  onOpenPublicTrack: () => void;
  onGoToHome: () => void;
  isOnline: boolean;
  onToggleSidebar?: () => void;
  isReadOnly?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  currentKendra,
  onKendraChange,
  currentUser,
  onUserChange,
  onSearch,
  onOpenAiAssistant,
  onOpenCitizenMobile,
  onOpenPublicTrack,
  onGoToHome,
  isOnline,
  onToggleSidebar,
  isReadOnly = false
}) => {
  const t = translations[language];
  const kendras = storage.getKendras();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showKendraModal, setShowKendraModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleRoleSelect = (role: Role) => {
    const rolesMap: Record<Role, string> = {
      SUPER_ADMIN: 'System Admin (Super Admin)',
      DISTRICT_ADMIN: 'District Administrator',
      KENDRA_OWNER: 'Kendra Owner / Manager',
      OPERATOR: 'Rajesh Mukherjee (Staff Operator)',
      SUPERVISOR: 'Kendra Supervisor',
      CITIZEN: 'Citizen Portal Observer'
    };
    const updatedUser: SystemUser = {
      ...currentUser,
      role,
      name: rolesMap[role] || role
    };
    storage.setCurrentUser(updatedUser);
    onUserChange(updatedUser);
    setShowRoleModal(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Brand logo & Mobile menu trigger */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 cursor-pointer" onClick={onGoToHome} title="Go to Home / Marketing Landing Page">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
              S
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">
                SEVA DESK
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.15em] mt-1">
                {language === 'bn' ? 'ডিজিটাল সেবা ব্যবস্থা' : language === 'hi' ? 'डिजिटल सेवा प्रणाली' : 'Citizen Seva OS'}
              </span>
            </div>
          </div>

          {/* Home Button */}
          <button
            onClick={onGoToHome}
            className="hidden sm:flex items-center gap-1.5 ml-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full text-xs font-bold text-neutral-300 transition-colors"
            title="Return to Home Page"
          >
            <Home className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'bn' ? 'হোম পেজ' : language === 'hi' ? 'होम पेज' : 'Home'}</span>
          </button>

          {/* Current Kendra Badge */}
          <div 
            onClick={() => setShowKendraModal(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 rounded-full cursor-pointer transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-neutral-200 max-w-[180px] truncate">
              {currentKendra.name}
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
              {currentKendra.code}
            </span>
          </div>
        </div>

        {/* Middle: Search bar */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={t.searchPlaceholder}
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-500"
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Offline/Online Status Pill */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            isOnline 
              ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400' 
              : 'bg-amber-950/60 border-amber-800/60 text-amber-400 animate-pulse'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
            <span className="hidden md:inline">
              {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
            </span>
          </div>

          {/* AI Assistant Button */}
          <button 
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Seva AI</span>
          </button>

          {/* Language Dropdown Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-indigo-400 absolute left-3 pointer-events-none z-10" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded-full pl-8 pr-7 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none transition-colors shadow-sm"
              title="Select Language / भाषा चुनें / ভাষা নির্বাচন করুন"
            >
              <option value="en" className="bg-neutral-900 text-neutral-200 font-sans">English</option>
              <option value="hi" className="bg-neutral-900 text-neutral-200 font-sans">हिंदी (Hindi)</option>
              <option value="bn" className="bg-neutral-900 text-neutral-200 font-sans">বাংলা (Bengali)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2.5 pointer-events-none z-10" />
          </div>

          {/* Public Track Link */}
          <button
            onClick={onOpenPublicTrack}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-full text-xs font-bold transition-colors"
          >
            <span>{t.nav_public_track}</span>
          </button>

          {/* Role Switcher Pill */}
          <button 
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-2 pl-2.5 pr-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full text-xs font-medium text-neutral-200 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
              {(currentUser?.role || 'OPERATOR').substring(0, 2)}
            </div>
            <span className="hidden sm:inline font-semibold">
              {currentUser?.role || 'OPERATOR'}
            </span>
          </button>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Switch Role / Demo View</h3>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 mb-6">
              Select a role to test role-based permissions and interface views across the Seva Desk hierarchy.
            </p>
            
            <div className="space-y-2">
              {(['SUPER_ADMIN', 'DISTRICT_ADMIN', 'KENDRA_OWNER', 'OPERATOR', 'SUPERVISOR', 'CITIZEN'] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                    currentUser?.role === role 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold' 
                      : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-sm">
                    {t[`role_${role}` as keyof typeof t] || role}
                  </span>
                  {currentUser?.role === role && (
                    <span className="text-xs text-indigo-400 font-mono">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kendra Selection Modal */}
      {showKendraModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Select Active Seva Kendra</h3>
              </div>
              <button 
                onClick={() => setShowKendraModal(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {kendras.map((k) => (
                <div
                  key={k.id}
                  onClick={() => {
                    onKendraChange(k);
                    storage.setCurrentKendra(k);
                    setShowKendraModal(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    currentKendra.id === k.id
                      ? 'bg-indigo-950/50 border-indigo-500 text-white'
                      : 'bg-neutral-800/50 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">{k.name}</span>
                    <span className="text-[10px] bg-neutral-800 text-indigo-300 px-2 py-0.5 rounded-full border border-neutral-700 font-mono">
                      {k.code}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">{k.address}</p>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{k.districtName} • {k.wardName}</span>
                    <span>Operators: {k.operatorsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
