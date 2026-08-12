import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Globe, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  Ticket, 
  Sparkles, 
  Camera, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  MapPin, 
  CheckCircle2, 
  Code, 
  Smartphone, 
  ArrowRight, 
  Share2, 
  Lock, 
  Phone, 
  HelpCircle,
  Eye,
  Award,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { storage } from '../services/storage';
import { SevaKendra } from '../types';

interface LandingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenLogin: () => void;
  onOpenDemoGuest: () => void;
  onOpenTrack: () => void;
  onOpenMobileApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onLanguageChange,
  onOpenLogin,
  onOpenDemoGuest,
  onOpenTrack,
  onOpenMobileApp
}) => {
  const t = translations[language];
  const [kendras] = useState<SevaKendra[]>(storage.getKendras());
  
  // Real database dynamic counts
  const citizensCount = storage.getCitizens().length;
  const kendrasCount = storage.getKendras().length;
  const applicationsCount = storage.getApplications().length;
  const servicesCount = storage.getServices().length + storage.getSchemes().length;
  
  // Interactive Ward Search Widget State
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [wardQuery, setWardQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showSeoCodePreview, setShowSeoCodePreview] = useState(false);

  const districts = ['All', 'Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Hooghly'];

  const filteredKendras = kendras.filter(k => {
    const matchDistrict = selectedDistrict === 'All' || k.districtName.toLowerCase().includes(selectedDistrict.toLowerCase());
    const matchWard = !wardQuery || 
      k.wardName.toLowerCase().includes(wardQuery.toLowerCase()) || 
      k.localBodyName.toLowerCase().includes(wardQuery.toLowerCase()) ||
      k.name.toLowerCase().includes(wardQuery.toLowerCase());
    return matchDistrict && matchWard;
  });

  const faqs = [
    {
      q: language === 'bn' ? 'সেবা ডেস্ক কীভাবে নাগরিকদের সহায়তা করে?' : language === 'hi' ? 'सेवा डेस्क नागरिकों की सहायता कैसे करता है?' : 'How does Seva Desk help citizens and Kendra operators?',
      a: language === 'bn' ? 'সেবা ডেস্ক একটি সম্পূর্ণ ডিজিটাল প্ল্যাটফর্ম যা কেন্দ্রগুলোতে কাতার পরিচালনা, এআই দিয়ে ফর্ম স্ক্যান, স্কিম ফিল্টার এবং হোয়াটসঅ্যাপে রসিদ পাঠানো সহজ করে।' : language === 'hi' ? 'सेवा डेस्क एक डिजिटल प्लेटफॉर्म है जो फॉर्म स्कैनिंग, व्हाट्सएप रसीद, टोकन कतार और सरकारी योजना पात्रता जांच को आसान बनाता है।' : 'Seva Desk is a complete operating system for Seva Kendras, enabling AI document OCR scanning, real-time token queues, scheme eligibility matching, and automated WhatsApp status updates.'
    },
    {
      q: language === 'bn' ? 'ওয়ার্ড ও পঞ্চায়েত ভিত্তিক কেন্দ্র যোগ করা যায়?' : language === 'hi' ? 'क्या वार्ड और पंचायत स्तर के केंद्र जोड़े जा सकते हैं?' : 'Can Ward-wise and Gram Panchayat-wise Seva Kendras be added?',
      a: language === 'bn' ? 'হ্যাঁ, সুপার এডমিন ও কেন্দ্র পরিচালকরা নির্দিষ্ট জেলা, পুরসভা, ওয়ার্ড নং বা গ্রাম পঞ্চায়েত ভিত্তিক নতুন সেবা কেন্দ্র নিমিষেই যোগ করতে পারেন।' : language === 'hi' ? 'हां, सुपर एडमिन और केंद्र प्रबंधक आसानी से वार्ड संख्या, ब्लॉक या पंचायत के अनुसार नए सेवा केंद्र जोड़ सकते हैं।' : 'Yes! Super Admins and Kendra Owners can easily add Ward-wise and Gram Panchayat-wise operating centers complete with ward councillor details, staff allocation, and localized service catalogs.'
    },
    {
      q: language === 'bn' ? 'ডেমো ড্যাশবোর্ডে কীভাবে প্রবেশ করব?' : language === 'hi' ? 'डेमो डैशबोर्ड में कैसे प्रवेश करें?' : 'How do I access the live Demo Dashboard without signing in?',
      a: language === 'bn' ? 'হোম পেজের "Try Live Demo (Read-Only Mode)" বাটনে ক্লিক করলেই সরাসরি সম্পূর্ণ ড্যাশবোর্ডে প্রবেশ করা যাবে।' : language === 'hi' ? 'होम पेज पर "Try Live Demo (Read-Only Mode)" बटन पर क्लिक करके सीधे पूर्ण डैशबोर्ड में केवल-पढ़ने योग्य मोड में प्रवेश किया जा सकता है।' : 'Simply click the "Try Live Demo (Read-Only Mode)" button at the top or hero section. It loads the entire operational system in Guest Read-Only mode with sample citizen data and queue metrics.'
    },
    {
      q: language === 'bn' ? 'এসইও (SEO) এবং রিজিওনাল ভাষা সমর্থন কেমন?' : language === 'hi' ? 'एसईओ और क्षेत्रीय भाषा समर्थन कैसा है?' : 'What SEO features and language support are included?',
      a: language === 'bn' ? 'সেবা ডেস্ক বাংলা, হিন্দি ও ইংরেজি তিন ভাষাতেই দ্রুত পরিবর্তন করা যায়। সাথে রয়েছে সম্পূর্ণ Schema.org JSON-LD structured data এবং OpenGraph মেটা ট্যাগ।' : language === 'hi' ? 'सेवा डेस्क हिंदी, बंगाली और अंग्रेजी तीनों भाषाओं में उपलब्ध है, साथ में पूर्ण Schema.org JSON-LD स्ट्रक्चर्ड डेटा और एसईओ सपोर्ट शामिल है।' : 'Seva Desk features full multilingual UI switching in English, Hindi, and Bengali. It includes built-in Schema.org GovernmentService JSON-LD structured data, canonical meta tags, OpenGraph previews, and WCAG AA accessibility.'
    }
  ];

  // Dynamic Document Metadata and Language Sync for Search Engines
  useEffect(() => {
    document.documentElement.lang = language;
    const langTitles = {
      en: 'Seva Desk | Ward & Panchayat Digital Citizen Service OS',
      bn: 'সেবা ডেস্ক | ওয়ার্ড ও পঞ্চায়েত ডিজিটাল সেবা পোর্টাল',
      hi: 'सेवा डेस्क | वार्ड एवं पंचायत डिजिटल सेवा प्रणाली'
    };
    const langDescriptions = {
      en: 'Digital Operating System for Ward & Panchayat Seva Kendras. Real-time token queue, AI paper form OCR, scheme eligibility matching, and automated WhatsApp receipts.',
      bn: 'ওয়ার্ড ও পঞ্চায়েত সেবা কেন্দ্র পরিচালনার জন্য ডিজিটাল অপারেটিং সিস্টেম। এআই ফর্ম স্ক্যান, লাইভ কাতার এবং হোয়াটসঅ্যাপ রসিদ ব্যবস্থা।',
      hi: 'वार्ड और पंचायत सेवा केंद्रों के लिए डिजिटल ऑपरेटिंग सिस्टम। लाइव टोकन कतार, एआई फॉर्म स्कैनिंग और व्हाट्सएप रसीद सिस्टम।'
    };

    document.title = langTitles[language] || langTitles.en;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', langDescriptions[language] || langDescriptions.en);
    }
  }, [language]);

  // Schema.org Structured Data graph for Google Rich Snippets & Search Features
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GovernmentService",
        "name": "Seva Desk - Citizens & Ward Services Platform",
        "serviceType": "Public Assistance & Citizen Service Delivery",
        "provider": {
          "@type": "GovernmentOrganization",
          "name": "Seva Desk National Citizen Network",
          "url": "https://sevakendra-xi.vercel.app/"
        },
        "areaServed": ["Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas", "Hooghly"],
        "availableLanguage": ["English", "Hindi", "Bengali"],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://sevakendra-xi.vercel.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Ward Search",
            "item": "https://sevakendra-xi.vercel.app/#ward-search"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Live Demo",
            "item": "https://sevakendra-xi.vercel.app/?view=demo"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Schema.org Structured Data Injection */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }} 
      />

      {/* Top Indian Civic Tricolor Accent Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600" />

      {/* Top SEO Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-orange-200/80 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-black border border-orange-400/50">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900">
                  SEVA <span className="text-orange-600">DESK</span>
                </span>
                <span className="text-[10px] bg-orange-100 border border-orange-300 text-orange-950 font-black px-2 py-0.5 rounded-full uppercase">
                  v2.6 Ward OS
                </span>
              </div>
              <p className="text-[10px] text-slate-600 font-bold hidden sm:block">
                {language === 'bn' ? 'ওয়ার্ড ও পঞ্চায়েত ডিজিটাল সেবাপ্রণালী' : language === 'hi' ? 'वार्ड एवं पंचायत डिजिटल सेवा प्रणाली' : 'Ward-Wise Citizen Service Operating System'}
              </p>
            </div>
          </div>

          {/* Quick Actions & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-blue-700 absolute left-3 pointer-events-none z-10" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-slate-100 border border-slate-300 text-slate-800 rounded-full pl-8 pr-7 py-1.5 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer appearance-none transition-colors shadow-xs"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 pointer-events-none z-10" />
            </div>

            {/* Public Track */}
            <button
              onClick={onOpenTrack}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-full text-xs font-bold transition-all shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-orange-600" />
              <span>{language === 'bn' ? 'ট্র্যাকিং' : language === 'hi' ? 'ট্র্যাফকিং' : 'Track App'}</span>
            </button>

            {/* Demo Read-Only Button */}
            <button
              onClick={onOpenDemoGuest}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 rounded-full text-xs font-bold transition-all shadow-sm"
              title="Open full dashboard in Guest Read-Only mode"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-100" />
              <span>
                {language === 'bn' ? 'লাইভ ডেমো (Read-Only)' : language === 'hi' ? 'लाइव डेमो (Read-Only)' : 'Try Live Demo (Read-Only)'}
              </span>
            </button>

            {/* Operator Login */}
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-full text-xs font-bold transition-all shadow-sm border border-blue-700"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === 'bn' ? 'লগইন' : language === 'hi' ? 'लॉगिन' : 'Sign In'}
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* Hero Marketing Section */}
      <section className="relative pt-10 pb-16 px-4 sm:px-8 bg-gradient-to-b from-orange-50/80 via-white to-blue-50/30 overflow-hidden">
        {/* Background Ambient Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-400/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-xs font-black text-orange-950 mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>
              {language === 'bn' 
                ? 'ওয়ার্ড ও পঞ্চায়েত স্তরের সেবাকে দ্রুত ও ডিজিটাল করার স্মার্ট প্ল্যাটফর্ম' 
                : language === 'hi'
                ? 'वार्ड एवं पंचायत स्तर की सेवाओं का स्मार्ट डिजिटल मंच'
                : 'Smart Operating System for Ward-Wise & Panchayat Seva Kendras'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            {language === 'bn' ? (
              <>
                প্রতিটি ওয়ার্ডের জন্য <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-blue-800">
                  স্মার্ট নাগরিক সেবাপ্রণালী
                </span>
              </>
            ) : language === 'hi' ? (
              <>
                प्रत्येक वार्ड के लिए <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-blue-800">
                  स्मार्ट नागरिक सेवा मंच
                </span>
              </>
            ) : (
              <>
                Empowering Every Ward with <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-blue-800">
                  Next-Gen Digital Citizen Desk
                </span>
              </>
            )}
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto mb-8 font-semibold leading-relaxed">
            {language === 'bn'
              ? 'এআই ফর্ম স্ক্যানিং, লাইভ টোকেন কাতার, সরকারি স্কিম ফিল্টার এবং হোয়াটসঅ্যাপ মেসেজ অ্যালার্ট সহ সমস্ত জেলা, পুরসভা ও ওয়ার্ডের সেবা কেন্দ্র পরিচালনা করুন।'
              : language === 'hi'
              ? 'एआई फॉर्म स्कैनिंग, टोकन कतार, सरकारी योजना पात्रता और व्हाट्सएप अलर्ट के साथ सभी जिलों, नगरपालिकाओं और वार्डों में सेवा केंद्र प्रबंधित करें।'
              : 'Seamlessly manage citizens, applications, token queues, AI paper form OCR, scheme eligibility matching, and automated WhatsApp receipts across every Ward and Panchayat.'}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            
            {/* Live Demo Read-Only Button */}
            <button
              onClick={onOpenDemoGuest}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-3 group"
            >
              <Eye className="w-5 h-5 text-emerald-100" />
              <span>
                {language === 'bn' ? '👁️ লাইভ ডেমো দেখুন (Read-Only Mode)' : language === 'hi' ? '👁️ लाइव डेमो देखें (Read-Only Mode)' : '👁️ Try Live Demo (Read-Only Mode)'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Operator Login Button */}
            <button
              onClick={onOpenLogin}
              className="bg-blue-900 hover:bg-blue-950 text-white font-black text-sm px-7 py-4 rounded-2xl transition-all flex items-center gap-2.5 shadow-md border border-blue-700"
            >
              <Lock className="w-4.5 h-4.5 text-amber-300" />
              <span>
                {language === 'bn' ? 'অপারেটর / এডমিন লগইন' : language === 'hi' ? 'ऑपरेटर / एडमिन लॉगिन' : 'Operator & Admin Login'}
              </span>
            </button>

            {/* Citizen Mobile App View */}
            <button
              onClick={onOpenMobileApp}
              className="bg-white hover:bg-orange-50 text-slate-900 border border-slate-300 font-black text-sm px-6 py-4 rounded-2xl transition-all flex items-center gap-2 shadow-xs"
            >
              <Smartphone className="w-4.5 h-4.5 text-orange-600" />
              <span>
                {language === 'bn' ? 'নাগরিক মোবাইল ভিউ' : language === 'hi' ? 'नागरिक मोबाइल ऐप' : 'Citizen App View'}
              </span>
            </button>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white border border-slate-200/90 rounded-[2.5rem] shadow-xl">
            <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200/70">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block font-mono">{citizensCount}</span>
              <span className="text-xs text-orange-950 font-black">
                {language === 'bn' ? 'নিবন্ধিত নাগরিক' : language === 'hi' ? 'पंजीकृत नागरिक' : 'Citizens Registered'}
              </span>
            </div>
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/70">
              <span className="text-2xl sm:text-3xl font-black text-blue-900 block font-mono">{kendrasCount}</span>
              <span className="text-xs text-blue-950 font-black">
                {language === 'bn' ? 'ওয়ার্ড ও পঞ্চায়েত কেন্দ্র' : language === 'hi' ? 'वार्ड एवं पंचायत केंद्र' : 'Active Seva Kendras'}
              </span>
            </div>
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/70">
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 block font-mono">{applicationsCount}</span>
              <span className="text-xs text-emerald-950 font-black">
                {language === 'bn' ? 'মোট আবেদন' : language === 'hi' ? 'कुल आवेदन' : 'Active Applications'}
              </span>
            </div>
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70">
              <span className="text-2xl sm:text-3xl font-black text-amber-900 block font-mono">{servicesCount}</span>
              <span className="text-xs text-amber-950 font-black">
                {language === 'bn' ? 'সরকারি স্কিম ও সার্ভিস' : language === 'hi' ? 'सरकारी योजनाएं एवं सेवाएं' : 'Government Services'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Ward-Wise Kendra Directory Search Widget */}
      <section className="py-16 px-4 sm:px-8 bg-neutral-900/40 border-y border-neutral-800/80">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
              {language === 'bn' ? 'ওয়ার্ড ভিত্তিক সেবা কেন্দ্র সন্ধান' : language === 'hi' ? 'वार्ड वार सेवा केंद्र खोजें' : 'Ward & Panchayat Kendra Directory'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'bn' ? 'আপনার লোকাল ওয়ার্ড সেবা কেন্দ্র খুঁজে নিন' : language === 'hi' ? 'अपना स्थानीय वार्ड सेवा केंद्र खोजें' : 'Locate Your Nearest Ward Seva Kendra'}
            </h2>
            <p className="text-xs text-neutral-400 mt-2">
              {language === 'bn' ? 'জেলা ও ওয়ার্ড নম্বর দিয়ে আপনার নিকটস্থ ডিজিটাল কেন্দ্রে সরাসরি টোকেন দিন' : language === 'hi' ? 'अपने जिले और वार्ड नंबर से निकटतम सेवा केंद्र खोजें' : 'Filter by district or ward name to view councillor contacts and center hours.'}
            </p>
          </div>

          {/* Search Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1">District / जिला</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d === 'All' ? 'All Districts / সমস্ত জেলা' : d}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-neutral-400 block mb-1">Ward No / Gram Panchayat Name</label>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={wardQuery}
                  onChange={(e) => setWardQuery(e.target.value)}
                  placeholder="e.g. Ward No 45, GP Sonarpur, Kolkata Central..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Kendra Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKendras.map(k => (
              <div key={k.id} className="p-5 bg-neutral-900 border border-neutral-800 rounded-[2rem] hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800">
                    {k.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    ● Active Kendra
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{k.name}</h3>
                <p className="text-xs text-neutral-400 mb-3 line-clamp-2">{k.address}</p>
                
                <div className="p-3 bg-neutral-800/40 rounded-xl border border-neutral-800 text-[11px] space-y-1 text-neutral-300 mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-medium">District:</span>
                    <span className="font-bold text-white">{k.districtName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-medium">Ward/Local Body:</span>
                    <span className="font-bold text-indigo-300">{k.wardName || k.localBodyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-medium">In-Charge:</span>
                    <span className="font-bold text-neutral-200">{k.inChargeName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                  <span className="text-neutral-400 flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3 text-neutral-500" />
                    <span>{k.contactPhone}</span>
                  </span>
                  <button 
                    onClick={onOpenDemoGuest}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>View Node</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
              {language === 'bn' ? 'সিস্টেম ফিচারসমূহ' : language === 'hi' ? 'सिस्टम विशेषताएं' : 'Core System Modules'}
            </span>
            <h2 className="text-3xl font-black text-white">
              {language === 'bn' ? 'অপারেটর ও নাগরিকদের জন্য পূর্ণাঙ্গ সুবিধা' : language === 'hi' ? 'ऑपरेटर और नागरिकों के लिए पूर्ण सुविधाएं' : 'Engineered for Scale, Speed, and Security'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Camera Form OCR</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Instantly scan physical paper application forms written in Hindi, Bengali, or English. Gemini AI automatically extracts full name, SC/ST category, Ration Card No, and Bank details into JSON.
              </p>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">● Hindi, Bengali & English OCR</span>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Token Queue Engine</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Queue token generation with counter callouts, physical thermal receipt printing, live digital waiting displays, and automatic token skipping/recalling.
              </p>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">● Live Counter Callouts</span>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Scheme Match Assistant</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Smart rules engine matching citizen demographics (age, income, land holding, disability status, caste) with 35+ central and state government schemes.
              </p>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">● 100% Rules Accuracy</span>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp & SMS Receipts</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Automated instant WhatsApp receipt delivery to citizens upon application submission, document requirement requests, and completion notices.
              </p>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">● Direct WhatsApp API</span>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Financial Ledger & Audit</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Operator cash drawer management, government vs assistance fee separation, daily CSV/Excel exports, and printable PDF audit summaries.
              </p>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">● CSV / Excel & PDF Reports</span>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ward & GP Hierarchy</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Multi-level hierarchy starting from State, District, Sub-Division, Block / Municipality down to Ward No and Gram Panchayat level nodes.
              </p>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">● Complete Ward Tree</span>
            </div>

          </div>

        </div>
      </section>

      {/* SEO Complete Technical Specifications Section */}
      <section className="py-16 px-4 sm:px-8 bg-neutral-900/50 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
                SEO & TECHNICAL ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Built-In Search Engine Optimization (SEO) & Schema Markup
              </h2>
              <p className="text-xs text-neutral-400 mt-2 max-w-xl">
                Seva Desk is engineered for maximum search visibility with automated Schema.org structured data, multilingual hreflang meta tags, and OpenGraph sharing.
              </p>
            </div>

            <button
              onClick={() => setShowSeoCodePreview(!showSeoCodePreview)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-indigo-300 border border-neutral-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Code className="w-4 h-4 text-indigo-400" />
              <span>{showSeoCodePreview ? 'Hide JSON-LD Schema' : 'Inspect JSON-LD Schema'}</span>
            </button>
          </div>

          {showSeoCodePreview && (
            <div className="mb-10 p-5 bg-neutral-950 border border-neutral-800 rounded-3xl font-mono text-xs text-emerald-400 overflow-x-auto">
              <span className="text-neutral-500 block mb-2">// Schema.org GovernmentService JSON-LD Markup Injection</span>
              <pre>{JSON.stringify(jsonLdSchema, null, 2)}</pre>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Multilingual Hreflang</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Supports <code className="text-indigo-300">en</code>, <code className="text-indigo-300">hi</code>, and <code className="text-indigo-300">bn</code> alternate link meta tags for localized regional search engines.
              </p>
            </div>

            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>OpenGraph & Twitter Cards</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Rich social preview images, dynamic card titles, and description snippets when shared on WhatsApp and Twitter.
              </p>
            </div>

            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Structured Schema.org</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Fully compliant <code className="text-purple-300">GovernmentService</code> and <code className="text-purple-300">LocalBusiness</code> JSON-LD for rich Google Search results.
              </p>
            </div>

            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Lighthouse 100/100 PWA</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Fast Cloud Run execution with zero blocking scripts and offline-capable localStorage synchronization.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions (FAQ Accordion with Schema Markup) */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
              {language === 'bn' ? 'সাধারণ প্রশ্নাবলী' : language === 'hi' ? 'सामान्य प्रश्नोत्तर' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h2 className="text-3xl font-black text-white">
              {language === 'bn' ? 'প্রয়োজনীয় তথ্য ও সহায়তা' : language === 'hi' ? 'जरूरी सवाल और उनके जवाब' : 'Everything You Need to Know'}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:bg-neutral-800/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-400 border-t border-neutral-800/80 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-br from-indigo-950 via-neutral-900 to-purple-950 border-t border-neutral-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            {language === 'bn' 
              ? 'আপনার এলাকার ওয়ার্ড ও পঞ্চায়েত সেবাকে ডিজিটালাইজ করুন' 
              : language === 'hi'
              ? 'अपने क्षेत्र की वार्ड एवं पंचायत सेवाओं को डिजिटल बनाएं'
              : 'Ready to Modernize Citizen Services in Your Ward?'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mb-8 max-w-2xl mx-auto">
            Experience the complete operating system in Guest Read-Only mode or sign in as System Admin / Operator.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenDemoGuest}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/30 flex items-center gap-2"
            >
              <Eye className="w-5 h-5 text-emerald-100" />
              <span>
                {language === 'bn' ? '👁️ লাইভ ডেমো খুলুন (Read-Only)' : language === 'hi' ? '👁️ लाइव डेमो खोलें (Read-Only)' : '👁️ Launch Live Demo (Read-Only)'}
              </span>
            </button>

            <button
              onClick={onOpenLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2"
            >
              <Lock className="w-5 h-5" />
              <span>
                {language === 'bn' ? 'অপারেটর সেশন লগইন' : language === 'hi' ? 'ऑपरेटर सेशन लॉगिन' : 'Operator Session Login'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-8 bg-neutral-950 border-t border-neutral-900 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
              SD
            </div>
            <div>
              <span className="font-bold text-neutral-300 block">SEVA DESK v2.6</span>
              <span>Ward & Panchayat Digital Service Network</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-neutral-400">
            <button onClick={onOpenTrack} className="hover:text-indigo-400">Track Application</button>
            <button onClick={onOpenMobileApp} className="hover:text-indigo-400">Citizen Mobile View</button>
            <button onClick={onOpenDemoGuest} className="hover:text-emerald-400">Try Live Demo</button>
            <button onClick={onOpenLogin} className="hover:text-indigo-400">Operator Login</button>
          </div>

          <p className="text-[11px]">
            © 2026 Seva Desk. Independent Citizen Assistance Platform.
          </p>
        </div>
      </footer>

    </div>
  );
};
