import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaKendra, WhatsAppNotification } from '../types';
import { storage } from '../services/storage';

interface NotificationsViewProps {
  language: Language;
  currentKendra: SevaKendra;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  language,
  currentKendra
}) => {
  const t = translations[language];
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>(storage.getNotifications());

  const [citizenMobile, setCitizenMobile] = useState('9830112233');
  const [citizenName, setCitizenName] = useState('Anjali Das');
  const [sevaId, setSevaId] = useState('SEVA-2026-000184');
  const [templateType, setTemplateType] = useState<'RECEIPT' | 'DOCS_REQUIRED' | 'COMPLETED' | 'TOKEN_CALL'>('DOCS_REQUIRED');
  const [customMsg, setCustomMsg] = useState('');

  const getTemplateText = () => {
    if (templateType === 'RECEIPT') {
      return `Namaste ${citizenName}, your application for Seva ID: ${sevaId} has been registered at ${currentKendra.name}. Track live status at https://sevadesk.in/track?id=${sevaId}`;
    } else if (templateType === 'DOCS_REQUIRED') {
      return `Namaste ${citizenName}, additional document (Aadhaar/Income Certificate) is required for Seva ID: ${sevaId}. Please visit ${currentKendra.name} before 4 PM today.`;
    } else if (templateType === 'COMPLETED') {
      return `Congratulations ${citizenName}! Your certificate/card for Seva ID: ${sevaId} is ready for collection at ${currentKendra.name}.`;
    } else {
      return `Namaste ${citizenName}, your turn (Token) at ${currentKendra.name} is arriving shortly. Please step inside.`;
    }
  };

  const messageText = customMsg || getTemplateText();

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const newNotif: WhatsAppNotification = {
      id: `notif-${Date.now()}`,
      citizenMobile,
      citizenName,
      sevaId,
      templateType,
      messageText,
      status: 'SENT',
      sentAt: new Date().toISOString()
    };

    storage.saveNotification(newNotif);
    setNotifications(storage.getNotifications());

    // Open WhatsApp Click-to-Chat in new tab
    const waUrl = `https://wa.me/91${citizenMobile}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 block mb-1">
          {language === 'bn' ? 'হোয়াটসঅ্যাপ মেসেজিং' : 'WhatsApp Citizen Notifications'}
        </span>
        <h1 className="text-2xl font-black text-white">
          {language === 'bn' ? 'নাগরিক বার্তা প্রেরক' : 'WhatsApp Alerts & Dispatch'}
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          {language === 'bn' 
            ? 'নাগরিকের মোবাইলে অ্যাপ দিয়ে সরাসরি হোয়াটসঅ্যাপ স্ট্যাটাস ও নথিপত্রের বার্তা পাঠান।'
            : 'Send instant status updates, missing document requests, and collection alerts via WhatsApp.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Send WhatsApp Form */}
        <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Send Instant WhatsApp Alert</span>
          </h3>

          <form onSubmit={handleSendWhatsApp} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-400 font-bold mb-1">Citizen Mobile Number *</label>
              <input 
                required
                type="tel"
                value={citizenMobile}
                onChange={(e) => setCitizenMobile(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Citizen Name</label>
                <input 
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-bold mb-1">SEVA ID</label>
                <input 
                  type="text"
                  value={sevaId}
                  onChange={(e) => setSevaId(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-bold mb-1">Select Notification Template</label>
              <select 
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as any)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
              >
                <option value="DOCS_REQUIRED">Document Required / Pending Alert</option>
                <option value="RECEIPT">New Application Registration Receipt</option>
                <option value="COMPLETED">Application Ready for Collection</option>
                <option value="TOKEN_CALL">Token Turn Arrival Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 font-bold mb-1">Message Preview</label>
              <textarea 
                rows={4}
                value={messageText}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-emerald-300 font-mono text-xs"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Open WhatsApp & Send Alert</span>
            </button>
          </form>
        </div>

        {/* Dispatch Log */}
        <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-4">Notification Dispatch History</h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 bg-neutral-800/40 rounded-2xl border border-neutral-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{notif.citizenName} ({notif.citizenMobile})</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{notif.status}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 font-mono">{notif.messageText}</p>
                  <span className="text-[9px] text-neutral-500 font-mono block pt-1">{notif.sentAt.replace('T', ' ').substring(0, 16)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
