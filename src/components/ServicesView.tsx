import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  IndianRupee, 
  FileText, 
  ShieldAlert, 
  X,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  Printer,
  Upload
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { ServiceItem, ServiceCategory } from '../types';
import { storage } from '../services/storage';
import { exportToCSV, exportToPDFPrint, parseCSVFile } from '../utils/exportImport';

interface ServicesViewProps {
  language: Language;
  onSelectServiceForApp?: (service: ServiceItem) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  language,
  onSelectServiceForApp
}) => {
  const t = translations[language];
  const [services, setServices] = useState<ServiceItem[]>(storage.getServices());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const csvInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Welfare & Pension');
  const [department, setDepartment] = useState('');
  const [govtFee, setGovtFee] = useState<number>(0);
  const [assistanceFee, setAssistanceFee] = useState<number>(50);
  const [estimatedDays, setEstimatedDays] = useState<number>(7);
  const [officialUrl, setOfficialUrl] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [requiredDocsInput, setRequiredDocsInput] = useState('Aadhaar Card, Mobile Number, Bank Passbook');

  const categories: string[] = ['ALL', ...Array.from(new Set<string>(services.map(s => String(s.category))))];

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.nameBn.includes(searchQuery) ||
                          s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setNameBn('');
    setCategory('Welfare & Pension');
    setDepartment('Department of Women & Child Development');
    setGovtFee(0);
    setAssistanceFee(50);
    setEstimatedDays(7);
    setOfficialUrl('https://wb.gov.in');
    setDescription('');
    setDescriptionBn('');
    setRequiredDocsInput('Aadhaar Card, Mobile Number, Bank Passbook');
    setShowFormModal(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setName(service.name);
    setNameBn(service.nameBn);
    setCategory(service.category);
    setDepartment(service.department);
    setGovtFee(service.govtFee);
    setAssistanceFee(service.assistanceFee);
    setEstimatedDays(service.estimatedDays);
    setOfficialUrl(service.officialUrl);
    setDescription(service.description);
    setDescriptionBn(service.descriptionBn);
    setRequiredDocsInput(service.requiredDocs.join(', '));
    setShowFormModal(true);
  };

  const handleDeleteService = (service: ServiceItem) => {
    if (confirm(`Are you sure you want to delete the service "${service.name}"?`)) {
      storage.deleteService(service.id);
      setServices(storage.getServices());
      if (selectedService?.id === service.id) setSelectedService(null);
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const docsArray = requiredDocsInput.split(',').map(d => d.trim()).filter(Boolean);
    const serviceData: ServiceItem = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      name,
      nameEn: name,
      nameBn: nameBn || name,
      category,
      department: department || 'Govt Department',
      govtFee: Number(govtFee),
      assistanceFee: Number(assistanceFee),
      estimatedDays: Number(estimatedDays),
      requiredDocs: docsArray.length > 0 ? docsArray : ['Aadhaar Card', 'Mobile Number'],
      officialUrl: officialUrl || 'https://wb.gov.in',
      description,
      descriptionBn: descriptionBn || description,
      eligibilitySummary: 'Eligible for all resident citizens with valid documentation.'
    };

    storage.saveService(serviceData);
    setServices(storage.getServices());
    setShowFormModal(false);
    setEditingService(null);
  };

  const handleExportCSV = () => {
    const data = filteredServices.map(s => ({
      'Service Name': s.name,
      'Bengali Name': s.nameBn,
      'Category': s.category,
      'Department': s.department,
      'Govt Fee': s.govtFee,
      'Assistance Fee': s.assistanceFee,
      'Est. Days': s.estimatedDays,
      'Required Docs': s.requiredDocs.join('; ')
    }));
    exportToCSV('Seva_Services_Catalogue', data);
  };

  const handleExportPDF = () => {
    const cols = ['Name', 'Category', 'Department', 'Govt Fee', 'Assistance Fee', 'Days'];
    const rows = filteredServices.map(s => [
      s.name,
      s.category,
      s.department,
      s.govtFee === 0 ? 'FREE' : `₹${s.govtFee}`,
      `₹${s.assistanceFee}`,
      `${s.estimatedDays} Days`
    ]);
    exportToPDFPrint('Government Services Catalogue', 'Official Fee Schedule & Service Timelines', cols, rows);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseCSVFile(file);
      const imported: ServiceItem[] = rows.map((r, i) => ({
        id: `srv-imp-${Date.now()}-${i}`,
        name: r['Service Name'] || r['Name'] || 'New Service',
        nameEn: r['Service Name'] || r['Name'] || 'New Service',
        nameBn: r['Bengali Name'] || r['Service Name'] || 'নতুন সেবা',
        category: (r['Category'] as any) || 'Welfare & Pension',
        department: r['Department'] || 'Govt Department',
        govtFee: Number(r['Govt Fee']) || 0,
        assistanceFee: Number(r['Assistance Fee']) || 50,
        estimatedDays: Number(r['Est. Days']) || 7,
        requiredDocs: (r['Required Docs'] || 'Aadhaar, Mobile').split(';').map(d => d.trim()),
        officialUrl: r['Official URL'] || 'https://wb.gov.in',
        description: r['Description'] || 'Government welfare service.',
        descriptionBn: r['Description'] || 'সরকারি জনকল্যাণমূলক সেবা।',
        eligibilitySummary: 'Eligible for resident citizens.'
      }));

      storage.importServicesBulk(imported);
      setServices(storage.getServices());
      alert(`Imported ${imported.length} services successfully!`);
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
            {language === 'bn' ? 'অফিসিয়াল সেবা তালিকা' : 'Central Service Catalogue'}
          </span>
          <h1 className="text-2xl font-black text-white">
            {language === 'bn' ? 'উপলব্ধ নাগরিক সেবাসমূহ' : 'Available Citizen Services'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            {language === 'bn' 
              ? 'সরকারি ফি ও সেবাকেন্দ্র সহায়তা ফির স্বচ্ছ তালিকা। প্রতিটি সেবায় প্রয়োজনীয় নথিপত্রের সম্পূর্ণ চেকলিস্ট দেওয়া রয়েছে।' 
              : 'Verified government services directory with clear distinction between official government fees and operator assistance charges.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>

          <button
            onClick={() => csvInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs px-3 py-2.5 rounded-2xl transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs px-3 py-2.5 rounded-2xl transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs px-3 py-2.5 rounded-2xl transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'সেবার নাম বা সরকারি দপ্তর দিয়ে খুঁজুন...' : 'Search service name, department or category...'}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-indigo-500 placeholder:text-neutral-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? (language === 'bn' ? 'সব সেবা' : 'All Services') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredServices.map((service) => (
          <div 
            key={service.id}
            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-[2.5rem] p-6 flex flex-col justify-between transition-all hover:scale-[1.01] group relative"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
                  {service.category}
                </span>
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~{service.estimatedDays} Days
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">
                {language === 'bn' ? service.nameBn : service.name}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                {language === 'bn' ? service.descriptionBn : service.description}
              </p>

              {/* Fee Breakdown Badge */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-800/40 rounded-2xl border border-neutral-800 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">Official Govt Fee</span>
                  <span className="text-emerald-400 font-mono font-extrabold">
                    {service.govtFee === 0 ? 'FREE (₹0)' : `₹${service.govtFee}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">Assistance Charge</span>
                  <span className="text-amber-400 font-mono font-extrabold">
                    ₹{service.assistanceFee}
                  </span>
                </div>
              </div>

              {/* Document Checklist Preview */}
              <div className="space-y-1 mb-4">
                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block">
                  Required Documents ({service.requiredDocs.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {service.requiredDocs.map((doc, idx) => (
                    <span key={idx} className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700">
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
              <a 
                href={service.officialUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-neutral-500 hover:text-neutral-300 text-xs flex items-center gap-1 font-semibold"
              >
                <span>Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setSelectedService(service)}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
                  title="View Details"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                </button>

                <button 
                  onClick={() => openEditModal(service)}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
                  title="Edit Service"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button 
                  onClick={() => handleDeleteService(service)}
                  className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800 transition-colors cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </button>

                {onSelectServiceForApp && (
                  <button 
                    onClick={() => onSelectServiceForApp(service)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    + Seva App
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800">
                  {selectedService.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">
                  {language === 'bn' ? selectedService.nameBn : selectedService.name}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">{selectedService.department}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditModal(selectedService)}
                  className="p-2 text-amber-400 hover:text-white rounded-xl bg-neutral-800 border border-neutral-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteService(selectedService)}
                  className="p-2 text-rose-400 hover:text-white rounded-xl bg-rose-950/60 border border-rose-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-neutral-800/50 rounded-2xl border border-neutral-800 text-xs space-y-3">
              <div>
                <span className="font-bold text-white block mb-1">Eligibility Overview:</span>
                <p className="text-neutral-300">{selectedService.eligibilitySummary}</p>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">Required Document Checklist:</span>
                <ul className="list-disc list-inside space-y-1 text-neutral-300">
                  {selectedService.requiredDocs.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <a 
                href={selectedService.officialUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-indigo-400 text-xs font-bold flex items-center gap-1"
              >
                <span>Official Department Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button 
                onClick={() => setSelectedService(null)}
                className="bg-neutral-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-xs">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingService ? 'Edit Government Service' : 'Add New Government Service'}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Service Name (English) *</label>
                  <input 
                    required 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Birth Certificate"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Service Name (Bengali)</label>
                  <input 
                    type="text" 
                    value={nameBn} 
                    onChange={e => setNameBn(e.target.value)}
                    placeholder="e.g. জন্ম সার্টিফিকেট"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Welfare & Pension">Welfare & Pension</option>
                    <option value="Certificates & Identity">Certificates & Identity</option>
                    <option value="Agriculture & Rural">Agriculture & Rural</option>
                    <option value="Revenue & Land">Revenue & Land</option>
                    <option value="Health & Insurance">Health & Insurance</option>
                    <option value="Education & Youth">Education & Youth</option>
                    <option value="Utilities & Municipal">Utilities & Municipal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Department</label>
                  <input 
                    type="text" 
                    value={department} 
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Dept of Health"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Govt Fee (₹)</label>
                  <input 
                    type="number" 
                    value={govtFee} 
                    onChange={e => setGovtFee(Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Assistance (₹)</label>
                  <input 
                    type="number" 
                    value={assistanceFee} 
                    onChange={e => setAssistanceFee(Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Est. Days</label>
                  <input 
                    type="number" 
                    value={estimatedDays} 
                    onChange={e => setEstimatedDays(Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Required Documents (Comma Separated)</label>
                <input 
                  type="text" 
                  value={requiredDocsInput} 
                  onChange={e => setRequiredDocsInput(e.target.value)}
                  placeholder="e.g. Aadhaar Card, Ration Card, Photo"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Description (English)</label>
                <textarea 
                  rows={2}
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Service overview..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-neutral-800">
                <button 
                  type="button" 
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
