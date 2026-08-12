import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink, 
  PhoneCall, 
  FileCheck2,
  RefreshCw,
  Tag,
  Award,
  HeartHandshake
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { GovernmentScheme, SocialCategory, Religion, RationCardType, MaritalStatus } from '../types';
import { storage } from '../services/storage';

interface SchemeFinderProps {
  language: Language;
  onApplyForScheme?: (scheme: GovernmentScheme) => void;
}

export const SchemeFinderView: React.FC<SchemeFinderProps> = ({
  language,
  onApplyForScheme
}) => {
  const t = translations[language];
  const schemes = storage.getSchemes();

  // Wizard State
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [category, setCategory] = useState<SocialCategory>('SC');
  const [religion, setReligion] = useState<Religion>('Hinduism');
  const [rationCardType, setRationCardType] = useState<RationCardType>('SPHH');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Married');
  const [isDivyangjan, setIsDivyangjan] = useState<boolean>(false);
  const [occupation, setOccupation] = useState<string>('Homemaker');
  const [income, setIncome] = useState<number>(80000);
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [isFarmer, setIsFarmer] = useState<boolean>(false);
  const [urbanRural, setUrbanRural] = useState<'Urban' | 'Rural'>('Urban');

  const [hasEvaluated, setHasEvaluated] = useState<boolean>(true);

  // Matching Engine Algorithm
  const evaluateSchemes = () => {
    const isMinority = ['Islam', 'Christianity', 'Sikhism', 'Buddhism', 'Jainism'].includes(religion);

    return schemes.map(sch => {
      let score = 0;
      let reasons: string[] = [];
      let missingCriteria: string[] = [];

      const rules = sch.eligibilityRules;

      // Age check
      if (rules.minAge) {
        if (age >= rules.minAge) {
          score += 2;
          reasons.push(language === 'bn' ? `বয়সের শর্ত পূরণ (নূন্যতম ${rules.minAge} বছর)` : `Meets age criteria (Min ${rules.minAge} yrs)`);
        } else {
          score -= 3;
          missingCriteria.push(language === 'bn' ? `বয়স অন্তত ${rules.minAge} বছর হতে হবে (বর্তমান ${age})` : `Must be at least ${rules.minAge} yrs old (Current: ${age})`);
        }
      }

      if (rules.maxAge) {
        if (age <= rules.maxAge) {
          score += 1;
        } else {
          score -= 3;
          missingCriteria.push(language === 'bn' ? `সর্বোচ্চ বয়স ${rules.maxAge} বছর` : `Max age limit is ${rules.maxAge} yrs`);
        }
      }

      // Gender check
      if (rules.femaleOnly) {
        if (gender === 'Female') {
          score += 3;
          reasons.push(language === 'bn' ? 'মহিলা আবেদনকারী' : 'Female applicant match');
        } else {
          score -= 5;
          missingCriteria.push(language === 'bn' ? 'শুধুমাত্র মহিলাদের জন্য প্রযোজ্য' : 'Female applicants only');
        }
      }

      // Social Category (SC / ST / OBC) Check
      if (category === 'SC' || category === 'ST') {
        if (sch.schemeName.toLowerCase().includes('lakshmir') || sch.schemeName.toLowerCase().includes('bhandar')) {
          score += 4;
          reasons.push(language === 'bn' ? `SC/ST আবেদনকারী: সর্বোচ্চ ₹১,২০০/মাস ভাতা পাবেন` : `SC/ST category applicant: Higher ₹1,200/mo allowance eligibility`);
        } else {
          score += 1;
          reasons.push(language === 'bn' ? `সামাজিক শ্রেণী: ${category} আবেদনকারী` : `Social Category: ${category} match`);
        }
      }

      // Minority Community Check
      if (rules.minorityOnly || sch.schemeName.toLowerCase().includes('aikyashree') || sch.schemeName.toLowerCase().includes('minority')) {
        if (isMinority) {
          score += 5;
          reasons.push(language === 'bn' ? `সংখ্যালঘু সম্প্রদায় (${religion}) শিক্ষার্থী/আবেদনকারী` : `Minority community (${religion}) applicant match`);
        } else if (rules.minorityOnly) {
          score -= 5;
          missingCriteria.push(language === 'bn' ? 'শুধুমাত্র সংখ্যালঘু সম্প্রদায়ের জন্য (মুসলিম, খ্রিষ্টান, শিখ, বৌদ্ধ, জৈন)' : 'Minority community applicants only');
        }
      }

      // Divyangjan / Disability Check
      if (rules.disabilityOnly || sch.schemeName.toLowerCase().includes('manabik') || sch.schemeName.toLowerCase().includes('disability')) {
        if (isDivyangjan) {
          score += 5;
          reasons.push(language === 'bn' ? 'মানবিক ভাতা (প্রতিবন্ধী/দিব্যাঙ্গজন ৪০%+ ম্যাচ)' : 'Divyangjan / Disability 40%+ match for Manabik Pension');
        } else if (rules.disabilityOnly) {
          score -= 5;
          missingCriteria.push(language === 'bn' ? '৪০% বা তার বেশি প্রতিবন্ধী সংশাপত্র আবশ্যক' : 'Requires 40%+ Disability Certificate');
        }
      }

      // Widowed Check
      if (rules.widowOnly || sch.schemeName.toLowerCase().includes('widow')) {
        if (maritalStatus === 'Widowed') {
          score += 5;
          reasons.push(language === 'bn' ? 'বিধবা ভাতা আবেদনকারী' : 'Widowed applicant match for Widow Pension');
        } else if (rules.widowOnly) {
          score -= 5;
          missingCriteria.push(language === 'bn' ? 'বিধবা মহিলাদের জন্য প্রযোজ্য' : 'For widowed applicants only');
        }
      }

      // Student check
      if (rules.studentOnly) {
        if (isStudent) {
          score += 3;
          reasons.push(language === 'bn' ? 'ছাত্রী/ছাত্র শিক্ষার্থী' : 'Enrolled student match');
        } else {
          score -= 4;
          missingCriteria.push(language === 'bn' ? 'শিক্ষার্থী হতে হবে' : 'Must be an enrolled student');
        }
      }

      // Farmer check
      if (rules.farmerOnly) {
        if (isFarmer || occupation.toLowerCase().includes('farm') || occupation.toLowerCase().includes('krishak')) {
          score += 4;
          reasons.push(language === 'bn' ? 'কৃষক ও জমি রেকর্ড ধারী' : 'Farmer / Land record holder');
        } else {
          score -= 4;
          missingCriteria.push(language === 'bn' ? 'কৃষি পেশা ও জমি থাকা আবশ্যক' : 'Farmer occupation required');
        }
      }

      // Senior Citizen check
      if (rules.seniorOnly) {
        if (age >= 60) {
          score += 4;
          reasons.push(language === 'bn' ? 'প্রবীণ নাগরিক (৬০+)' : 'Senior citizen (60+ yrs)');
        } else {
          score -= 4;
          missingCriteria.push(language === 'bn' ? '৬০ বছর বা তার বেশি বয়স আবশ্যক' : 'Must be 60+ years old');
        }
      }

      // Income check
      if (rules.maxIncome) {
        if (income <= rules.maxIncome) {
          score += 2;
          reasons.push(language === 'bn' ? 'বার্ষিক আয় সীমার মধ্যে' : 'Annual income within eligible limit');
        } else {
          score -= 2;
          missingCriteria.push(language === 'bn' ? `সর্বোচ্চ আয় ₹${rules.maxIncome.toLocaleString('en-IN')}` : `Max income limit ₹${rules.maxIncome.toLocaleString('en-IN')}`);
        }
      }

      let matchCategory: 'HIGH' | 'POTENTIAL' | 'MORE_INFO' | 'NOT_MATCHING' = 'NOT_MATCHING';
      if (score >= 4) matchCategory = 'HIGH';
      else if (score >= 1) matchCategory = 'POTENTIAL';
      else if (score >= -2) matchCategory = 'MORE_INFO';

      return {
        scheme: sch,
        score,
        matchCategory,
        reasons,
        missingCriteria
      };
    });
  };

  const results = evaluateSchemes();

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
              {language === 'bn' ? 'ডিজিটাল সহায়তা নির্দেশিকা' : 'Smart Eligibility Assistant'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t.scheme_title}
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            {t.scheme_subtitle}
          </p>
        </div>
      </div>

      {/* Indicative Disclaimer Box */}
      <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-2xl flex items-start gap-3 text-xs text-indigo-200">
        <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">{language === 'bn' ? 'গুরুত্বপূর্ণ বিজ্ঞপ্তি:' : 'Important Notice:'}</span>
          <p className="opacity-90">{t.scheme_indicative_disclaimer}</p>
        </div>
      </div>

      {/* Interactive Criteria Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {language === 'bn' ? '১. নাগরিকের সামাজিক ও ব্যক্তিগত তথ্য নির্দেশ করুন' : '1. Select Citizen Demographic & Social Parameters'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 font-bold mb-1">Age (Years)</label>
            <input 
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-400 font-bold mb-1">Gender</label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="Female">Female (মহিলা)</option>
              <option value="Male">Male (পুরুষ)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 font-bold mb-1">Social Category (Caste)</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as SocialCategory)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white font-bold"
            >
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="OBC-A">OBC-A</option>
              <option value="OBC-B">OBC-B</option>
              <option value="General">General / Unreserved</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 font-bold mb-1">Religion</label>
            <select 
              value={religion}
              onChange={(e) => setReligion(e.target.value as Religion)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
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
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="Married">Married</option>
              <option value="Single">Single / Unmarried</option>
              <option value="Widowed">Widowed</option>
              <option value="Divorced / Separated">Divorced / Separated</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 font-bold mb-1">Ration Card Type</label>
            <select 
              value={rationCardType}
              onChange={(e) => setRationCardType(e.target.value as RationCardType)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="SPHH">SPHH (Priority)</option>
              <option value="PHH">PHH (Priority)</option>
              <option value="AAY (Antyodaya)">AAY (Antyodaya BPL)</option>
              <option value="RKSY-I">RKSY-I</option>
              <option value="RKSY-II">RKSY-II</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 font-bold mb-1">Occupation</label>
            <select 
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="Homemaker">Homemaker (গৃহবধূ)</option>
              <option value="Farmer">Farmer (কৃষক)</option>
              <option value="Student">Student (ছাত্র/ছাত্রী)</option>
              <option value="Self Employed / Business">Self Employed / Retailer</option>
              <option value="Private Service">Private Job</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 font-bold mb-1">Annual Income (₹)</label>
            <input 
              type="number"
              step={10000}
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white font-mono"
            />
          </div>
        </div>

        {/* Checkbox Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={isDivyangjan}
              onChange={(e) => setIsDivyangjan(e.target.checked)}
              className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-indigo-600 focus:ring-0"
            />
            <span className="text-neutral-200 font-bold text-rose-300">Is Divyangjan (40%+ Disability)?</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
              className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-indigo-600 focus:ring-0"
            />
            <span className="text-neutral-200 font-medium">Is Currently a Student?</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={isFarmer}
              onChange={(e) => setIsFarmer(e.target.checked)}
              className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-indigo-600 focus:ring-0"
            />
            <span className="text-neutral-200 font-medium">Holds Agricultural Land (Farmer)?</span>
          </label>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">
          {language === 'bn' ? 'উপযুক্ত সরকারি প্রকল্পসমূহ' : 'Matched Government Schemes'}
        </h3>

        <div className="space-y-4">
          {results.map(({ scheme, matchCategory, reasons, missingCriteria }) => (
            <div 
              key={scheme.id}
              className={`p-6 rounded-[2.5rem] border transition-all ${
                matchCategory === 'HIGH' 
                  ? 'bg-emerald-950/20 border-emerald-800/80' 
                  : matchCategory === 'POTENTIAL' 
                  ? 'bg-indigo-950/20 border-indigo-800/80'
                  : 'bg-neutral-900 border-neutral-800 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      matchCategory === 'HIGH' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      matchCategory === 'POTENTIAL' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {matchCategory === 'HIGH' ? t.scheme_match_highly :
                       matchCategory === 'POTENTIAL' ? t.scheme_match_potential :
                       matchCategory === 'MORE_INFO' ? t.scheme_match_more_info : t.scheme_match_not}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-semibold">
                      {scheme.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {language === 'bn' ? scheme.schemeNameBn : scheme.schemeName}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{scheme.department}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-neutral-800 text-neutral-300 hover:text-white rounded-xl border border-neutral-700"
                    title="Official Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {onApplyForScheme && matchCategory !== 'NOT_MATCHING' && (
                    <button 
                      onClick={() => onApplyForScheme(scheme)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                    >
                      + Create Application
                    </button>
                  )}
                </div>
              </div>

              {/* Benefits highlight */}
              <div className="p-3 bg-neutral-800/50 rounded-2xl border border-neutral-800 text-xs mb-4">
                <span className="text-[10px] text-neutral-500 font-bold uppercase block">Direct Benefit:</span>
                <span className="text-amber-300 font-bold">{scheme.benefits}</span>
              </div>

              {/* Reasons & Criteria Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {reasons.length > 0 && (
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">
                      ✓ Matching Qualifications
                    </span>
                    <ul className="space-y-1 text-neutral-300">
                      {reasons.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {missingCriteria.length > 0 && (
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">
                      ⚠️ Additional Conditions / Missing Parameters
                    </span>
                    <ul className="space-y-1 text-neutral-400">
                      {missingCriteria.map((m, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Helpline & Official URL */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Helpline: <strong className="text-neutral-300">{scheme.helpline}</strong></span>
                <span>Verified: {scheme.lastVerifiedDate}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
