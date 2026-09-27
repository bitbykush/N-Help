import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Home, 
  Car, 
  Sparkles, 
  Droplet, 
  Radio, 
  HeartPulse, 
  AlertTriangle, 
  ShieldCheck, 
  Volume2, 
  Layers,
  ChevronRight,
  ChevronDown,
  Globe
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MEDICAL_TRIAGE_PROTOCOLS, POTASSIUM_IODIDE_GUIDANCE } from '../../data/medicalSafetyData';
import { WATER_SAFETY_PROTOCOL, FOOD_SAFETY_PROTOCOL } from '../../data/waterFoodSafetyData';

type EmergencySection = 'triage' | 'shelter' | 'evacuation' | 'decontam' | 'water-food' | 'medical';

export const EmergencyNow: React.FC = () => {
  const { setCurrentView } = useEmergency();
  const { lang, setLang, t } = useTranslation();
  const [activeSection, setActiveSection] = useState<EmergencySection>('triage');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleLanguage = () => {
    setLang(lang === 'hi' ? 'en' : 'hi');
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Header Banner with Bilingual Switcher */}
      <div className="flex items-center justify-between bg-red-950/40 border border-red-500/50 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-600 text-white animate-pulse">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-wide uppercase">
              {t.emergencyNow}
            </h1>
            <p className="text-[11px] text-red-300 font-mono">
              CIVIL PROTECTION & LIFE-SAFETY PROTOCOL
            </p>
          </div>
        </div>

        {/* English / Hindi Instant Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'Switch to English' : 'हिंदी में देखें'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'triage', label: '1. Immediate Triage', icon: AlertOctagon },
          { id: 'shelter', label: '2. Shelter Guidance', icon: Home },
          { id: 'evacuation', label: '3. Evacuation', icon: Car },
          { id: 'decontam', label: '4. Decontamination', icon: Sparkles },
          { id: 'water-food', label: '5. Food & Water', icon: Droplet },
          { id: 'medical', label: '6. Medical & KI', icon: HeartPulse },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as EmergencySection)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: IMMEDIATE TRIAGE STEPS */}
      {activeSection === 'triage' && (
        <div className="space-y-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>CORE RULE:</strong> Do not make spontaneous decisions. Obey verified instructions issued by competent emergency authorities via emergency radio.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {lang === 'hi' ? 'शांत रहें और घबराएं नहीं' : 'Stay Calm & Do Not Panic'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {lang === 'hi' 
                    ? 'अत्यधिक घबराहट और अनियंत्रित भगदड़ विकिरण की तुलना में अधिक घातक होती है। अपने परिवार को एक स्थान पर एकत्र करें।'
                    : 'Extreme panic and stampedes cause immediate casualties. Keep yourself and dependents calm; radiation takes time to accumulate.'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {lang === 'hi' ? 'आधिकारिक आपातकालीन प्रसारण सुनें' : 'Check Official Emergency Broadcasts'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {lang === 'hi'
                    ? 'बैटरी या हैंड-क्रैंक रेडियो को आकाशवाणी (All India Radio) अथवा स्थानीय सिविल डिफेंस आवृत्ति पर सेट करें।'
                    : 'Tune battery-powered radios to emergency stations (e.g. All India Radio / NDMA civil defense channels).'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {lang === 'hi' ? 'आश्रय लें या आधिकारिक निकासी आदेश का पालन करें' : 'Follow Directives: Shelter vs. Evacuate'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {lang === 'hi'
                    ? 'जब तक स्पष्ट सरकारी निकासी आदेश न हो, पक्के कंक्रीट मकान अथवा बेसमेंट के अंदर रहें। कभी भी बिना आदेश के राजमार्गों पर गाड़ी न निकालें।'
                    : 'Unless an official evacuation order has been declared for your sector, remain sheltered inside a dense concrete structure.'}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setActiveSection('shelter')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-[11px] border border-slate-700"
                  >
                    View Shelter Steps →
                  </button>
                  <button
                    onClick={() => setActiveSection('evacuation')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] border border-slate-700"
                  >
                    View Evacuation Steps →
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">4</span>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {lang === 'hi' ? 'कपड़े उतारकर बाहर की धूल हटाएं (90% सफाई)' : 'Avoid Contamination (Gentle De-Clothing)'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {lang === 'hi'
                    ? 'घर में प्रवेश करने से पहले जूते और बाहरी कपड़े उतारकर प्लास्टिक बैग में सील कर दें। त्वचा को कभी भी कठोर ब्रश से न रगड़ें।'
                    : 'Strip outer clothing before entering living areas. Double-bag contaminated items. NEVER scrub skin aggressively.'}
                </p>
                <button
                  onClick={() => setActiveSection('decontam')}
                  className="mt-2 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-[11px] border border-slate-700"
                >
                  View Decontamination Details →
                </button>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">5</span>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {lang === 'hi' ? 'केवल सीलबंद खाद्य और जल का उपयोग करें' : 'Follow Food & Water Restrictions'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {lang === 'hi'
                    ? 'उबालने से विकिरण नष्ट नहीं होता! केवल पहले से सीलबंद बोतलबंद पानी अथवा गीज़र टैंक का पानी पिएं। खुले फल व ताज़ा दूध न पिएं।'
                    : 'Boiling does NOT destroy radiation! Consume factory-sealed canned goods and bottled water. Avoid open garden produce.'}
                </p>
                <button
                  onClick={() => setActiveSection('water-food')}
                  className="mt-2 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-[11px] border border-slate-700"
                >
                  View Water & Food Safety →
                </button>
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">6</span>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {lang === 'hi' ? 'चिकित्सा सहायता: रक्तस्राव का इलाज पहले करें' : 'Medical First Aid: Trauma First'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {lang === 'hi'
                    ? 'गंभीर रक्तस्राव का इलाज पहले करें। बिना डॉक्टर के पोटेशियम आयोडाइड (KI) न खाएं और डेटॉल/आयोडीन टिंचर कभी न पिएं।'
                    : 'Control severe hemorrhage immediately. Radiation does not cause instant death. Understand strict Potassium Iodide (KI) limits.'}
                </p>
                <button
                  onClick={() => setActiveSection('medical')}
                  className="mt-2 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-[11px] border border-slate-700"
                >
                  View Medical & KI Protocols →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action to Mesh Mode */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-cyan-300">Need to broadcast emergency status to nearby devices?</div>
              <p className="text-[11px] text-slate-400">Emergency Mesh operates peer-to-peer without cell service or internet.</p>
            </div>
            <button
              onClick={() => setCurrentView('mesh')}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs rounded-lg shrink-0 shadow transition-colors"
            >
              Open Mesh →
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: SHELTER GUIDANCE */}
      {activeSection === 'shelter' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Home className="w-5 h-5" />
              <span>SHELTER-IN-PLACE ACTION MANUAL</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p><strong>1. Move Indoors Immediately:</strong> Go to the innermost room or underground basement of the strongest available concrete or brick building.</p>
              <p><strong>2. Infiltration Sealing:</strong> Shut all exterior doors and windows. Turn off central air conditioning, heating blowers, bathroom exhaust fans, and kitchen vents.</p>
              <p><strong>3. Seal Gaps:</strong> Tape plastic sheeting (or trash bags) over window frames, pet doors, and chimney flues using heavy duct tape.</p>
              <p><strong>4. Optimal Positioning:</strong> Stay near interior support walls. Avoid exterior walls, glass windows, and top floors directly underneath roofs where fallout ash collects.</p>
              <p><strong>5. Pets:</strong> Bring pets indoors immediately. Wipe their coats and paws with damp paper towels before letting them in shelter rooms.</p>
              <p><strong>6. Duration:</strong> Remain sheltered for at least 24 to 48 hours unless directed otherwise by official government radio.</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Protection Factor (PF):</strong> An underground basement provides a PF of 20 to 50+, meaning occupants receive less than 2% to 5% of the outside gamma radiation dose.
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: EVACUATION GUIDANCE */}
      {activeSection === 'evacuation' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Car className="w-5 h-5" />
              <span>EVACUATION PROTOCOL & CORRIDORS</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p><strong>1. Authority Command Mandatory:</strong> Evacuate ONLY when explicitly instructed by official emergency incident command. Do NOT self-evacuate on impulse.</p>
              <p><strong>2. Route Adherence:</strong> Travel strictly along designated official evacuation corridors where civil defense has established radiological monitoring and decontamination stations.</p>
              <p><strong>3. Vehicle Air Control:</strong> Keep all vehicle windows tightly rolled up. Turn ventilation systems to <strong>"Recirculate / Internal Air"</strong>. Never draw outside air.</p>
              <p><strong>4. Emergency Kit:</strong> Take your pre-packed N-HELP Emergency Kit, essential medications, ID documents, and power bank.</p>
              <p><strong>5. Neighbor Check:</strong> Help elderly, disabled, or vulnerable neighbors evacuate if safe to do so.</p>
              <p><strong>6. Checkpoints:</strong> Cooperate fully at radiation screening checkpoints. Do not bypass security perimeters.</p>
            </div>

            <div className="p-3 bg-red-950/40 rounded-lg border border-red-500/30 text-[11px] text-red-300">
              <strong>CRITICAL WARNING:</strong> Being trapped in highway gridlock inside a thin metal vehicle under an active fallout plume results in higher radiation exposure than staying indoors in a sealed concrete home.
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: DECONTAMINATION GUIDANCE */}
      {activeSection === 'decontam' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>GENTLE DECONTAMINATION PROTOCOL</span>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
              <strong>THE 90% RULE:</strong> Carefully removing your outer jacket, shirt, shoes, and pants removes up to 90% of radioactive dust particulates.
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p><strong>1. Outer Clothing:</strong> Strip outer layers before entering clean shelter areas. Avoid pulling shirts over your head (cut them off with scissors to prevent inhaling dust).</p>
              <p><strong>2. Double-Bagging:</strong> Place clothes in thick plastic trash bags, seal tightly with tape, and store outside living areas far from people and pets.</p>
              <p><strong>3. Gentle Skin Washing:</strong> Wash exposed skin gently with mild soap and lukewarm water. Wash hair with shampoo.</p>
              <p><strong>4. NEVER ABRADE SKIN:</strong> Do NOT scrub vigorously with stiff brushes or scouring pads. Abrasions break the skin, allowing radioactive particulates into the bloodstream.</p>
              <p><strong>5. NO Hair Conditioner:</strong> Conditioner binds radioactive fallout dust directly to hair proteins. Use shampoo only.</p>
              <p><strong>6. Eyes, Ears & Nose:</strong> Blow your nose gently into a clean damp tissue. Wipe eyelids, ears, and nostrils with clean damp paper towels.</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: SAFE FOOD & WATER */}
      {activeSection === 'water-food' && (
        <div className="space-y-3">
          {/* Water Section */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Droplet className="w-5 h-5" />
              <span>WATER CONTAMINATION SAFETY & THE BOILING MYTH</span>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs text-red-300">
              <strong>{WATER_SAFETY_PROTOCOL.boilingMythDebunk.statement}</strong>
              <p className="mt-1 text-slate-300">{WATER_SAFETY_PROTOCOL.boilingMythDebunk.reality}</p>
              <p className="mt-1 text-red-200">{WATER_SAFETY_PROTOCOL.boilingMythDebunk.vaporHazard}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Safe Water Sources Hierarchy:</h4>
              {WATER_SAFETY_PROTOCOL.tiers.map((t) => (
                <div key={t.tier} className={`p-2.5 rounded-lg border ${t.isSafe ? 'bg-slate-950 border-emerald-500/30 text-slate-200' : 'bg-slate-950 border-red-500/30 text-slate-300'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${t.isSafe ? 'text-emerald-400' : 'text-red-400'}`}>{t.title}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${t.isSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {t.isSafe ? 'SAFE' : 'DO NOT DRINK'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{t.guideline}</p>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Household Filters:</strong> {WATER_SAFETY_PROTOCOL.filtrationAdvice}
            </div>
          </div>

          {/* Food Section */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Layers className="w-5 h-5" />
              <span>FOOD CONTAMINATION SAFETY & DAIRY ADVISORY</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>• Canned Goods:</strong> {FOOD_SAFETY_PROTOCOL.cannedGoodsProcedure[0]} {FOOD_SAFETY_PROTOCOL.cannedGoodsProcedure[1]}</p>
              <p><strong>• Outdoor Produce:</strong> {FOOD_SAFETY_PROTOCOL.freshProduceDirectives[0]} {FOOD_SAFETY_PROTOCOL.freshProduceDirectives[1]}</p>
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs text-red-300 font-medium">
                {FOOD_SAFETY_PROTOCOL.dairyWarningIodine131}
              </div>
              <p><strong>• Cooking Reality:</strong> {FOOD_SAFETY_PROTOCOL.cookingLimitation}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: MEDICAL HELP & KI WARNINGS */}
      {activeSection === 'medical' && (
        <div className="space-y-3">
          {/* Trauma First */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <HeartPulse className="w-5 h-5" />
              <span>TRAUMA FIRST: CRITICAL EMERGENCY TRIAGE</span>
            </div>

            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300 font-bold">
              {MEDICAL_TRIAGE_PROTOCOLS[0].goldenRule}
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              {MEDICAL_TRIAGE_PROTOCOLS[0].steps.map((s, i) => (
                <p key={i}>• {s}</p>
              ))}
            </div>
          </div>

          {/* Potassium Iodide Guide & Hazards */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>POTASSIUM IODIDE (KI): REALITY & SEVERE HAZARDS</span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p><strong>How KI Works:</strong> {POTASSIUM_IODIDE_GUIDANCE.mechanism}</p>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300">
                <strong>What KI Protects:</strong> {POTASSIUM_IODIDE_GUIDANCE.strictlyProtects[0]}
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <span className="font-bold text-red-400 uppercase text-[11px]">KI Provides ZERO Protection Against:</span>
                {POTASSIUM_IODIDE_GUIDANCE.providesZeroProtectionAgainst.map((p, i) => (
                  <p key={i} className="text-slate-400 text-[11px]">• {p}</p>
                ))}
              </div>
            </div>

            {/* Contraindications */}
            <div className="space-y-1.5">
              <h5 className="text-[11px] font-mono font-bold text-red-400 uppercase">Severe Medical Hazards of Inappropriate KI Ingestion:</h5>
              {POTASSIUM_IODIDE_GUIDANCE.severeRisks.map((r, i) => (
                <div key={i} className="p-2 bg-slate-950 rounded border border-slate-800 text-xs">
                  <span className="font-semibold text-white">{r.condition}: </span>
                  <span className="text-slate-400">{r.risk}</span>
                </div>
              ))}
            </div>

            {/* Lethal DIY Substitutes */}
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg space-y-2">
              <span className="text-xs font-bold text-red-300 uppercase tracking-wider block">LETHAL DIY "IODINE" SUBSTITUTES TO NEVER INGEST:</span>
              {POTASSIUM_IODIDE_GUIDANCE.bannedSubstitutes.map((b, i) => (
                <div key={i} className="text-xs">
                  <strong className="text-red-400">• {b.name}: </strong>
                  <span className="text-slate-300">{b.danger}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
