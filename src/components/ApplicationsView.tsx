import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Printer, 
  Upload, 
  Send, 
  QrCode, 
  Building2, 
  User, 
  MessageSquare,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SevaApplication, SevaKendra, Citizen, ServiceItem, ApplicationStatus } from '../types';
import { storage } from '../services/storage';
import { exportToCSV, exportToPDFPrint, parseCSVFile } from '../utils/exportImport';
import { CameraFormScanner } from './CameraFormScanner';

interface ApplicationsViewProps {
  language: Language;
  currentKendra: SevaKendra;
  initialNewApp?: boolean;
  preselectedCitizen?: Citizen | null;
  preselectedService?: ServiceItem | null;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  language,
  currentKendra,
  initialNewApp = false,
  preselectedCitizen = null,
  preselectedService = null
}) => {
  const t = translations[language];
  const [applications, setApplications] = useState<SevaApplication[]>(storage.getApplications());
  const citizens = storage.getCitizens();
  const services = storage.getServices();

  const [showNewAppModal, setShowNewAppModal] = useState(initialNewApp);
  const [editingApp, setEditingApp] = useState<SevaApplication | null>(null);
  const [selectedApp, setSelectedApp] = useState<SevaApplication | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<SevaApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const csvInputRef = useRef<HTMLInputElement>(null);

  // Form State for new/edit application
  const [citizenId, setCitizenId] = useState<string>(preselectedCitizen ? preselectedCitizen.id : (citizens[0]?.id || ''));
  const [serviceId, setServiceId] = useState<string>(preselectedService ? preselectedService.id : (services[0]?.id || ''));
  const [operatorName, setOperatorName] = useState('Rajesh Mukherjee');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.sevaId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.citizenMobile.includes(searchQuery) ||
                          app.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openNewAppModal = () => {
    setEditingApp(null);
    setCitizenId(citizens[0]?.id || '');
    setServiceId(services[0]?.id || '');
    setNotes('');
    setPriority('NORMAL');
    setShowNewAppModal(true);
  };

  const openEditAppModal = (app: SevaApplication) => {
    setEditingApp(app);
    setCitizenId(app.citizenId);
    setServiceId(app.serviceId);
    setOperatorName(app.assignedOperator);
    setNotes(app.notes || '');
    setPriority(app.priority);
    setShowNewAppModal(true);
  };

  const handleDeleteApp = (app: SevaApplication) => {
    if (confirm(`Are you sure you want to delete application ${app.sevaId}?`)) {
      storage.deleteApplication(app.id);
      setApplications(storage.getApplications());
      if (selectedApp?.id === app.id) setSelectedApp(null);
    }
  };

  const handleScanFill = (data: any) => {
    if (data.notes) setNotes(prev => (prev ? `${prev} | ${data.notes}` : data.notes));
    // If scanning found a matching citizen name, pre-select if possible
    if (data.fullName) {
      const match = citizens.find(c => c.fullName.toLowerCase().includes(data.fullName.toLowerCase()));
      if (match) setCitizenId(match.id);
    }
  };

  const handleSaveApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const citizen = citizens.find(c => c.id === citizenId) || citizens[0];
    const service = services.find(s => s.id === serviceId) || services[0];

    if (editingApp) {
      const updatedApp: SevaApplication = {
        ...editingApp,
        citizenId: citizen.id,
        citizenName: citizen.fullName,
        citizenMobile: citizen.mobile,
        serviceId: service.id,
        serviceName: service.name,
        serviceNameBn: service.nameBn,
        assignedOperator: operatorName,
        priority,
        notes,
        govtFee: service.govtFee,
        assistanceFee: service.assistanceFee,
        updatedAt: new Date().toISOString()
      };
      storage.saveApplication(updatedApp);
      setApplications(storage.getApplications());
      setShowNewAppModal(false);
      setEditingApp(null);
    } else {
      const sevaId = `SEVA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newApp: SevaApplication = {
        id: `app-${Date.now()}`,
        sevaId,
        citizenId: citizen.id,
        citizenName: citizen.fullName,
        citizenMobile: citizen.mobile,
        kendraId: currentKendra.id,
        kendraName: currentKendra.name,
        serviceId: service.id,
        serviceName: service.name,
        serviceNameBn: service.nameBn,
        assignedOperator: operatorName,
        operatorId: 'op-101',
        priority,
        status: 'DOCUMENTS_RECEIVED',
        govtFee: service.govtFee,
        assistanceFee: service.assistanceFee,
        paymentStatus: 'PAID',
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: service.requiredDocs.map((docName, idx) => ({
          id: `doc-${Date.now()}-${idx}`,
          applicationId: `app-${Date.now()}`,
          docType: docName,
          fileName: `${citizen.fullName.toLowerCase().replace(/\s+/g, '_')}_${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
          fileUrl: '#',
          fileSize: '1.1 MB',
          uploadDate: new Date().toISOString(),
          verificationStatus: 'VERIFIED',
          verifiedBy: operatorName
        })),
        timeline: [
          {
            id: `tl-${Date.now()}-1`,
            applicationId: `app-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            title: 'Application Created',
            description: `Registered request for ${service.name} at ${currentKendra.name}`,
            performedBy: operatorName,
            status: 'NEW'
          },
          {
            id: `tl-${Date.now()}-2`,
            applicationId: `app-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            title: 'Documents Verified',
            description: 'Standard checklist documents uploaded and verified.',
            performedBy: operatorName,
            status: 'DOCUMENTS_RECEIVED'
          }
        ]
      };

      storage.saveApplication(newApp);
      setApplications(storage.getApplications());
      setShowNewAppModal(false);
      setShowReceiptModal(newApp);
    }
  };

  const updateStatus = (app: SevaApplication, newStatus: ApplicationStatus) => {
    const updatedTimeline = [
      ...app.timeline,
      {
        id: `tl-${Date.now()}`,
        applicationId: app.id,
        timestamp: new Date().toLocaleString(),
        title: `Status Updated to ${newStatus}`,
        description: `Status changed by operator.`,
        performedBy: 'Rajesh Mukherjee (Operator)',
        status: newStatus
      }
    ];

    const updatedApp: SevaApplication = {
      ...app,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      timeline: updatedTimeline
    };

    storage.saveApplication(updatedApp);
    setApplications(storage.getApplications());
    if (selectedApp && selectedApp.id === app.id) {
      setSelectedApp(updatedApp);
    }
  };

  const handleExportCSV = () => {
    const data = filteredApps.map(a => ({
      'SEVA ID': a.sevaId,
      'Citizen Name': a.citizenName,
      'Mobile': a.citizenMobile,
      'Service': a.serviceName,
      'Status': a.status,
      'Govt Fee': a.govtFee,
      'Assistance Fee': a.assistanceFee,
      'Created At': a.createdAt
    }));
    exportToCSV('Applications_Log', data);
  };

  const handleExportPDF = () => {
    const cols = ['SEVA ID', 'Citizen Name', 'Mobile', 'Service', 'Status', 'Total Fee'];
    const rows = filteredApps.map(a => [
      a.sevaId,
      a.citizenName,
      a.citizenMobile,
      a.serviceName,
      a.status,
      `₹${a.govtFee + a.assistanceFee}`
    ]);
    exportToPDFPrint('Application Register', 'Seva Application Submissions & Progress', cols, rows);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseCSVFile(file);
      const imported: SevaApplication[] = rows.map((r, i) => {
        const citizen = citizens[0];
        const service = services[0];
        return {
          id: `app-imp-${Date.now()}-${i}`,
          sevaId: r['SEVA ID'] || `SEVA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
          citizenId: citizen ? citizen.id : 'cit-1',
          citizenName: r['Citizen Name'] || 'Citizen',
          citizenMobile: r['Mobile'] || '9800000000',
          kendraId: currentKendra.id,
          kendraName: currentKendra.name,
          serviceId: service ? service.id : 'srv-1',
          serviceName: r['Service'] || 'Welfare Service',
          assignedOperator: 'Rajesh Mukherjee',
          operatorId: 'op-101',
          priority: 'NORMAL',
          status: (r['Status'] as any) || 'DOCUMENTS_RECEIVED',
          govtFee: Number(r['Govt Fee']) || 0,
          assistanceFee: Number(r['Assistance Fee']) || 50,
          paymentStatus: 'PAID',
          createdAt: r['Created At'] || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          documents: [],
          timeline: []
        };
      });

      storage.importApplicationsBulk(imported);
      setApplications(storage.getApplications());
      alert(`Successfully imported ${imported.length} application records!`);
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-1">
            {language === 'bn' ? 'আবেদনপত্র ব্যবস্থাপনা' : 'Application Records'}
          </span>
          <h1 className="text-2xl font-black text-white">
            {language === 'bn' ? 'সমস্ত সেবা আবেদনপত্র' : 'Seva Applications'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn' ? 'প্রতিটি আবেদনের ইউনিক সেবা আইডি (SEVA ID) ও লাইভ টাইমলাইন পরিচালনা করুন।' : 'Track progress, manage missing documents, and issue official Seva ID receipts.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={openNewAppModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.dash_btn_newApplication}</span>
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

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'সেবা নম্বর (SEVA ID), নাগরিকের নাম বা মোবাইল দিয়ে খুঁজুন...' : 'Search by Seva ID, citizen name, mobile number...'}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-indigo-500 placeholder:text-neutral-500"
          />
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-bold rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="ALL">All Statuses (সকল স্ট্যাটাস)</option>
          <option value="DOCUMENTS_PENDING">Documents Pending</option>
          <option value="DOCUMENTS_RECEIVED">Documents Received</option>
          <option value="SUBMITTED">Submitted to Govt Portal</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="COMPLETED">Completed / Issued</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-2xl">SEVA ID</th>
                <th className="p-3.5">Citizen Details</th>
                <th className="p-3.5">Service Requested</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created Date</th>
                <th className="p-3.5 rounded-r-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-indigo-400">
                    {app.sevaId}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{app.citizenName}</div>
                    <div className="text-[10px] text-neutral-500">{app.citizenMobile}</div>
                  </td>
                  <td className="p-3.5 max-w-xs truncate font-medium">
                    {language === 'bn' && app.serviceNameBn ? app.serviceNameBn : app.serviceName}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      app.status === 'SUBMITTED' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      app.status === 'DOCUMENTS_PENDING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-neutral-800 text-neutral-300'
                    }`}>
                      {t[`status_${app.status}` as keyof typeof t] || app.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-neutral-400 font-mono">
                    {app.createdAt.split('T')[0]}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
                        title="View Timeline & Docs"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      </button>

                      <button 
                        onClick={() => openEditAppModal(app)}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
                        title="Edit Application"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button 
                        onClick={() => handleDeleteApp(app)}
                        className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800 transition-colors cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>

                      <button 
                        onClick={() => setShowReceiptModal(app)}
                        className="p-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded-xl border border-indigo-800 cursor-pointer"
                        title="Print Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details & Timeline Drawer Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800">
                  {selectedApp.sevaId}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedApp.serviceName}</h2>
                <p className="text-xs text-neutral-400">Citizen: {selectedApp.citizenName} ({selectedApp.citizenMobile})</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditAppModal(selectedApp)}
                  className="p-2 text-amber-400 hover:text-white rounded-xl bg-neutral-800 border border-neutral-700 flex items-center gap-1 text-xs font-bold"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteApp(selectedApp)}
                  className="p-2 text-rose-400 hover:text-white rounded-xl bg-rose-950/60 border border-rose-800 flex items-center gap-1 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="p-4 bg-neutral-800/40 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-neutral-300 block">Update Status:</span>
              <div className="flex flex-wrap gap-2">
                {(['DOCUMENTS_RECEIVED', 'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_DOCUMENT_REQUIRED', 'COMPLETED'] as ApplicationStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(selectedApp, st)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      selectedApp.status === st 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700'
                    }`}
                  >
                    {t[`status_${st}` as keyof typeof t] || st}
                  </button>
                ))}
              </div>
            </div>

            {/* Application Documents */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Uploaded Documents Checklist</h3>
              <div className="space-y-2">
                {selectedApp.documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{doc.docType}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{doc.fileName || 'Pending upload'}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.verificationStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {doc.verificationStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Immutable Activity Timeline</h3>
              <div className="space-y-3 relative border-l border-neutral-800 pl-4 ml-2">
                {selectedApp.timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full absolute -left-[21px] top-1 border-2 border-neutral-900" />
                    <div className="text-xs font-bold text-white">{event.title}</div>
                    <p className="text-[11px] text-neutral-400">{event.description}</p>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{event.timestamp} • {event.performedBy}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-black text-white">SEVA DESK</h3>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{currentKendra.name}</p>
              </div>
              <button 
                onClick={() => setShowReceiptModal(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4 text-xs bg-neutral-950 p-5 rounded-2xl border border-neutral-800 font-mono text-neutral-300">
              <div className="text-center pb-3 border-b border-neutral-800">
                <span className="text-indigo-400 font-bold text-sm block">{showReceiptModal.sevaId}</span>
                <span className="text-[10px] text-neutral-500">Official Seva Tracking Receipt</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Citizen:</span>
                  <span className="font-bold text-white">{showReceiptModal.citizenName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mobile:</span>
                  <span>{showReceiptModal.citizenMobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Service:</span>
                  <span className="font-bold text-white text-right max-w-[180px] truncate">{showReceiptModal.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Govt Fee:</span>
                  <span>₹{showReceiptModal.govtFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Assistance Fee:</span>
                  <span>₹{showReceiptModal.assistanceFee}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-800 font-bold text-amber-300">
                  <span>Total Received:</span>
                  <span>₹{showReceiptModal.govtFee + showReceiptModal.assistanceFee} (PAID)</span>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-neutral-500 uppercase block">Track Online</span>
                  <span className="text-[10px] text-indigo-400">sevadesk.in/track</span>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-black" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New / Edit Application Creation Modal */}
      {showNewAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingApp ? `Edit Application (${editingApp.sevaId})` : t.dash_btn_newApplication}
                </h2>
                <p className="text-xs text-neutral-400">Select citizen and requested service to register</p>
              </div>
              <div className="flex items-center gap-2">
                <CameraFormScanner onScanComplete={handleScanFill} language={language} />
                <button 
                  onClick={() => setShowNewAppModal(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveApplication} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Select Registered Citizen *</label>
                <select 
                  value={citizenId}
                  onChange={(e) => setCitizenId(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white cursor-pointer"
                >
                  {citizens.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.citizenId} • {c.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Select Service *</label>
                <select 
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white cursor-pointer"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Assistance Fee: ₹{s.assistanceFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Assigned Operator</label>
                <input 
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Remarks / Application Notes</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Swasthya sathi card original verified."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowNewAppModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  {editingApp ? 'Save Changes' : 'Issue SEVA ID & Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
