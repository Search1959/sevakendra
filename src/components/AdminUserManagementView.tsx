import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Key, 
  Eye, 
  EyeOff, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Copy, 
  RefreshCw, 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Lock, 
  Sparkles,
  X,
  Plus
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { UserAccount, Role, SevaKendra } from '../types';
import { storage } from '../services/storage';

interface AdminUserManagementViewProps {
  language: Language;
  currentKendra: SevaKendra;
}

export const AdminUserManagementView: React.FC<AdminUserManagementViewProps> = ({
  language,
  currentKendra
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'CREATE_MANAGE' | 'CREDENTIALS_VIEW_EDIT'>('CREATE_MANAGE');
  
  // Accounts state synced with localStorage
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [kendras, setKendras] = useState<SevaKendra[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Form State for Account Creation / Edit
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Account Form
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '+91 ',
    password: '',
    showFormPassword: true,
    role: 'OPERATOR' as Role,
    kendraId: currentKendra.id,
    districtName: 'Kolkata',
    wardName: 'Ward No 45',
    status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED' | 'INACTIVE',
    notes: ''
  });

  // Modal states for View / Edit / Delete
  const [viewingAccount, setViewingAccount] = useState<UserAccount | null>(null);
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<UserAccount | null>(null);

  // Load accounts from storage
  const loadData = () => {
    const accList = storage.getAccounts();
    const kenList = storage.getKendras();
    setAccounts(accList);
    setKendras(kenList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let newPass = '';
    for (let i = 0; i < 10; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: newPass }));
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert(language === 'bn' ? 'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ঘর পূরণ করুন' : 'Please complete all required fields.');
      return;
    }

    const selectedKendra = kendras.find(k => k.id === formData.kendraId);

    const newAcc: UserAccount = {
      id: `acc-${Date.now()}`,
      name: formData.name,
      username: formData.username.trim() || formData.email.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile,
      password: formData.password,
      role: formData.role,
      kendraId: formData.kendraId,
      kendraName: selectedKendra?.name || 'Seva Kendra Node',
      districtName: formData.districtName || selectedKendra?.districtName || 'Kolkata',
      wardName: formData.wardName || selectedKendra?.wardName || 'Ward No 1',
      status: formData.status,
      createdAt: new Date().toISOString(),
      lastLogin: 'Never',
      notes: formData.notes || `Created by System Admin on ${new Date().toLocaleDateString()}`
    };

    storage.saveAccount(newAcc);
    loadData();

    // Reset Form
    setFormData({
      name: '',
      username: '',
      email: '',
      mobile: '+91 ',
      password: '',
      showFormPassword: true,
      role: 'OPERATOR',
      kendraId: currentKendra.id,
      districtName: 'Kolkata',
      wardName: 'Ward No 45',
      status: 'ACTIVE',
      notes: ''
    });

    showToast(language === 'bn' ? 'নতুন ইউজার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'New user account created successfully!');
  };

  const handleSaveEditedAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    const selectedKendra = kendras.find(k => k.id === editingAccount.kendraId);

    const updatedAcc: UserAccount = {
      ...editingAccount,
      kendraName: selectedKendra?.name || editingAccount.kendraName
    };

    storage.saveAccount(updatedAcc);
    loadData();
    setEditingAccount(null);
    showToast(language === 'bn' ? 'অ্যাকাউন্ট বিবরণ সফলভাবে আপডেট হয়েছে!' : 'Account details & credentials updated successfully!');
  };

  const handleDeleteConfirm = () => {
    if (!deletingAccount) return;
    storage.deleteAccount(deletingAccount.id);
    loadData();
    setDeletingAccount(null);
    showToast(language === 'bn' ? 'অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে!' : 'Account permanently deleted from system!');
  };

  const togglePasswordVisibility = (accId: string) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [accId]: !prev[accId]
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  // Filtering
  const filteredAccounts = accounts.filter(acc => {
    const matchesQuery = 
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.wardName && acc.wardName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.districtName && acc.districtName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'ALL' || acc.role === roleFilter;

    return matchesQuery && matchesRole;
  });

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">System Admin</span>;
      case 'DISTRICT_ADMIN':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">District Admin</span>;
      case 'KENDRA_OWNER':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">Kendra Manager</span>;
      case 'OPERATOR':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">Staff Operator</span>;
      case 'SUPERVISOR':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">Supervisor</span>;
      default:
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">Citizen</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/80 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              SYSTEM ADMIN EXCLUSIVE CONTROL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'bn' ? 'ইউজার অ্যাকাউন্ট ও পাসওয়ার্ড কন্ট্রোল' : language === 'hi' ? 'यूज़र खाता एवं क्रेडेंशियल प्रबंधन' : 'System User Account & Credential Master Desk'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            {language === 'bn' ? 'সিস্টেম অ্যাডমিন প্যানেল থেকে সমস্ত অপারেটর, কেন্দ্র ম্যানেজার এবং অ্যাডমিন অ্যাকাউন্ট তৈরি, এডিট এবং সম্পূর্ণ পাসওয়ার্ড পরিচালনা করুন।' : 'Full administrative dashboard to register new accounts, update roles, manage ward permissions, and view or reset system passwords across all personnel.'}
          </p>
        </div>

        <button 
          onClick={loadData}
          className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border border-neutral-700"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('CREATE_MANAGE')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'CREATE_MANAGE'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Tab 1: {language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি ও রূপরেখা' : 'Create & Manage Accounts'}</span>
        </button>

        <button
          onClick={() => setActiveTab('CREDENTIALS_VIEW_EDIT')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'CREDENTIALS_VIEW_EDIT'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Tab 2: {language === 'bn' ? 'সমস্ত ক্রেডেনশিয়াল ও একশন' : 'All Credentials & Account Actions'}</span>
          <span className="bg-neutral-800 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ml-1">
            {accounts.length}
          </span>
        </button>
      </div>

      {/* TAB 1: CREATE & MANAGE ACCOUNTS */}
      {activeTab === 'CREATE_MANAGE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Account Creation Form (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Create New System Account</h2>
                  <p className="text-xs text-neutral-400">Register new personnel with role permissions and ward binding.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Somenath Banerjee"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Username / Login Identifier
                  </label>
                  <input 
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="somenath.op"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="somenath@sevadesk.gov.in"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Mobile Phone Number
                  </label>
                  <input 
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+91 98300 00000"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password Generator */}
              <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    Set Account Password <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-800/80 transition-colors"
                  >
                    ⚡ Auto-Generate Password
                  </button>
                </div>

                <div className="relative">
                  <input 
                    type={formData.showFormPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter or generate strong password"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, showFormPassword: !formData.showFormPassword })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {formData.showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    System Role Privileges
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value="OPERATOR">OPERATOR (Desk Executive)</option>
                    <option value="SUPERVISOR">SUPERVISOR (Field Inspector)</option>
                    <option value="KENDRA_OWNER">KENDRA_OWNER (Kendra Manager)</option>
                    <option value="DISTRICT_ADMIN">DISTRICT_ADMIN (District Level)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (System Admin)</option>
                    <option value="CITIZEN">CITIZEN (Self-Service View)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-bold text-emerald-400"
                  >
                    <option value="ACTIVE">ACTIVE (Authorized Access)</option>
                    <option value="SUSPENDED">SUSPENDED (Temporarily Blocked)</option>
                    <option value="INACTIVE">INACTIVE (Deactivated)</option>
                  </select>
                </div>
              </div>

              {/* Kendra & Ward Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Assigned Kendra</label>
                  <select
                    value={formData.kendraId}
                    onChange={(e) => setFormData({ ...formData, kendraId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {kendras.map(k => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">District Name</label>
                  <input 
                    type="text"
                    value={formData.districtName}
                    onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                    placeholder="Kolkata"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Ward / Panchayat</label>
                  <input 
                    type="text"
                    value={formData.wardName}
                    onChange={(e) => setFormData({ ...formData, wardName: e.target.value })}
                    placeholder="Ward No 45"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-amber-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Internal Notes / Designation</label>
                <input 
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Counter #2 Senior Operator handling Certificate Verification"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create System Account & Grant Access</span>
                </button>
              </div>

            </form>
          </div>

          {/* Quick Overview & Accounts Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  TOTAL REGISTERED ACCOUNTS
                </span>
                <div className="text-3xl font-black text-white">{accounts.length}</div>
                <span className="text-[11px] text-emerald-400 font-bold mt-1 block">Active in Database</span>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  ACTIVE OPERATORS
                </span>
                <div className="text-3xl font-black text-amber-400">
                  {accounts.filter(a => a.role === 'OPERATOR').length}
                </div>
                <span className="text-[11px] text-neutral-400 font-medium mt-1 block">Desk Executives</span>
              </div>
            </div>

            {/* Role Distribution Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Account Role Breakdown</span>
              </h3>

              <div className="space-y-2.5">
                {[
                  { role: 'SUPER_ADMIN', label: 'System Admin', count: accounts.filter(a => a.role === 'SUPER_ADMIN').length, color: 'bg-rose-500' },
                  { role: 'DISTRICT_ADMIN', label: 'District Admin', count: accounts.filter(a => a.role === 'DISTRICT_ADMIN').length, color: 'bg-amber-500' },
                  { role: 'KENDRA_OWNER', label: 'Kendra Owner / Manager', count: accounts.filter(a => a.role === 'KENDRA_OWNER').length, color: 'bg-purple-500' },
                  { role: 'OPERATOR', label: 'Staff Operator', count: accounts.filter(a => a.role === 'OPERATOR').length, color: 'bg-emerald-500' },
                  { role: 'SUPERVISOR', label: 'Field Supervisor', count: accounts.filter(a => a.role === 'SUPERVISOR').length, color: 'bg-cyan-500' },
                  { role: 'CITIZEN', label: 'Citizen Portal User', count: accounts.filter(a => a.role === 'CITIZEN').length, color: 'bg-neutral-500' }
                ].map(item => (
                  <div key={item.role} className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-neutral-300 font-semibold">{item.label}</span>
                    </div>
                    <span className="font-mono font-bold text-white bg-neutral-800 px-2 py-0.5 rounded-lg">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-br from-amber-950/40 to-neutral-900 border border-amber-800/50 rounded-[2.5rem] p-6 text-xs text-amber-200/90 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Switch to Tab 2 for Credentials & Editing</span>
              </div>
              <p className="leading-relaxed">
                Click on Tab 2 above ("All Credentials & Account Actions") to reveal password credentials, edit user information, adjust ward bindings, or delete accounts.
              </p>
              <button
                onClick={() => setActiveTab('CREDENTIALS_VIEW_EDIT')}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-md shadow-amber-600/20"
              >
                Go to Tab 2: Credentials & Actions Table →
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ALL CREDENTIALS & ACCOUNT ACTIONS */}
      {activeTab === 'CREDENTIALS_VIEW_EDIT' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, ward..."
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-2xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-neutral-400 shrink-0">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs font-bold rounded-2xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Roles ({accounts.length})</option>
                <option value="SUPER_ADMIN">System Admin</option>
                <option value="DISTRICT_ADMIN">District Admin</option>
                <option value="KENDRA_OWNER">Kendra Owner</option>
                <option value="OPERATOR">Operator</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="CITIZEN">Citizen</option>
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="p-4 pl-6">User & Role</th>
                    <th className="p-4">Login Email / Username</th>
                    <th className="p-4">Password Credential</th>
                    <th className="p-4">Ward / Kendra</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Actions (View / Edit / Delete)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-medium">
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-500">
                        No system accounts match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((acc) => {
                      const isShowPassword = showPasswordMap[acc.id] || false;
                      return (
                        <tr key={acc.id} className="hover:bg-neutral-800/30 transition-colors">
                          
                          {/* User & Role */}
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-2xl bg-indigo-950 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-800 shrink-0">
                                {acc.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm">{acc.name}</div>
                                <div className="mt-0.5">{getRoleBadge(acc.role)}</div>
                              </div>
                            </div>
                          </td>

                          {/* Email & Mobile */}
                          <td className="p-4">
                            <div className="text-neutral-200 font-bold">{acc.email}</div>
                            <div className="text-neutral-400 text-[11px] font-mono mt-0.5">{acc.mobile || 'No phone'}</div>
                          </td>

                          {/* Password Credential with Eye Toggle */}
                          <td className="p-4">
                            <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 inline-flex">
                              <span className="font-mono text-amber-300 text-xs font-bold">
                                {isShowPassword ? acc.password : '••••••••'}
                              </span>
                              
                              <button
                                onClick={() => togglePasswordVisibility(acc.id)}
                                className="p-1 text-neutral-400 hover:text-white transition-colors"
                                title={isShowPassword ? "Hide Password" : "View Password"}
                              >
                                {isShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => copyToClipboard(acc.password, "Password")}
                                className="p-1 text-neutral-400 hover:text-amber-400 transition-colors"
                                title="Copy Password"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="p-4">
                            <div className="text-neutral-300 font-bold">{acc.wardName || 'Ward N/A'}</div>
                            <div className="text-neutral-500 text-[11px]">{acc.districtName || 'District N/A'}</div>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {acc.status === 'ACTIVE' ? (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                                ACTIVE
                              </span>
                            ) : acc.status === 'SUSPENDED' ? (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800">
                                SUSPENDED
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800">
                                INACTIVE
                              </span>
                            )}
                          </td>

                          {/* Actions: View / Edit / Delete */}
                          <td className="p-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* VIEW */}
                              <button
                                onClick={() => setViewingAccount(acc)}
                                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition-all"
                                title="View Complete Account Details"
                              >
                                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                              </button>

                              {/* EDIT */}
                              <button
                                onClick={() => setEditingAccount({ ...acc })}
                                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition-all"
                                title="Edit Account & Credentials"
                              >
                                <Pencil className="w-3.5 h-3.5 text-amber-400" />
                              </button>

                              {/* DELETE */}
                              <button
                                onClick={() => setDeletingAccount(acc)}
                                className="p-2 bg-neutral-800 hover:bg-rose-950 text-rose-400 hover:text-rose-300 rounded-xl transition-all border border-transparent hover:border-rose-800"
                                title="Delete Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* VIEW ACCOUNT DETAILS MODAL */}
      {viewingAccount && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setViewingAccount(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl">
                {viewingAccount.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 block">
                  ACCOUNT DOSSIER
                </span>
                <h3 className="text-xl font-black text-white">{viewingAccount.name}</h3>
                <p className="text-xs text-neutral-400">{viewingAccount.email}</p>
              </div>
            </div>

            <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-xs">
              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-500 font-bold">System Role:</span>
                <div>{getRoleBadge(viewingAccount.role)}</div>
              </div>
              
              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-500 font-bold">Username Login:</span>
                <span className="text-neutral-200 font-mono font-bold">{viewingAccount.username}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-500 font-bold">Account Password:</span>
                <span className="text-amber-300 font-mono font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  {viewingAccount.password}
                </span>
              </div>

              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-500 font-bold">Mobile Phone:</span>
                <span className="text-neutral-200 font-mono">{viewingAccount.mobile || 'N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-500 font-bold">Assigned Ward:</span>
                <span className="text-amber-300 font-bold">{viewingAccount.wardName || 'Ward N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-500 font-bold">District:</span>
                <span className="text-neutral-300 font-bold">{viewingAccount.districtName || 'N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-500 font-bold">Seva Kendra Node:</span>
                <span className="text-neutral-300">{viewingAccount.kendraName || 'Default Center'}</span>
              </div>

              <div className="flex justify-between pb-1">
                <span className="text-neutral-500 font-bold">Created Timestamp:</span>
                <span className="text-neutral-400 font-mono text-[11px]">{new Date(viewingAccount.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {viewingAccount.notes && (
              <div className="p-3 bg-neutral-800/40 rounded-xl text-xs text-neutral-300 border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Notes / Description</span>
                {viewingAccount.notes}
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  setEditingAccount({ ...viewingAccount });
                  setViewingAccount(null);
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-3 rounded-2xl transition-colors"
              >
                Edit Account Details
              </button>
              <button
                onClick={() => setViewingAccount(null)}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-3 rounded-2xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT ACCOUNT MODAL */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
            
            <button
              onClick={() => setEditingAccount(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 block">
                  SYSTEM ADMIN EDIT
                </span>
                <h3 className="text-xl font-black text-white">Edit Account & Credentials</h3>
              </div>
            </div>

            <form onSubmit={handleSaveEditedAccount} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Full Name</label>
                <input 
                  type="text"
                  value={editingAccount.name}
                  onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Login Email</label>
                  <input 
                    type="email"
                    value={editingAccount.email}
                    onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Mobile Phone</label>
                  <input 
                    type="text"
                    value={editingAccount.mobile}
                    onChange={(e) => setEditingAccount({ ...editingAccount, mobile: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">Password Credential</label>
                <input 
                  type="text"
                  value={editingAccount.password}
                  onChange={(e) => setEditingAccount({ ...editingAccount, password: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-amber-300 font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Role Privilege</label>
                  <select
                    value={editingAccount.role}
                    onChange={(e) => setEditingAccount({ ...editingAccount, role: e.target.value as Role })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-white font-bold"
                  >
                    <option value="OPERATOR">OPERATOR</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="KENDRA_OWNER">KENDRA_OWNER</option>
                    <option value="DISTRICT_ADMIN">DISTRICT_ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="CITIZEN">CITIZEN</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Account Status</label>
                  <select
                    value={editingAccount.status}
                    onChange={(e) => setEditingAccount({ ...editingAccount, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-white font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Ward Name</label>
                  <input 
                    type="text"
                    value={editingAccount.wardName || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, wardName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-amber-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">District Name</label>
                  <input 
                    type="text"
                    value={editingAccount.districtName || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, districtName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-3 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-3 rounded-2xl transition-colors shadow-lg shadow-amber-600/30"
                >
                  Save & Update Account
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {deletingAccount && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-3xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Delete User Account?</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Are you sure you want to permanently delete <strong className="text-white">{deletingAccount.name}</strong> ({deletingAccount.email})? This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setDeletingAccount(null)}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-3 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 rounded-2xl transition-colors shadow-lg shadow-rose-600/30"
              >
                Permanently Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
