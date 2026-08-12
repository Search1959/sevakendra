import { 
  SevaKendra, 
  Citizen, 
  ServiceItem, 
  GovernmentScheme, 
  SevaApplication, 
  QueueToken, 
  Appointment, 
  PaymentRecord, 
  NotificationLog, 
  AuditLogItem, 
  FeedbackItem,
  SystemUser,
  UserAccount,
  Role
} from '../types';

import { 
  INITIAL_KENDRAS, 
  INITIAL_SERVICES, 
  INITIAL_SCHEMES, 
  INITIAL_CITIZENS, 
  INITIAL_APPLICATIONS, 
  INITIAL_TOKENS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS,
  SYSTEM_USERS,
  INITIAL_ACCOUNTS 
} from '../data/initialData';

const STORAGE_KEYS = {
  KENDRAS: 'sevadesk_kendras',
  SERVICES: 'sevadesk_services',
  SCHEMES: 'sevadesk_schemes',
  CITIZENS: 'sevadesk_citizens',
  APPLICATIONS: 'sevadesk_applications',
  TOKENS: 'sevadesk_tokens',
  APPOINTMENTS: 'sevadesk_appointments',
  PAYMENTS: 'sevadesk_payments',
  NOTIFICATIONS: 'sevadesk_notifications',
  AUDIT_LOGS: 'sevadesk_audit_logs',
  FEEDBACKS: 'sevadesk_feedbacks',
  CURRENT_KENDRA: 'sevadesk_current_kendra',
  CURRENT_USER: 'sevadesk_current_user',
  OFFLINE_QUEUE: 'sevadesk_offline_queue',
  ACCOUNTS: 'sevadesk_accounts'
};

export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
}

