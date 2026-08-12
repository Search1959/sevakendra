import React, { useState } from 'react';
import { 
  IndianRupee, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  QrCode, 
  X,
  CreditCard,
  Wallet
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { PaymentRecord, SevaKendra } from '../types';
import { storage } from '../services/storage';

interface PaymentsViewProps {
  language: Language;
  currentKendra: SevaKendra;
  initialShowCollect?: boolean;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  language,
  currentKendra,
  initialShowCollect = false
}) => {
  const t = translations[language];
  const [payments, setPayments] = useState<PaymentRecord[]>(storage.getPayments().filter(p => p.kendraId === currentKendra.id));
  const [showCollectModal, setShowCollectModal] = useState(initialShowCollect);
  const [showReceipt, setShowReceipt] = useState<PaymentRecord | null>(null);

  // Form
  const [sevaId, setSevaId] = useState('SEVA-2026-000184');
  const [citizenName, setCitizenName] = useState('Anjali Das');
  const [assistanceFee, setAssistanceFee] = useState<number>(50);
  const [printingFee, setPrintingFee] = useState<number>(10);
  const [scanningFee, setScanningFee] = useState<number>(10);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Other'>('UPI');

  const totalToday = payments.reduce((acc, p) => acc + p.total, 0);
  const totalAssistance = payments.reduce((acc, p) => acc + p.assistanceFee, 0);
  const totalPrintScan = payments.reduce((acc, p) => acc + (p.printingFee + p.scanningFee), 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(assistanceFee) + Number(printingFee) + Number(scanningFee);

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      applicationId: `app-${Date.now()}`,
      sevaId,
      citizenName,
      govtFee: 0,
      assistanceFee: Number(assistanceFee),
      printingFee: Number(printingFee),
      scanningFee: Number(scanningFee),
      total,
      paymentMethod,
      paymentStatus: 'PAID',
      receiptNumber: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      kendraId: currentKendra.id,
      operatorName: 'Rajesh Mukherjee',
      createdAt: new Date().toISOString()
    };

    storage.savePayment(newPayment);
    setPayments(storage.getPayments().filter(p => p.kendraId === currentKendra.id));
    setShowCollectModal(false);
    setShowReceipt(newPayment);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 block mb-1">
            {language === 'bn' ? 'আর্থিক হিসাব ও ক্যাশ কালেকশন' : 'Daily Cash & Collection'}
          </span>
          <h1 className="text-2xl font-black text-white">
            {language === 'bn' ? 'ফি ও সার্ভিস কালেকশন' : 'Payments & Daily Cash Book'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn' ? 'সেবা ফি, প্রিন্টিং ও স্ক্যানিং ফির স্বচ্ছ রসিদ সংগ্রাহক।' : 'Track Kendra revenue, service charges, scanning/printing fees and issue receipts.'}
          </p>
        </div>

        <button 
          onClick={() => setShowCollectModal(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.dash_btn_collectPayment}</span>
        </button>
      </div>

      {/* Financial Summary Bento Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest block mb-1">Total Collection Today</span>
          <span className="text-3xl font-mono font-black text-emerald-400 tabular-nums">₹{totalToday}</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest block mb-1">Assistance Service Fees</span>
          <span className="text-3xl font-mono font-black text-indigo-400 tabular-nums">₹{totalAssistance}</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest block mb-1">Printing & Scanning Fees</span>
          <span className="text-3xl font-mono font-black text-amber-400 tabular-nums">₹{totalPrintScan}</span>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-2xl">Receipt No</th>
                <th className="p-3.5">Seva ID</th>
                <th className="p-3.5">Citizen Name</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5 rounded-r-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-amber-400">{p.receiptNumber}</td>
                  <td className="p-3.5 font-mono text-indigo-400">{p.sevaId}</td>
                  <td className="p-3.5 font-bold text-white">{p.citizenName}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-400">₹{p.total}</td>
                  <td className="p-3.5 text-right">
                    <button 
                      onClick={() => setShowReceipt(p)}
                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl"
                      title="View Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Collect Payment & Print Receipt</h3>
              <button onClick={() => setShowCollectModal(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">SEVA ID</label>
                <input 
                  type="text"
                  value={sevaId}
                  onChange={(e) => setSevaId(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Citizen Name</label>
                <input 
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Assistance Fee</label>
                  <input 
                    type="number"
                    value={assistanceFee}
                    onChange={(e) => setAssistanceFee(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Printing Fee</label>
                  <input 
                    type="number"
                    value={printingFee}
                    onChange={(e) => setPrintingFee(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Scanning Fee</label>
                  <input 
                    type="number"
                    value={scanningFee}
                    onChange={(e) => setScanningFee(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div className="p-3 bg-neutral-800 rounded-xl font-bold text-amber-300 text-sm flex justify-between">
                <span>Total Payable:</span>
                <span>₹{Number(assistanceFee) + Number(printingFee) + Number(scanningFee)}</span>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCollectModal(false)} className="px-4 py-2 bg-neutral-800 text-neutral-300 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                  Collect & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-base">SEVA DESK RECEIPT</h3>
              <button onClick={() => setShowReceipt(null)} className="p-1 text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 font-mono text-xs space-y-2 text-neutral-300">
              <div className="text-center font-bold text-amber-400 text-sm pb-2 border-b border-neutral-800">
                {showReceipt.receiptNumber}
              </div>
              <div className="flex justify-between">
                <span>SEVA ID:</span>
                <span className="font-bold text-white">{showReceipt.sevaId}</span>
              </div>
              <div className="flex justify-between">
                <span>Citizen:</span>
                <span className="font-bold text-white">{showReceipt.citizenName}</span>
              </div>
              <div className="flex justify-between">
                <span>Assistance Fee:</span>
                <span>₹{showReceipt.assistanceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Print & Scan:</span>
                <span>₹{showReceipt.printingFee + showReceipt.scanningFee}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-800 font-bold text-emerald-400 text-sm">
                <span>Total Paid ({showReceipt.paymentMethod}):</span>
                <span>₹{showReceipt.total}</span>
              </div>
            </div>

            <button 
              onClick={() => window.print()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
