import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CitizensView } from './components/CitizensView';
import { ServicesView } from './components/ServicesView';
import { SchemeFinderView } from './components/SchemeFinderView';
import { ApplicationsView } from './components/ApplicationsView';
import { TokenQueueView } from './components/TokenQueueView';
import { AppointmentsView } from './components/AppointmentsView';
import { PaymentsView } from './components/PaymentsView';
import { NotificationsView } from './components/NotificationsView';
import { KendrasView } from './components/KendrasView';
import { PublicTrackView } from './components/PublicTrackView';
import { CitizenMobileApp } from './components/CitizenMobileApp';
import { ReportsView } from './components/ReportsView';
import { AdminUserManagementView } from './components/AdminUserManagementView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';

import { ActiveView, SevaKendra, Citizen, ServiceItem, GovernmentScheme, SystemUser } from './types';
import { Language, translations } from './i18n/translations';
import { storage } from './services/storage';
import { Eye, Lock, ArrowRight, Home, Sparkles } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const [activeView, setActiveView] = useState<ActiveView>('DASHBOARD');
  const [currentUser, setCurrentUser] = useState<SystemUser>(storage.getCurrentUser());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  
  const [kendras] = useState<SevaKendra[]>(storage.getKendras());
  const [currentKendra, setCurrentKendra] = useState<SevaKendra>(kendras[0] || {
    id: 'kendra-1',
    code: 'SK-KOL-001',
    name: 'Kolkata Central Seva Kendra',
    districtName: 'Kolkata',
    localBodyName: 'Kolkata Municipal Corporation',
    wardName: 'Ward No 45',
    pin: '700001',
    inChargeName: 'Subhasish Sen',
    contactPhone: '+91 98310 12345',
    contactEmail: 'central.kolkata@sevadesk.gov.in',
    status: 'ACTIVE',
    address: '12, B.B.D. Bagh East, Kolkata, West Bengal 700001',
    createdAt: new Date().toISOString()
  });

  const [showAiModal, setShowAiModal] = useState(false);

  const [, setSyncCounter] = useState<number>(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = storage.subscribe(() => {
      setSyncCounter(prev => prev + 1);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  // Contextual modal navigation states
  const [citizenRegInitialModal, setCitizenRegInitialModal] = useState(false);
  const [appNewInitialModal, setAppNewInitialModal] = useState(false);
  const [paymentCollectInitialModal, setPaymentCollectInitialModal] = useState(false);
  const [preselectedCitizen, setPreselectedCitizen] = useState<Citizen | null>(null);
  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);

  const handleLoginSuccess = (user: SystemUser, guestReadOnly: boolean) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
    setIsReadOnly(guestReadOnly);
    setIsAuthModalOpen(false);
    setIsLandingPage(false);
    setActiveView('DASHBOARD');
  };

  const handleOpenDemoGuest = () => {
    setIsReadOnly(true);
    setIsLandingPage(false);
    setActiveView('DASHBOARD');
  };

  // If on Landing / Marketing Home Page
  if (isLandingPage) {
    return (
      <>
        <LandingPage 
          language={language}
          onLanguageChange={setLanguage}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onOpenDemoGuest={handleOpenDemoGuest}
          onOpenTrack={() => {
            setIsLandingPage(false);
            setActiveView('PUBLIC_TRACK');
          }}
          onOpenMobileApp={() => {
            setIsLandingPage(false);
            setActiveView('CITIZEN_MOBILE');
          }}
        />

        <AuthModal 
          language={language}
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // If viewing standalone public tracking portal (/track route simulation)
  if (activeView === 'PUBLIC_TRACK') {
    return (
      <PublicTrackView 
        language={language} 
        onBackToPortal={() => {
          setIsLandingPage(true);
        }} 
      />
    );
  }

  return (
    <div className="h-screen w-full bg-slate-100 text-slate-900 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Read-Only Banner when exploring via Demo Mode */}
      {isReadOnly && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between gap-4 z-40 shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-200 shrink-0" />
            <span>
              {language === 'bn' 
                ? '👁️ আপনি গেস্ট রিড-ওনলি ডেমো মোডে আছেন। যেকোনো পরিবর্তন কেবল পরীক্ষার জন্য।' 
                : language === 'hi'
                ? '👁️ आप गेस्ट केवल-पढ़ने योग्य डेमो मोड में हैं। परिवर्तन केवल परीक्षण के लिए हैं।'
                : '👁️ Live Demo Mode (Read-Only) — You are exploring Seva Desk in Guest Read-Only mode. Modifications are simulated.'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-950 text-white px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 border border-blue-700"
            >
              <Lock className="w-3 h-3" />
              <span>Operator Login</span>
            </button>
            <button
              onClick={() => setIsLandingPage(true)}
              className="bg-white hover:bg-orange-50 text-orange-950 px-3 py-1 rounded-full text-[11px] font-bold transition-all border border-orange-300"
            >
              Home Page
            </button>
          </div>
        </div>
      )}

      {/* Fixed Top Navbar */}
      <Navbar 
        language={language}
        onLanguageChange={setLanguage}
        currentKendra={currentKendra}
        onKendraChange={setCurrentKendra}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onSearch={() => {}}
        onOpenAiAssistant={() => setShowAiModal(true)}
        onOpenCitizenMobile={() => setActiveView('CITIZEN_MOBILE')}
        onOpenPublicTrack={() => setActiveView('PUBLIC_TRACK')}
        onGoToHome={() => setIsLandingPage(true)}
        isOnline={isOnline}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        isReadOnly={isReadOnly}
      />

      {/* Main Content Layout with Fixed Left Sidebar & Scrollable Main Stage */}
      <div className="flex-1 flex overflow-hidden p-3 sm:p-5 gap-4 sm:gap-5">
        
        {/* Left Bento Sidebar Navigation */}
        <Sidebar 
          language={language}
          activeTab={activeView}
          onSelectTab={(tab) => {
            setCitizenRegInitialModal(false);
            setAppNewInitialModal(false);
            setPaymentCollectInitialModal(false);
            setActiveView(tab as ActiveView);
          }}
          isOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          currentUser={currentUser}
        />

        {/* Center Stage Workspace Canvas */}
        <main className="flex-1 bg-white/95 border border-slate-200/90 rounded-[2.5rem] p-5 sm:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 shadow-xl shadow-slate-200/50">
          
          {activeView === 'DASHBOARD' && (
            <Dashboard 
              language={language}
              currentKendra={currentKendra}
              onNavigate={(view) => setActiveView(view as ActiveView)}
              onOpenNewCitizen={() => {
                setCitizenRegInitialModal(true);
                setActiveView('CITIZENS');
              }}
              onOpenNewApplication={() => {
                setAppNewInitialModal(true);
                setActiveView('APPLICATIONS');
              }}
              onOpenNewToken={() => {
                setActiveView('TOKEN_QUEUE');
              }}
              onOpenCollectPayment={() => {
                setPaymentCollectInitialModal(true);
                setActiveView('PAYMENTS');
              }}
            />
          )}

          {activeView === 'CITIZENS' && (
            <CitizensView 
              language={language}
              currentKendra={currentKendra}
              initialShowRegister={citizenRegInitialModal}
              onSelectCitizenForApp={(citizen) => {
                setPreselectedCitizen(citizen);
                setAppNewInitialModal(true);
                setActiveView('APPLICATIONS');
              }}
            />
          )}

          {activeView === 'SERVICES' && (
            <ServicesView 
              language={language}
              onSelectServiceForApp={(service) => {
                setPreselectedService(service);
                setAppNewInitialModal(true);
                setActiveView('APPLICATIONS');
              }}
            />
          )}

          {activeView === 'SCHEMES' && (
            <SchemeFinderView 
              language={language}
              onApplyForScheme={(scheme) => {
                setAppNewInitialModal(true);
                setActiveView('APPLICATIONS');
              }}
            />
          )}

          {activeView === 'APPLICATIONS' && (
            <ApplicationsView 
              language={language}
              currentKendra={currentKendra}
              initialNewApp={appNewInitialModal}
              preselectedCitizen={preselectedCitizen}
              preselectedService={preselectedService}
            />
          )}

          {activeView === 'TOKEN_QUEUE' && (
            <TokenQueueView 
              language={language}
              currentKendra={currentKendra}
            />
          )}

          {activeView === 'APPOINTMENTS' && (
            <AppointmentsView 
              language={language}
              currentKendra={currentKendra}
            />
          )}

          {activeView === 'PAYMENTS' && (
            <PaymentsView 
              language={language}
              currentKendra={currentKendra}
              initialShowCollect={paymentCollectInitialModal}
            />
          )}

          {activeView === 'NOTIFICATIONS' && (
            <NotificationsView 
              language={language}
              currentKendra={currentKendra}
            />
          )}

          {activeView === 'KENDRAS' && (
            <KendrasView 
              language={language}
              currentKendra={currentKendra}
              onSelectKendra={setCurrentKendra}
              isReadOnly={isReadOnly}
            />
          )}

          {activeView === 'CITIZEN_MOBILE' && (
            <CitizenMobileApp 
              language={language}
              currentKendra={currentKendra}
            />
          )}

          {activeView === 'REPORTS' && (
            <ReportsView 
              language={language}
              currentKendra={currentKendra}
            />
          )}

          {activeView === 'ADMIN_USER_MANAGEMENT' && (
            <AdminUserManagementView 
              language={language}
              currentKendra={currentKendra}
            />
          )}

        </main>

      </div>

      {/* Floating Gemini AI Assistant Chat Modal */}
      <AiAssistantModal 
        language={language}
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />

      {/* Operator Auth Login Modal */}
      <AuthModal 
        language={language}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
