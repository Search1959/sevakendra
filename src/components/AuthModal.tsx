import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  User, 
  Building2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  X, 
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Role, SystemUser } from '../types';
import { Language, translations } from '../i18n/translations';

interface AuthModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: SystemUser, isReadOnly: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  language,
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const t = translations[language];
  const [selectedRole, setSelectedRole] = useState<Role>('OPERATOR');
  const [email, setEmail] = useState('operator.central@sevadesk.gov.in');
  const [password, setPassword] = useState('Seva@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const demoAccounts = [
    {
      role: 'SUPER_ADMIN' as Role,
      title: language === 'bn' ? 'সিস্টেম অ্যাডমিন (System Admin)' : language === 'hi' ? 'सिस्टम एडमिन (Super Admin)' : 'System Admin (Super Admin)',
      email: 'admin@sevadesk.gov.in',
      desc: language === 'bn' ? 'সমগ্র রাজ্য ও কেন্দ্র নিয়ন্ত্রণ' : language === 'hi' ? 'पूरा राज्य एवं सिस्टम नियंत्रण' : 'Full system & multi-district access',
      badgeBg: 'bg-rose-950/80 border-rose-800 text-rose-300'
    },
    {
      role: 'DISTRICT_ADMIN' as Role,
      title: language === 'bn' ? 'জেলা অ্যাডমিন (District Admin)' : language === 'hi' ? 'जिला एडमिन (District Admin)' : 'District Admin',
      email: 'district.kolkata@sevadesk.gov.in',
      desc: language === 'bn' ? 'জেলা ভিত্তিক সেবা নজরদারি' : language === 'hi' ? 'जिला स्तर निगरानी एवं रिपोर्ट' : 'District monitoring & reports',
      badgeBg: 'bg-amber-950/80 border-amber-800 text-amber-300'
    },
    {
      role: 'KENDRA_OWNER' as Role,
      title: language === 'bn' ? 'কেন্দ্র ইন-চার্জ (Kendra In-Charge)' : language === 'hi' ? 'केंद्र प्रबंधक (Kendra In-Charge)' : 'Kendra Manager / Owner',
      email: 'owner.central@sevadesk.gov.in',
      desc: language === 'bn' ? 'ওয়ার্ড ও কেন্দ্র অপারেটর ব্যবস্থাপনা' : language === 'hi' ? 'वार्ड एवं ऑपरेटर प्रबंधन' : 'Ward & Kendra operator management',
      badgeBg: 'bg-purple-950/80 border-purple-800 text-purple-300'
    },
    {
      role: 'OPERATOR' as Role,
      title: language === 'bn' ? 'স্টাফ / অপারেটর (Staff Operator)' : language === 'hi' ? 'स्टॉफ / ऑपरेटर (Staff Operator)' : 'Staff Operator / Desk Executive',
      email: 'operator.central@sevadesk.gov.in',
      desc: language === 'bn' ? 'নাগরিক নিবন্ধন ও আবেদন প্রসেস' : language === 'hi' ? 'नागरिक पंजीकरण एवं आवेदन प्रक्रिया' : 'Citizen registration & application handling',
      badgeBg: 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
    }
  ];

  const handleQuickSelectRole = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword('Seva@2026!');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(language === 'bn' ? 'ইমেইল ও পাসওয়ার্ড প্রদান করুন' : language === 'hi' ? 'कृपया ईमेल और पासवर्ड दर्ज करें' : 'Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      setIsSubmitting(false);
      const user: SystemUser = {
        id: `usr-${Date.now()}`,
        name: selectedRole === 'SUPER_ADMIN' ? 'Vikramaditya Roy (System Admin)' 
            : selectedRole === 'DISTRICT_ADMIN' ? 'Ananya Sen (District Admin)'
            : selectedRole === 'KENDRA_OWNER' ? 'Subhasish Sen (Kendra Manager)'
            : 'Rajesh Mukherjee (Staff Operator)',
        email: email,
        mobile: '+91 98310 12345',
        role: selectedRole,
        kendraId: 'kendra-1'
      };
      onLoginSuccess(user, false);
    }, 600);
  };

  const handleDemoGuestLogin = () => {
    const guestUser: SystemUser = {
      id: 'usr-guest-demo',
      name: 'Guest Observer (Demo Mode)',
      email: 'guest.demo@sevadesk.gov.in',
      mobile: '+91 90000 00000',
      role: 'CITIZEN',
      kendraId: 'kendra-1'
    };
    onLoginSuccess(guestUser, true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] w-full max-w-xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block">
              SEVA DESK AUTHENTICATION
            </span>
            <h2 className="text-2xl font-black text-white">
              {language === 'bn' ? 'অপারেটর ও সিস্টেম লগইন' : language === 'hi' ? 'ऑपरेटर एवं एडमिन लॉगिन' : 'Operator & Admin Login'}
            </h2>
          </div>
        </div>

        {/* Quick Credentials / Role Selector Chips */}
        <div className="mb-6">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
            {language === 'bn' ? 'দ্রুত ডেমো রোল টেস্ট নির্বাচন করুন:' : language === 'hi' ? 'त्वरित रोल चुनें (डेमो एक्सेस):' : 'Select Role to Autofill Credentials:'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => {
              const isSelected = selectedRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickSelectRole(acc)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500/50' 
                      : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{acc.title.split(' ')[0]} {acc.title.split(' ')[1]}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono truncate">{acc.email}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1">
              {language === 'bn' ? 'অফিসিয়াল ইমেইল আইডি' : language === 'hi' ? 'आधिकारिक ईमेल आईडी' : 'Official Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@sevadesk.gov.in"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড' : language === 'hi' ? 'पासवर्ड' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <span className="text-xs">Connecting & Verifying Credentials...</span>
              ) : (
                <>
                  <span>
                    {language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : language === 'hi' ? 'डैशबोर्ड में प्रवेश करें' : 'Sign In to Seva Desk'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Read-Only Demo Option */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                {language === 'bn' ? 'অথবা পাসওয়ার্ড ছাড়া দেখুন' : language === 'hi' ? 'या बिना पासवर्ड देखें' : 'OR VISIT WITHOUT LOGIN'}
              </span>
              <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoGuestLogin}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-800/60 font-bold text-xs py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>
                {language === 'bn' 
                  ? '👁️ কোনো পাসওয়ার্ড ছাড়াই লাইভ ডেমো ড্যাশবোর্ড দেখুন (Read-Only Mode)' 
                  : language === 'hi' 
                  ? '👁️ लाइव डेमो देखें (Read-Only Mode)' 
                  : '👁️ Explore Live Demo Dashboard (Read-Only Mode)'}
              </span>
            </button>
          </div>

        </form>

        <p className="text-[11px] text-neutral-500 text-center mt-6">
          🔒 Encrypted 256-bit Session Token • Seva Desk System Administration
        </p>

      </div>
    </div>
  );
};