class StorageService {
  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.KENDRAS)) {
      localStorage.setItem(STORAGE_KEYS.KENDRAS, JSON.stringify(INITIAL_KENDRAS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHEMES)) {
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(INITIAL_SCHEMES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CITIZENS)) {
      localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(INITIAL_CITIZENS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TOKENS)) {
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(INITIAL_TOKENS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_KENDRA)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_KENDRA, JSON.stringify(INITIAL_KENDRAS[0]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SYSTEM_USERS[1])); // Operator by default
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
    }
  }

  // System User Accounts
  getAccounts(): UserAccount[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || JSON.stringify(INITIAL_ACCOUNTS));
  }
  saveAccounts(accounts: UserAccount[]): void {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }
  saveAccount(account: UserAccount): UserAccount {
    const list = this.getAccounts();
    const idx = list.findIndex(a => a.id === account.id || a.username.toLowerCase() === account.username.toLowerCase());
    if (idx >= 0) {
      list[idx] = account;
    } else {
      list.unshift(account);
    }
    this.saveAccounts(list);
    this.addAuditLog('USER_ACCOUNT_SAVED', 'UserAccount', account.id, `Created/Updated account for ${account.name} (${account.role})`);
    return account;
  }
  deleteAccount(id: string): void {
    const list = this.getAccounts().filter(a => a.id !== id);
    this.saveAccounts(list);
    this.addAuditLog('USER_ACCOUNT_DELETED', 'UserAccount', id, `Deleted account ID ${id}`);
  }

  // Kendras
  getKendras(): SevaKendra[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.KENDRAS) || '[]');
  }
  getCurrentKendra(): SevaKendra {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_KENDRA) || JSON.stringify(INITIAL_KENDRAS[0]));
  }
  setCurrentKendra(kendra: SevaKendra): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_KENDRA, JSON.stringify(kendra));
  }

  // Users & Role
  getCurrentUser(): SystemUser {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(SYSTEM_USERS[1]));
  }
  setCurrentUser(user: SystemUser): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  // Citizens
  getCitizens(): Citizen[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CITIZENS) || '[]');
  }
  saveCitizen(citizen: Citizen): Citizen {
    const list = this.getCitizens();
    const existingIndex = list.findIndex(c => c.id === citizen.id);
    if (existingIndex >= 0) {
      list[existingIndex] = citizen;
    } else {
      list.unshift(citizen);
    }
    localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(list));
    this.addAuditLog('CITIZEN_UPDATED', 'Citizen', citizen.citizenId, `Saved/Updated ${citizen.fullName} (${citizen.mobile})`);
    return citizen;
  }
  deleteCitizen(id: string): void {
    const list = this.getCitizens().filter(c => c.id !== id && c.citizenId !== id);
    localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(list));
    this.addAuditLog('CITIZEN_DELETED', 'Citizen', id, `Deleted citizen ID ${id}`);
  }
  importCitizensBulk(citizens: Citizen[]): number {
    const existing = this.getCitizens();
    const mergedMap = new Map<string, Citizen>();
    existing.forEach(c => mergedMap.set(c.id, c));
    citizens.forEach(c => mergedMap.set(c.id, c));
    const merged = Array.from(mergedMap.values());
    localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(merged));
    this.addAuditLog('CITIZENS_BULK_IMPORTED', 'Citizen', 'bulk', `Imported ${citizens.length} citizens`);
    return merged.length;
  }

  // Services
  getServices(): ServiceItem[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
  }
  saveService(service: ServiceItem): ServiceItem {
    const list = this.getServices();
    const idx = list.findIndex(s => s.id === service.id);
    if (idx >= 0) list[idx] = service;
    else list.unshift(service);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
    this.addAuditLog('SERVICE_SAVED', 'ServiceItem', service.id, `Saved service ${service.nameEn}`);
    return service;
  }
  deleteService(id: string): void {
    const list = this.getServices().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
    this.addAuditLog('SERVICE_DELETED', 'ServiceItem', id, `Deleted service ID ${id}`);
  }
  importServicesBulk(services: ServiceItem[]): void {
    const existing = this.getServices();
    const mergedMap = new Map<string, ServiceItem>();
    existing.forEach(s => mergedMap.set(s.id, s));
    services.forEach(s => mergedMap.set(s.id, s));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(Array.from(mergedMap.values())));
  }

  // Schemes
  getSchemes(): GovernmentScheme[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEMES) || '[]');
  }
  saveScheme(scheme: GovernmentScheme): GovernmentScheme {
    const list = this.getSchemes();
    const idx = list.findIndex(s => s.id === scheme.id);
    if (idx >= 0) list[idx] = scheme;
    else list.unshift(scheme);
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
    this.addAuditLog('SCHEME_SAVED', 'GovernmentScheme', scheme.id, `Saved scheme ${scheme.schemeName}`);
    return scheme;
  }
  deleteScheme(id: string): void {
    const list = this.getSchemes().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
    this.addAuditLog('SCHEME_DELETED', 'GovernmentScheme', id, `Deleted scheme ID ${id}`);
  }

  // Applications
  getApplications(): SevaApplication[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
  }
  getApplicationBySevaId(sevaId: string): SevaApplication | undefined {
    return this.getApplications().find(a => a.sevaId.toUpperCase() === sevaId.toUpperCase().trim());
  }
  saveApplication(app: SevaApplication): SevaApplication {
    const list = this.getApplications();
    const idx = list.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      list[idx] = app;
    } else {
      list.unshift(app);
    }
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
    this.addAuditLog('APPLICATION_UPDATED', 'SevaApplication', app.sevaId, `Status updated to ${app.status}`);
    return app;
  }
  deleteApplication(id: string): void {
    const list = this.getApplications().filter(a => a.id !== id && a.sevaId !== id);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
    this.addAuditLog('APPLICATION_DELETED', 'SevaApplication', id, `Deleted application ${id}`);
  }
  importApplicationsBulk(apps: SevaApplication[]): void {
    const existing = this.getApplications();
    const mergedMap = new Map<string, SevaApplication>();
    existing.forEach(a => mergedMap.set(a.id, a));
    apps.forEach(a => mergedMap.set(a.id, a));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(Array.from(mergedMap.values())));
  }

  // Tokens
  getTokens(): QueueToken[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TOKENS) || '[]');
  }
  saveToken(token: QueueToken): QueueToken {
    const list = this.getTokens();
    const idx = list.findIndex(t => t.id === token.id);
    if (idx >= 0) list[idx] = token;
    else list.unshift(token);
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(list));
    return token;
  }
  deleteToken(id: string): void {
    const list = this.getTokens().filter(t => t.id !== id && t.tokenNumber !== id);
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(list));
  }

  // Appointments
  getAppointments(): Appointment[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
  }
  saveAppointment(apt: Appointment): Appointment {
    const list = this.getAppointments();
    const idx = list.findIndex(a => a.id === apt.id);
    if (idx >= 0) list[idx] = apt;
    else list.unshift(apt);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    return apt;
  }
  deleteAppointment(id: string): void {
    const list = this.getAppointments().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
  }

  // Payments
  getPayments(): PaymentRecord[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
  }
  savePayment(payment: PaymentRecord): PaymentRecord {
    const list = this.getPayments();
    const idx = list.findIndex(p => p.id === payment.id);
    if (idx >= 0) list[idx] = payment;
    else list.unshift(payment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
    this.addAuditLog('PAYMENT_RECEIVED', 'PaymentRecord', payment.receiptNumber, `Amount ₹${payment.total} (${payment.paymentMethod})`);
    return payment;
  }
  deletePayment(id: string): void {
    const list = this.getPayments().filter(p => p.id !== id && p.receiptNumber !== id);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
  }

  // Kendras
  saveKendra(kendra: SevaKendra): SevaKendra {
    const list = this.getKendras();
    const idx = list.findIndex(k => k.id === kendra.id);
    if (idx >= 0) list[idx] = kendra;
    else list.unshift(kendra);
    localStorage.setItem(STORAGE_KEYS.KENDRAS, JSON.stringify(list));
    return kendra;
  }
  deleteKendra(id: string): void {
    const list = this.getKendras().filter(k => k.id !== id);
    localStorage.setItem(STORAGE_KEYS.KENDRAS, JSON.stringify(list));
  }

  // Notifications
  getNotifications(): any[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  }
  addNotification(log: any): any {
    const list = this.getNotifications();
    list.unshift(log);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return log;
  }
  saveNotification(log: any): any {
    return this.addNotification(log);
  }

  // Audit Logs
  getAuditLogs(): AuditLogItem[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
  }
  addAuditLog(action: string, entity: string, entityId: string, details: string): void {
    const user = this.getCurrentUser();
    const list = this.getAuditLogs();
    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      role: user.role,
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString(),
      details
    };
    list.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(list));
  }

  // Offline Sync Queue
  getOfflineQueue(): OfflineAction[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || '[]');
  }
  enqueueOfflineAction(actionType: string, payload: any): void {
    const queue = this.getOfflineQueue();
    queue.push({
      id: `off-${Date.now()}`,
      type: actionType,
      payload,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  }
  clearOfflineQueue(): void {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
  }
}

export const storage = new StorageService();
