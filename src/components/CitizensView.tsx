import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  FileText, 
  Phone, 
  MessageSquare, 
  X, 
  Upload, 
  ShieldCheck, 
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  CreditCard,
  Building2,
  HeartHandshake,
  Tag,
  Award,
  Eye,
  Edit,
  Trash2,
  Download,
  FileSpreadsheet,
  Printer,
  Sparkles
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { 
  Citizen, 
  SevaKendra, 
  SevaApplication, 
  SocialCategory, 
  Religion, 
  RationCardType, 
  MaritalStatus, 
  DisabilityStatus, 
  LandHolding 
} from '../types';
import { storage } from '../services/storage';
import { exportToCSV, exportToPDFPrint, parseCSVFile } from '../utils/exportImport';
import { CameraFormScanner } from './CameraFormScanner';

interface CitizensViewProps {
  language: Language;
  currentKendra: SevaKendra;
  initialShowRegister?: boolean;
  onSelectCitizenForApp?: (citizen: Citizen) => void;
}

export const CitizensView: React.FC<CitizensViewProps> = ({
  language,
  currentKendra,
  initialShowRegister = false,
  onSelectCitizenForApp
}) => {
  const t = translations[language];
  const [citizens, setCitizens] = useState<Citizen[]>(storage.getCitizens());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [editingCitizen, setEditingCitizen] = useState<Citizen | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(initialShowRegister);

  const csvInputRef = useRef<HTMLInputElement>(null);

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | SocialCategory>('ALL');
  const [religionFilter, setReligionFilter] = useState<'ALL' | Religion>('ALL');

  // Registration & Edit Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [dob, setDob] = useState('1992-05-15');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState(currentKendra.districtName);
  const [localBody, setLocalBody] = useState(currentKendra.localBodyName);
  const [ward, setWard] = useState(currentKendra.wardName);
  const [pin, setPin] = useState(currentKendra.pin);
  const [occupation, setOccupation] = useState('Homemaker');
  const [incomeRange, setIncomeRange] = useState('Below ₹1,000,00 / yr');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [email, setEmail] = useState('');

  // Classifications State
  const [category, setCategory] = useState<SocialCategory>('SC');
  const [casteCertificateNo, setCasteCertificateNo] = useState('');
  const [religion, setReligion] = useState<Religion>('Hinduism');
  const [rationCardType, setRationCardType] = useState<RationCardType>('SPHH');
  const [rationCardNo, setRationCardNo] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Married');
  const [disabilityStatus, setDisabilityStatus] = useState<DisabilityStatus>('None');
  const [disabilityCertNo, setDisabilityCertNo] = useState('');
  const [landHolding, setLandHolding] = useState<LandHolding>('None / Landless');
  const [bankName, setBankName] = useState('State Bank of India');
  const [bankAccountLast4, setBankAccountLast4] = useState('8812');
  const [bankIfsc, setBankIfsc] = useState('SBIN0001012');
  const [isDbtAadhaarLinked, setIsDbtAadhaarLinked] = useState(true);

  const filteredCitizens = citizens.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile.includes(searchQuery) ||
      c.citizenId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesReligion = religionFilter === 'ALL' || c.religion === religionFilter;
    return matchesSearch && matchesCategory && matchesReligion;
  });

  const openRegisterModal = () => {
    setEditingCitizen(null);
    setFullName('');
    setMobile('');
    setWhatsApp('');
    setGender('Female');
    setDob('1992-05-15');
    setAddress('');
    setOccupation('Homemaker');
    setCategory('SC');
    setCasteCertificateNo('');
    setReligion('Hinduism');
    setRationCardType('SPHH');
    setRationCardNo('');
    setMaritalStatus('Married');
    setDisabilityStatus('None');
    setLandHolding('None / Landless');
    setBankName('State Bank of India');
    setBankAccountLast4('8812');
    setBankIfsc('SBIN0001012');
    setAadhaarLast4('');
    setShowRegisterModal(true);
  };

  const openEditModal = (citizen: Citizen) => {
    setEditingCitizen(citizen);
    setFullName(citizen.fullName);
    setMobile(citizen.mobile);
    setWhatsApp(citizen.whatsApp || citizen.mobile);
    setGender(citizen.gender);
    setDob(citizen.dob || '1992-05-15');
    setAddress(citizen.address || '');
    setDistrict(citizen.district || currentKendra.districtName);
    setLocalBody(citizen.localBody || currentKendra.localBodyName);
    setWard(citizen.ward || currentKendra.wardName);
    setPin(citizen.pin || currentKendra.pin);
    setOccupation(citizen.occupation || 'Homemaker');
    setIncomeRange(citizen.incomeRange || 'Below ₹1,000,00 / yr');
    setAadhaarLast4(citizen.aadhaarLast4 || '');
    setEmail(citizen.email || '');

    setCategory(citizen.category || 'General');
    setCasteCertificateNo(citizen.casteCertificateNo || '');
    setReligion(citizen.religion || 'Hinduism');
    setRationCardType(citizen.rationCardType || 'SPHH');
    setRationCardNo(citizen.rationCardNo || '');
    setMaritalStatus(citizen.maritalStatus || 'Married');
    setDisabilityStatus(citizen.disabilityStatus || 'None');
    setDisabilityCertNo(citizen.disabilityCertNo || '');
    setLandHolding(citizen.landHolding || 'None / Landless');
    setBankName(citizen.bankName || 'State Bank of India');
    setBankAccountLast4(citizen.bankAccountLast4 || '8812');
    setBankIfsc(citizen.bankIfsc || 'SBIN0001012');
    setIsDbtAadhaarLinked(citizen.isDbtAadhaarLinked ?? true);

    setShowRegisterModal(true);
  };

  const handleDeleteCitizen = (citizen: Citizen) => {
    if (confirm(`Are you sure you want to delete citizen record for ${citizen.fullName} (${citizen.citizenId})?`)) {
      storage.deleteCitizen(citizen.id);
      setCitizens(storage.getCitizens());
      if (selectedCitizen?.id === citizen.id) setSelectedCitizen(null);
    }
  };

  const handleScanFill = (scannedData: any) => {
    if (scannedData.fullName) setFullName(scannedData.fullName);
    if (scannedData.mobile) setMobile(scannedData.mobile);
    if (scannedData.gender) setGender(scannedData.gender);
    if (scannedData.dob) setDob(scannedData.dob);
    if (scannedData.address) setAddress(scannedData.address);
    if (scannedData.district) setDistrict(scannedData.district);
    if (scannedData.pin) setPin(scannedData.pin);
    if (scannedData.occupation) setOccupation(scannedData.occupation);
    if (scannedData.category) setCategory(scannedData.category);
    if (scannedData.religion) setReligion(scannedData.religion);
    if (scannedData.rationCardType) setRationCardType(scannedData.rationCardType);
    if (scannedData.rationCardNo) setRationCardNo(scannedData.rationCardNo);
    if (scannedData.maritalStatus) setMaritalStatus(scannedData.maritalStatus);
    if (scannedData.isDivyangjan) setDisabilityStatus('Yes (40%+ Divyangjan)');
    if (scannedData.aadhaarLast4) setAadhaarLast4(scannedData.aadhaarLast4);
    if (scannedData.bankName) setBankName(scannedData.bankName);
    if (scannedData.bankIfsc) setBankIfsc(scannedData.bankIfsc);
  };

  const handleSaveCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    const isMinority = ['Islam', 'Christianity', 'Sikhism', 'Buddhism', 'Jainism'].includes(religion);
    
    const citizenData: Citizen = {
      id: editingCitizen ? editingCitizen.id : `cit-${Date.now()}`,
      citizenId: editingCitizen ? editingCitizen.citizenId : `CIT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName,
      mobile,
      whatsApp: whatsApp || mobile,
      gender,
      dob,
      address: address || `${currentKendra.wardName}, ${currentKendra.districtName}`,
      district,
      localBody,
      ward,
      pin,
      occupation,
      incomeRange,
      category,
      casteCertificateNo: casteCertificateNo || undefined,
      religion,
      isMinority,
      rationCardType,
      rationCardNo: rationCardNo || undefined,
      maritalStatus,
      disabilityStatus,
      disabilityCertNo: disabilityCertNo || undefined,
      landHolding,
      bankName,
      bankAccountLast4,
      bankIfsc,
      isDbtAadhaarLinked,
      email,
      aadhaarLast4: aadhaarLast4 ? aadhaarLast4.slice(-4) : '5678',
      photoUrl: editingCitizen?.photoUrl || (gender === 'Female' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
      kendraId: currentKendra.id,
      createdAt: editingCitizen ? editingCitizen.createdAt : new Date().toISOString()
    };

    storage.saveCitizen(citizenData);
    setCitizens(storage.getCitizens());
    setShowRegisterModal(false);
    setEditingCitizen(null);

    if (onSelectCitizenForApp) {
      onSelectCitizenForApp(citizenData);
    }
  };

  const handleExportCSV = () => {
    const exportData = filteredCitizens.map(c => ({
      'Citizen ID': c.citizenId,
      'Full Name': c.fullName,
      'Mobile': c.mobile,
      'Gender': c.gender,
      'Category': c.category || 'General',
      'Religion': c.religion || 'Hinduism',
      'Ration Card': `${c.rationCardType} (${c.rationCardNo || 'N/A'})`,
      'Address': c.address,
      'District': c.district,
      'Bank': `${c.bankName} (${c.bankIfsc})`,
      'Created At': c.createdAt
    }));
    exportToCSV('Citizens_Database', exportData);
  };

  const handleExportPDF = () => {
    const columns = ['ID', 'Name', 'Mobile', 'Gender', 'Category', 'Religion', 'Ration Card', 'District'];
    const rows = filteredCitizens.map(c => [
      c.citizenId,
      c.fullName,
      c.mobile,
      c.gender,
      c.category || 'General',
      c.religion || 'Hinduism',
      c.rationCardType || 'SPHH',
      c.district
    ]);
    exportToPDFPrint('Citizens Register', 'Comprehensive Citizen Directory & Demographics', columns, rows);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedRows = await parseCSVFile(file);
      const newCitizens: Citizen[] = parsedRows.map((row, idx) => ({
        id: `cit-imp-${Date.now()}-${idx}`,
        citizenId: row['Citizen ID'] || `CIT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        fullName: row['Full Name'] || row['Name'] || 'Citizen Name',
        mobile: row['Mobile'] || row['Phone'] || '9800000000',
        whatsApp: row['Mobile'] || '9800000000',
        gender: (row['Gender'] as any) || 'Female',
        dob: row['DOB'] || '1995-01-01',
        address: row['Address'] || 'West Bengal',
        district: row['District'] || currentKendra.districtName,
        category: (row['Category'] as any) || 'General',
        religion: (row['Religion'] as any) || 'Hinduism',
        rationCardType: (row['Ration Card Type'] as any) || 'SPHH',
        kendraId: currentKendra.id,
        createdAt: new Date().toISOString()
      }));

      storage.importCitizensBulk(newCitizens);
      setCitizens(storage.getCitizens());
      alert(`Successfully imported ${newCitizens.length} citizen records!`);
    } catch (err: any) {
      alert(`CSV Import Failed: ${err.message}`);
    }
  };

  const applications = storage.getApplications();

  const getCategoryBadgeColor = (cat?: SocialCategory) => {
    switch (cat) {
      case 'SC':
      case 'ST':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'OBC-A':
      case 'OBC-B':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'General':
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
            {language === 'bn' ? 'নাগরিক ডিরেক্টরি' : 'Citizen Database'}
          </span>
          <h1 className="text-2xl font-black text-white">
            {language === 'bn' ? 'নথিবদ্ধ নাগরিকবৃন্দ' : 'Registered Citizens'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn' ? 'সামাজিক শ্রেণী, সংখ্যালঘু তথ্য ও অন্যান্য কল্যাণমূলক তথ্যাদি সহ নাগরিকেদের প্রোফাইল' : 'Manage demographic profiles, social classifications (SC/ST/OBC), religion, ration card & DBT accounts.'}
          </p>
        </div>

        {/* Action Controls: Add, Import, Export */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={openRegisterModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.dash_btn_registerCitizen}</span>
          </button>

          <button
            onClick={() => csvInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs px-3 py-2.5 rounded-2xl transition-all cursor-pointer"
            title="Import Citizens from CSV File"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <input 
            ref={csvInputRef}
            type="file" 
            accept=".csv" 
            className="hidden" 
            onChange={handleImportCSV} 
          />

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs px-3 py-2.5 rounded-2xl transition-all cursor-pointer"
            title="Export to Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">CSV / Excel</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs px-3 py-2.5 rounded-2xl transition-all cursor-pointer"
            title="Print PDF Report"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Print PDF</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'নাম, মোবাইল, কাস্ট নম্বর বা আইডি দিয়ে খুঁজুন...' : 'Search citizen by name, mobile, Aadhaar, or Citizen ID...'}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-indigo-500 placeholder:text-neutral-500"
          />
        </div>

        {/* Social Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-neutral-500 shrink-0 ml-1" />
          {(['ALL', 'SC', 'ST', 'OBC-A', 'OBC-B', 'General'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                categoryFilter === cat 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? (language === 'bn' ? 'সকল শ্রেণী' : 'All Categories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Citizen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCitizens.map((citizen) => {
          const citizenApps = applications.filter(a => a.citizenId === citizen.id);
          return (
            <div 
              key={citizen.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between transition-all hover:scale-[1.01] group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={citizen.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'} 
                      alt={citizen.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-neutral-700 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                        {citizen.fullName}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800">
                        {citizen.citizenId}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeColor(citizen.category)}`}>
                      {citizen.category || 'General'}
                    </span>
                    {citizen.isMinority && (
                      <span className="text-[9px] font-bold text-teal-400 bg-teal-950/80 px-1.5 py-0.2 rounded border border-teal-800">
                        Minority
                      </span>
                    )}
                  </div>
                </div>

                {/* Classification Badges Pill Row */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] text-neutral-300 bg-neutral-800/80 px-2 py-0.5 rounded-lg border border-neutral-700">
                    {citizen.religion || 'Hinduism'}
                  </span>
                  <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-800/80">
                    {citizen.rationCardType || 'Ration Card'}
                  </span>
                  {citizen.disabilityStatus?.includes('Yes') && (
                    <span className="text-[10px] text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-800">
                      Divyangjan
                    </span>
                  )}
                  {citizen.isDbtAadhaarLinked && (
                    <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800">
                      DBT Linked
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-neutral-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{citizen.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Aadhaar Last 4: **** {citizen.aadhaarLast4 || '4821'}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">
                    {citizen.occupation} • {citizen.address}
                  </div>
                </div>
              </div>

              {/* Card Footer with View / Edit / Delete buttons */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-500">
                  {citizenApps.length} Apps
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setSelectedCitizen(citizen)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
                    title="View Profile Details"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  </button>

                  <button 
                    onClick={() => openEditModal(citizen)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
                    title="Edit Citizen Profile"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button 
                    onClick={() => handleDeleteCitizen(citizen)}
                    className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800 transition-colors cursor-pointer"
                    title="Delete Citizen Record"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  </button>

                  <a
                    href={`https://wa.me/91${citizen.whatsApp}?text=Hello%20${encodeURIComponent(citizen.fullName)},%20Greetings%20from%20${encodeURIComponent(currentKendra.name)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 rounded-xl border border-emerald-800/60 transition-colors"
                    title="Send WhatsApp Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Citizen Profile Drawer Modal */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedCitizen.photoUrl} 
                  alt={selectedCitizen.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedCitizen.fullName}</h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryBadgeColor(selectedCitizen.category)}`}>
                      {selectedCitizen.category || 'General'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400">{selectedCitizen.citizenId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditModal(selectedCitizen)}
                  className="p-2 text-amber-400 hover:text-white rounded-xl bg-neutral-800 border border-neutral-700 flex items-center gap-1 text-xs font-bold"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteCitizen(selectedCitizen)}
                  className="p-2 text-rose-400 hover:text-white rounded-xl bg-rose-950/60 border border-rose-800 flex items-center gap-1 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button 
                  onClick={() => setSelectedCitizen(null)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Classification & Demographic Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 bg-neutral-800/50 p-4 rounded-2xl border border-neutral-800 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Mobile / WhatsApp</span>
                <span className="text-neutral-200 font-bold">{selectedCitizen.mobile}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Gender / DOB</span>
                <span className="text-neutral-200 font-bold">{selectedCitizen.gender} • {selectedCitizen.dob}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Social Category (SC/ST)</span>
                <span className="text-purple-300 font-bold">{selectedCitizen.category || 'General'} {selectedCitizen.casteCertificateNo ? `(${selectedCitizen.casteCertificateNo})` : ''}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Religion / Minority</span>
                <span className="text-neutral-200 font-bold">{selectedCitizen.religion || 'Hinduism'} {selectedCitizen.isMinority ? '(Minority Community)' : ''}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Ration Card Type</span>
                <span className="text-amber-300 font-bold">{selectedCitizen.rationCardType || 'RKSY'} {selectedCitizen.rationCardNo ? `(${selectedCitizen.rationCardNo})` : ''}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Marital Status</span>
                <span className="text-neutral-200 font-bold">{selectedCitizen.maritalStatus || 'Married'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Disability Status</span>
                <span className="text-rose-300 font-bold">{selectedCitizen.disabilityStatus || 'None'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Land Holding</span>
                <span className="text-neutral-200 font-bold">{selectedCitizen.landHolding || 'None / Landless'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">DBT Bank Account</span>
                <span className="text-emerald-400 font-mono font-bold">{selectedCitizen.bankName || 'SBI'} **** {selectedCitizen.bankAccountLast4 || '8812'}</span>
              </div>
            </div>

            {/* Application History */}
            <h3 className="text-sm font-bold text-white mb-3">Application History</h3>
            <div className="space-y-3">
              {applications.filter(a => a.citizenId === selectedCitizen.id).map(app => (
                <div key={app.id} className="p-4 bg-neutral-800/40 rounded-2xl border border-neutral-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{app.serviceName}</div>
                    <div className="text-[10px] font-mono text-indigo-400">{app.sevaId} • {app.createdAt.split('T')[0]}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Citizen Register / Edit Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingCitizen ? 'Edit Citizen Profile' : t.dash_btn_registerCitizen}
                </h2>
                <p className="text-xs text-neutral-400">Enter citizen demographics, social classifications & bank details</p>
              </div>

              <div className="flex items-center gap-2">
                {/* AI Camera Form Scanner */}
                <CameraFormScanner onScanComplete={handleScanFill} language={language} />

                <button 
                  onClick={() => setShowRegisterModal(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveCitizen} className="space-y-5 text-xs">
              
              {/* Section 1: Basic Identity */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>1. Basic Personal Identity</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Full Name *</label>
                    <input 
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Anjali Das"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Mobile Number *</label>
                    <input 
                      required
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10 digit mobile"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Date of Birth</label>
                    <input 
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Aadhaar Last 4 Digits ONLY</label>
                    <input 
                      type="text"
                      maxLength={4}
                      value={aadhaarLast4}
                      onChange={(e) => setAadhaarLast4(e.target.value)}
                      placeholder="e.g. 4821"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Occupation</label>
                    <input 
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g. Homemaker / Farmer"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Social Category & Religion Classification */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>2. Social Category & Religion Classifications</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Social Category (Caste) *</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value as SocialCategory)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                    >
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="OBC-A">OBC-A (Other Backward Classes - A)</option>
                      <option value="OBC-B">OBC-B (Other Backward Classes - B)</option>
                      <option value="General">General / Unreserved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Caste Certificate No (If Issued)</label>
                    <input 
                      type="text"
                      value={casteCertificateNo}
                      onChange={(e) => setCasteCertificateNo(e.target.value)}
                      placeholder="e.g. WB/SC/2022/9921"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Religion</label>
                    <select 
                      value={religion}
                      onChange={(e) => setReligion(e.target.value as Religion)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Hinduism">Hinduism</option>
                      <option value="Islam">Islam (Minority)</option>
                      <option value="Christianity">Christianity (Minority)</option>
                      <option value="Sikhism">Sikhism (Minority)</option>
                      <option value="Buddhism">Buddhism (Minority)</option>
                      <option value="Jainism">Jainism (Minority)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Marital Status</label>
                    <select 
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Married">Married</option>
                      <option value="Single">Single / Unmarried</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced / Separated">Divorced / Separated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Socio-Economic, Ration Card & Land Holding */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>3. Ration Card, Income & Land Holding</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Digital Ration Card Type</label>
                    <select 
                      value={rationCardType}
                      onChange={(e) => setRationCardType(e.target.value as RationCardType)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="SPHH">SPHH (State Priority Household)</option>
                      <option value="PHH">PHH (Priority Household)</option>
                      <option value="AAY (Antyodaya)">AAY (Antyodaya Anna Yojana - BPL)</option>
                      <option value="RKSY-I">RKSY-I (Rajya Khadya Suraksha Yojana I)</option>
                      <option value="RKSY-II">RKSY-II (Rajya Khadya Suraksha Yojana II)</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Ration Card Number</label>
                    <input 
                      type="text"
                      value={rationCardNo}
                      onChange={(e) => setRationCardNo(e.target.value)}
                      placeholder="e.g. 09817726351"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Disability / Divyangjan Status</label>
                    <select 
                      value={disabilityStatus}
                      onChange={(e) => setDisabilityStatus(e.target.value as DisabilityStatus)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="None">None</option>
                      <option value="Yes (40%+ Divyangjan)">Yes (40%+ Disability - Divyangjan)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Land Holding Class</label>
                    <select 
                      value={landHolding}
                      onChange={(e) => setLandHolding(e.target.value as LandHolding)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="None / Landless">None / Landless</option>
                      <option value="Marginal (< 1 Acre)">Marginal (&lt; 1 Acre)</option>
                      <option value="Small (1 - 2.5 Acres)">Small (1 - 2.5 Acres)</option>
                      <option value="Large (> 2.5 Acres)">Large (&gt; 2.5 Acres)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: DBT Banking Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>4. Direct Benefit Transfer (DBT) Bank Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Bank Name</label>
                    <input 
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. State Bank of India"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">IFSC Code</label>
                    <input 
                      type="text"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      placeholder="e.g. SBIN0001012"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Account Last 4 Digits</label>
                    <input 
                      type="text"
                      maxLength={4}
                      value={bankAccountLast4}
                      onChange={(e) => setBankAccountLast4(e.target.value)}
                      placeholder="e.g. 8812"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Residential Address</label>
                <textarea 
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street / Village / House No."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[11px] text-amber-300">
                🔒 Privacy Guard: Do NOT enter or store full 12-digit Aadhaar numbers in compliance with UIDAI citizen privacy directives.
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  {editingCitizen ? 'Update Citizen Record' : 'Register Citizen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
