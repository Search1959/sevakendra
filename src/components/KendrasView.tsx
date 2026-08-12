import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Users, 
  Search, 
  CheckCircle2, 
  Plus,
  X,
  PlusCircle,
  Pencil,
  Trash2,
  Mail,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaKendra } from '../types';
import { storage } from '../services/storage';

interface KendrasViewProps {
  language: Language;
  currentKendra: SevaKendra;
  onSelectKendra: (kendra: SevaKendra) => void;
  isReadOnly?: boolean;
}

export const KendrasView: React.FC<KendrasViewProps> = ({
  language,
  currentKendra,
  onSelectKendra,
  isReadOnly = false
}) => {
  const t = translations[language];
  const [kendras, setKendras] = useState<SevaKendra[]>(storage.getKendras());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKendra, setEditingKendra] = useState<SevaKendra | null>(null);

  // New Kendra Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    districtName: 'Kolkata',
    localBodyName: 'Kolkata Municipal Corporation',
    wardName: 'Ward No 45',
    inChargeName: '',
    contactPhone: '',
    email: '',
    address: '',
    pin: '700001',
    operatorsCount: 3,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  });

  const handleOpenAddModal = () => {
    setEditingKendra(null);
    setFormData({
      name: '',
      code: `SK-${Math.floor(100 + Math.random() * 900)}`,
      districtName: 'Kolkata',
      localBodyName: 'Kolkata Municipal Corporation',
      wardName: 'Ward No 45',
      inChargeName: '',
      contactPhone: '+91 ',
      email: '',
      address: '',
      pin: '700001',
      operatorsCount: 2,
      status: 'ACTIVE'
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (kendra: SevaKendra) => {
    setEditingKendra(kendra);
    setFormData({
      name: kendra.name,
      code: kendra.code,
      districtName: kendra.districtName || 'Kolkata',
      localBodyName: kendra.localBodyName || 'Municipality',
      wardName: kendra.wardName || 'Ward No 1',
      inChargeName: kendra.inChargeName || kendra.ownerName || '',
      contactPhone: kendra.contactPhone || kendra.contactMobile || '',
      email: kendra.email || '',
      address: kendra.address || '',
      pin: kendra.pin || '',
      operatorsCount: kendra.operatorsCount || 2,
      status: kendra.status || 'ACTIVE'
    });
    setShowAddModal(true);
  };

  const handleSaveKendra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.districtName.trim() || !formData.wardName.trim()) return;

    if (editingKendra) {
      const updatedList = kendras.map(k => k.id === editingKendra.id ? {
        ...k,
        name: formData.name,
        code: formData.code,
        districtName: formData.districtName,
        localBodyName: formData.localBodyName,
        wardName: formData.wardName,
        inChargeName: formData.inChargeName,
        ownerName: formData.inChargeName,
        contactPhone: formData.contactPhone,
        contactMobile: formData.contactPhone,
        email: formData.email,
        address: formData.address,
        pin: formData.pin,
        operatorsCount: Number(formData.operatorsCount),
        status: formData.status
      } : k);
      setKendras(updatedList);
      storage.saveKendras(updatedList);
    } else {
      const newKendra: SevaKendra = {
        id: `kendra-${Date.now()}`,
        code: formData.code || `SK-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        stateId: 'WB',
        stateName: 'West Bengal',
        districtId: formData.districtName.toLowerCase().replace(/\s+/g, '-'),
        districtName: formData.districtName,
        localBodyId: formData.localBodyName.toLowerCase().replace(/\s+/g, '-'),
        localBodyName: formData.localBodyName,
        wardId: formData.wardName.toLowerCase().replace(/\s+/g, '-'),
        wardName: formData.wardName,
        address: formData.address,
        pin: formData.pin,
        ownerName: formData.inChargeName,
        inChargeName: formData.inChargeName,
        contactPhone: formData.contactPhone,
        contactMobile: formData.contactPhone,
        whatsAppNumber: formData.contactPhone,
        email: formData.email,
        openingHours: '09:00 AM - 06:00 PM',
        status: formData.status,
        operatorsCount: Number(formData.operatorsCount),
        isPublic: true
      };
      const updatedList = [newKendra, ...kendras];
      setKendras(updatedList);
      storage.saveKendras(updatedList);
    }

    setShowAddModal(false);
  };

  const handleDeleteKendra = (id: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি এই ওয়ার্ড কেন্দ্রটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this Seva Kendra node?')) {
      const updatedList = kendras.filter(k => k.id !== id);
      setKendras(updatedList);
      storage.saveKendras(updatedList);
    }
  };

  const filtered = kendras.filter(k => 
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (k.wardName && k.wardName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (k.localBodyName && k.localBodyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Add Ward Kendra CTA */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
            {language === 'bn' ? 'ওয়ার্ড ও পঞ্চায়েত কেন্দ্র ডিরেক্টরি' : language === 'hi' ? 'वार्ड एवं पंचायत केंद्र निर्देशिका' : 'Ward & Panchayat Kendra Directory'}
          </span>
          <h1 className="text-2xl font-black text-white">
            {language === 'bn' ? 'জেলা ও ওয়ার্ড ভিত্তিক সেবা কেন্দ্রসমূহ' : language === 'hi' ? 'जिला एवं वार्ड वार सेवा केंद्र' : 'Ward-Wise Seva Kendras Network'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            {language === 'bn' ? 'পশ্চিমবঙ্গের বিভিন্ন জেলা, পুরসভা ও ওয়ার্ডে নিবন্ধিত সেবা কেন্দ্রসমূহ।' : language === 'hi' ? 'सभी जिलों, नगर पालिकाओं एवं वार्डों के पंजीकृत सेवा केंद्र।' : 'Directory of official Seva Kendra operating nodes with ward councillor details and staff allocation.'}
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={handleOpenAddModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === 'bn' ? '+ ওয়ার্ড কেন্দ্র যোগ করুন' : language === 'hi' ? '+ नया वार्ड केंद्र जोड़ें' : '+ Add Ward Seva Kendra'}
            </span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            language === 'bn' ? 'কেন্দ্রের নাম, ওয়ার্ড নং বা জেলা দিয়ে খুঁজুন...' : 
            language === 'hi' ? 'केंद्र का नाम, वार्ड नंबर या जिला से खोजें...' : 
            'Search Kendra name, Ward No, Municipality or Code (e.g. Ward No 45, SK-KOL-001)...'
          }
          className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-indigo-500 placeholder:text-neutral-500"
        />
      </div>

      {/* Kendras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((k) => {
          const isSelected = k.id === currentKendra.id;
          return (
            <div 
              key={k.id}
              className={`p-6 rounded-[2.5rem] border transition-all ${
                isSelected 
                  ? 'bg-indigo-950/40 border-indigo-600/80 shadow-lg shadow-indigo-950/50' 
                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800">
                      {k.code}
                    </span>
                    {k.wardName && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
                        📍 {k.wardName}
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                        ✓ Currently Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">{k.name}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{k.address}</p>
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(k)}
                      className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
                      title="Edit Kendra Details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {kendras.length > 1 && (
                      <button
                        onClick={() => handleDeleteKendra(k.id)}
                        className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-xl transition-colors"
                        title="Delete Kendra"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-neutral-800/40 rounded-2xl border border-neutral-800 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">District & Local Body</span>
                  <span className="text-neutral-200 font-bold">{k.districtName}</span>
                  <span className="text-neutral-400 text-[11px] block">{k.localBodyName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">In-Charge & Staff</span>
                  <span className="text-neutral-200 font-bold">{k.inChargeName || k.ownerName || 'Officer In-Charge'}</span>
                  <span className="text-indigo-400 text-[11px] block font-mono">👥 {k.operatorsCount || 2} Operators</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-neutral-800">
                <span className="text-neutral-400 flex items-center gap-1.5 text-xs">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{k.contactPhone || k.contactMobile}</span>
                </span>

                {!isSelected ? (
                  <button 
                    onClick={() => onSelectKendra(k)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                  >
                    Select this Kendra
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active Management Node</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Ward Kendra Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] w-full max-w-xl p-6 sm:p-8 shadow-2xl relative my-8">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block">
                  WARD KENDRA REGISTRATION
                </span>
                <h2 className="text-2xl font-black text-white">
                  {editingKendra ? 'Edit Ward Seva Kendra' : 'Add Ward-Wise Seva Kendra'}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSaveKendra} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Kendra Code</label>
                  <input 
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="SK-KOL-W45"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Seva Kendra Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ward No 45 Sonarpur Seva Kendra"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">District Name</label>
                  <input 
                    type="text"
                    value={formData.districtName}
                    onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                    placeholder="Kolkata"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Local Body / Block</label>
                  <input 
                    type="text"
                    value={formData.localBodyName}
                    onChange={(e) => setFormData({ ...formData, localBodyName: e.target.value })}
                    placeholder="Kolkata Municipal Corp"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Ward No / GP Name</label>
                  <input 
                    type="text"
                    value={formData.wardName}
                    onChange={(e) => setFormData({ ...formData, wardName: e.target.value })}
                    placeholder="Ward No 45"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white font-bold text-amber-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">In-Charge Officer / Councillor</label>
                  <input 
                    type="text"
                    value={formData.inChargeName}
                    onChange={(e) => setFormData({ ...formData, inChargeName: e.target.value })}
                    placeholder="Subhasish Sen"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Contact Phone</label>
                  <input 
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+91 98310 12345"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Kendra Physical Address</label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="12, B.B.D. Bagh East, Ward 45 Office..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">PIN Code</label>
                  <input 
                    type="text"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    placeholder="700001"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Active Operators</label>
                  <input 
                    type="number"
                    value={formData.operatorsCount}
                    onChange={(e) => setFormData({ ...formData, operatorsCount: Number(e.target.value) })}
                    min={1}
                    max={20}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-3 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-2xl transition-colors shadow-lg shadow-indigo-600/20"
                >
                  {editingKendra ? 'Update Kendra' : 'Save Ward Kendra'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
