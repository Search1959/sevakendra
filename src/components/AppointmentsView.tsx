import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  CheckCircle2, 
  X, 
  Phone,
  Search
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaKendra, AppointmentSlot } from '../types';
import { storage } from '../services/storage';

interface AppointmentsViewProps {
  language: Language;
  currentKendra: SevaKendra;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  language,
  currentKendra
}) => {
  const t = translations[language];
  const [appointments, setAppointments] = useState<AppointmentSlot[]>(storage.getAppointments());
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [citizenName, setCitizenName] = useState('');
  const [citizenMobile, setCitizenMobile] = useState('');
  const [serviceName, setServiceName] = useState('Swasthya Sathi Card Renewal');
  const [date, setDate] = useState('2026-08-15');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 11:30 AM');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt: AppointmentSlot = {
      id: `appt-${Date.now()}`,
      citizenName: citizenName || 'Walk-in Citizen',
      citizenMobile: citizenMobile || '9830000000',
      serviceName,
      date,
      timeSlot,
      kendraId: currentKendra.id,
      status: 'CONFIRMED'
    };

    storage.saveAppointment(newAppt);
    setAppointments(storage.getAppointments());
    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
            {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুকিং' : 'Prior Appointment Slots'}
          </span>
          <h1 className="text-2xl font-black text-white">
            {language === 'bn' ? 'আগাম সময়সূচী বুকিং' : 'Appointment Calendar'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn' ? 'ভিড় এড়াতে নাগরিকরা তাদের সুবিধাজনক সময়ে অ্যাপয়েন্টমেন্ট বুক করতে পারেন।' : 'Pre-book time slots to eliminate long waiting lines.'}
          </p>
        </div>

        <button 
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.dash_btn_scheduleAppointment}</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {appointments.map((appt) => (
          <div key={appt.id} className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800">
                  {appt.timeSlot}
                </span>
                <h3 className="font-bold text-white text-base mt-2">{appt.citizenName}</h3>
                <span className="text-xs text-neutral-400 block">{appt.citizenMobile}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {appt.status}
              </span>
            </div>

            <div className="p-3 bg-neutral-800/40 rounded-xl text-xs space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold block uppercase">Service</span>
              <span className="text-neutral-200 font-bold">{appt.serviceName}</span>
              <span className="text-[10px] text-neutral-400 block font-mono">Date: {appt.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Schedule Appointment</h3>
              <button onClick={() => setShowScheduleModal(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4 text-xs">
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
                <label className="block text-neutral-400 font-bold mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  value={citizenMobile} 
                  onChange={(e) => setCitizenMobile(e.target.value)} 
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white" 
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Service</label>
                <input 
                  type="text" 
                  value={serviceName} 
                  onChange={(e) => setServiceName(e.target.value)} 
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Time Slot</label>
                  <select 
                    value={timeSlot} 
                    onChange={(e) => setTimeSlot(e.target.value)} 
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                    <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-neutral-800 text-neutral-300 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
