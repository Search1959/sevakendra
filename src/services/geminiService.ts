import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const env = (import.meta as any).env || {};
    const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

export async function askSevaAssistant(
  prompt: string, 
  language: 'en' | 'bn' = 'en',
  contextData?: string
): Promise<string> {
  const disclaimer = language === 'bn' 
    ? "\n\n[বিশেষ দ্রষ্টব্য: এই তথ্যটি অনুমান ভিত্তিক নির্দেশিকা। চূড়ান্ত সিদ্ধান্ত সংশ্লিষ্ট সরকারি দপ্তর দ্বারা নেওয়া হবে।]"
    : "\n\n[Disclaimer: This response is for guidance purposes based on verified scheme parameters. Final eligibility and approvals rest with the concerned government department.]";

  try {
    const client = getAiClient();
    if (client) {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are Seva Desk AI, an expert citizen-assistance AI assistant for Seva Kendras in West Bengal, India.
Language to respond in: ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
System Context: ${contextData || 'Seva Desk handles Lakshmir Bhandar, Swasthya Sathi, Caste Certificate, Ration Card, e-District Income Certificate, Krishak Bandhu, Kanyashree, etc.'}

User Question: ${prompt}

Guidelines:
1. Provide concise, clear, polite guidance.
2. Clearly mention required documents, fee breakdown (Govt vs Assistance fee), and process steps.
3. NEVER fabricate government policies or false eligibility promises.
4. If official information is uncertain, direct the user to the official department portal.`
      });

      if (response && response.text) {
        return response.text + disclaimer;
      }
    }
  } catch (err) {
    console.warn("Gemini API not available or error occurred, using local rule-based advisor fallback:", err);
  }

  // Smart Fallback Response System when API key is unconfigured or offline
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('lakshmir') || lowerPrompt.includes('লক্ষ্মী') || lowerPrompt.includes('bhandar')) {
    return language === 'bn'
      ? `লক্ষ্মীর ভান্ডার প্রকল্পের জন্য আবশ্যক তথ্য:\n\n১. বয়স: ২৫ থেকে ৬০ বছর বয়সী মহিলা (পশ্চিমবঙ্গের স্থায়ী বাসিন্দা)।\n২. প্রয়োজনীয় নথি: আধার কার্ড, স্বাস্থ্য সাথী কার্ড, ব্যাঙ্ক পাসবই কপি, পাসপোর্ট ছবি, SC/ST সার্টিফিকেট (প্রযোজ্য হলে)।\n৩. সুবিধা: সাধারণ শ্রেণীতে মাসিক ₹১,০০০ এবং SC/ST শ্রেনীতে মাসিক ₹১,২০০।\n৪. সরকারি ফি: ₹০ (বিনামূল্যে)। সেবাকেন্দ্র সহায়তা ফি: ₹৫০।` + disclaimer
      : `Lakshmir Bhandar Scheme Key Information:\n\n1. Age Criteria: Resident females aged 25 to 60 years in West Bengal.\n2. Documents Required: Aadhaar Card, Swasthya Sathi Card, Bank Passbook, Passport Photo, SC/ST Certificate (if applicable).\n3. Benefits: ₹1,000/month for General, ₹1,200/month for SC/ST.\n4. Govt Fee: ₹0. Kendra Assistance Fee: ₹50.`;
  }

  if (lowerPrompt.includes('swasthya') || lowerPrompt.includes('স্বাস্থ্য')) {
    return language === 'bn'
      ? `স্বাস্থ্য সাথী কার্ড সংক্রান্ত তথ্য:\n\n১. সুবিধা: পরিবার পিছু প্রতি বছর ₹৫ লক্ষ টাকার বিনামূল্যে ক্যাশলেস হাসপাতাল চিকিৎসা।\n২. নথি: পরিবারের সকলের আধার কার্ড, রেশন কার্ড, ও প্রধান মহিলার ছবি।\n৩. আবেদন প্রক্রিয়া: সেবা কেন্দ্রে বা স্থানীয় দুয়ারে সরকার ক্যাম্পে জমা দেওয়া যায়।` + disclaimer
      : `Swasthya Sathi Scheme Overview:\n\n1. Benefits: Cashless health insurance cover up to ₹5 Lakhs per family per year.\n2. Primary Cardholder: Senior-most female family member.\n3. Documents Required: Aadhaar Card of all family members, Ration Card, Mobile number.`;
  }

  if (lowerPrompt.includes('caste') || lowerPrompt.includes('জাতিগত') || lowerPrompt.includes('obc') || lowerPrompt.includes('sc')) {
    return language === 'bn'
      ? `জাতিগত শংসাপত্র (SC / ST / OBC) আবেদনের নিয়মাবলী:\n\n১. প্রয়োজনীয় নথি: রক্ত সম্পর্কের নিজস্ব আত্মীয়ের কাস্ট সার্টিফিকেট, পঞ্চায়েত/কাউন্সিলর সার্টিফিকেট, অভিভাবকের ভোটার কার্ড, আধার কার্ড, ও শিক্ষা সংক্রান্ত সংশাপত্র।\n২. আনুমানিক সময়: ২৫-৩০ দিন।` + disclaimer
      : `Caste Certificate Application Guidelines:\n\n1. Documents Needed: Blood relation caste certificate, Aadhaar card, Parent Voter ID, Birth Certificate/Admit Card, Photos.\n2. Processing Time: ~30 days. Assistance Fee: ₹100.`;
  }

  return language === 'bn'
    ? `সেবা ডেস্কে আপনাকে স্বাগত! আপনার প্রশ্নটি পেয়েছি। লক্ষ্মীর ভান্ডার, স্বাস্থ্য সাথী, রেশন কার্ড বা ডিজিটাল সার্ভিস সংক্রান্ত কোনো তথ্য জানতে বা আবেদনের নথির তালিকা দেখতে ড্যাশবোর্ডের সার্ভিস ক্যাটালগ ও স্কিম ফাইন্ডার ব্যবহার করুন।` + disclaimer
    : `Welcome to Seva Desk Assistant! I can help you with scheme eligibility rules, required document checklists, and application processes for West Bengal government services. Please use the Scheme Finder or Service Catalogue for specific services.`;
}
