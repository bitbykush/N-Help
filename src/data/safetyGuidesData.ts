import { SafetyArticle } from '../types/educational';

export const SAFETY_ARTICLES: SafetyArticle[] = [
  {
    id: 'guide-before-prep',
    category: 'BEFORE',
    title: 'Emergency Preparedness & Survival Kit Assembly',
    summary: 'Proactive preparations before any incident drastically enhance survival probability during total infrastructure collapse.',
    whatToDo: [
      'Assemble an N-HELP Emergency Kit with minimum 3-day supply of sealed water (1 gal/person/day) and non-perishable canned food.',
      'Obtain a battery-operated or hand-crank emergency radio capable of receiving emergency civil broadcast bands.',
      'Pre-identify the innermost room or underground basement of your residence or workplace.',
      'Purchase thick plastic sheeting (4-6 mil) and heavy duct tape for emergency window and ventilation sealing.',
      'Keep charged power banks and copies of vital documents in a waterproof pouch.'
    ],
    whatNotToDo: [
      'Do not rely solely on cellular networks for disaster communication.',
      'Do not store emergency water in open or unsealed plastic buckets prone to dust deposition.',
      'Do not hoard prescription medications without doctor guidance.'
    ],
    important: 'Preparation done in advance prevents panic-driven errors during the first critical hours of an incident.',
    sources: ['IAEA Safety Standards Series No. GS-R-2', 'NDMA Nuclear Emergency Management Guidelines']
  },
  {
    id: 'guide-before-family-plan',
    category: 'BEFORE',
    title: 'Creating a Resilient Family Emergency Plan',
    summary: 'Establishing pre-agreed meeting points and offline communication protocols keeps families united when cellular networks fail.',
    whatToDo: [
      'Designate two primary meeting locations: one directly outside the home for quick local reunion, and one outside the neighborhood (e.g., civic center or library).',
      'Designate an out-of-district emergency contact person who is less likely to be affected by local cellular blackouts.',
      'Record medical conditions, emergency contact numbers, and school/workplace evacuation protocols in physical wallet cards.',
      'Practice an annual 15-minute home sheltering drill with all family members.'
    ],
    whatNotToDo: [
      'Do not assume mobile messaging apps will function during a grid blackout.',
      'Do not choose meeting points adjacent to industrial chemical or hazardous facilities.'
    ],
    important: 'Physical, written family emergency cards remain legible when mobile phone batteries die.',
    sources: ['NDMA Family Disaster Preparedness Manual', 'WHO Radiological Emergency Guidelines']
  },
  {
    id: 'guide-during-shelter',
    category: 'DURING',
    title: 'Shelter-in-Place & Infiltration Protection Protocol',
    summary: 'Mass, distance, and airtight seals provide rapid protection from airborne radioactive fallout.',
    whatToDo: [
      'Go indoors immediately into a substantial brick, concrete, or stone building. Basements offer the highest protection factors (PF 20-50+).',
      'Immediately shut all exterior windows, doors, and fireplace dampers.',
      'Turn off all air conditioners, ventilation fans, HVAC blowers, and kitchen range hoods that draw air from outside.',
      'Seal window and door perimeter cracks using plastic sheeting and duct tape.',
      'Stay sheltered for at least 24 to 48 hours unless directed otherwise by official civil defense broadcasts.'
    ],
    whatNotToDo: [
      'Do not seek shelter in mobile homes, tents, glass sunrooms, or flimsy wooden shacks.',
      'Do not stand near glass windows or exterior perimeter walls where gamma rays easily penetrate.',
      'Do not open exterior doors to check on the situation outside.'
    ],
    important: 'Radioactivity from fallout decays rapidly; within 24 hours, the dose rate drops to less than 1/10th of its initial peak.',
    sources: ['AERB Safety Manual on Emergency Preparedness', 'IAEA EPR-NPP Guidelines']
  },
  {
    id: 'guide-during-evacuation',
    category: 'DURING',
    title: 'Safe Evacuation: Route Compliance & Vehicle Procedures',
    summary: 'Evacuation is a managed civil defense operation; self-directed evacuation during plume passage can be lethal.',
    whatToDo: [
      'Evacuate ONLY when explicitly instructed by competent government authorities via emergency broadcasts.',
      'Travel strictly along designated civil defense evacuation corridors with radiological screening checkpoints.',
      'In vehicles: close all windows, shut off external air ventilation, set air conditioning to "Internal Recirculation".',
      'Take your pre-packed N-HELP Emergency Kit, essential prescription medicines, government photo IDs, and cash.',
      'Assist elderly neighbors and persons with limited mobility.'
    ],
    whatNotToDo: [
      'Do not self-evacuate impulsively on congested highways directly into the downwind path of the fallout plume.',
      'Do not drive with convertible roofs open, windows cracked, or outside ventilation enabled.',
      'Do not bypass official civil defense radiation checkpoints.'
    ],
    important: 'Being trapped in a traffic jam under an open fallout plume delivers far higher radiation doses than staying inside a sealed concrete home.',
    sources: ['NDMA Guidelines on Management of Nuclear & Radiological Emergencies', 'IAEA Safety Reports Series No. 95']
  },
  {
    id: 'guide-during-comm-outage',
    category: 'DURING',
    title: 'Navigating Telecommunications & Power Blackouts',
    summary: 'Standard telecommunication infrastructure collapses within hours during major disasters; peer protocols provide mutual aid.',
    whatToDo: [
      'Switch your smartphone to Blackout / Ultra Power Saver mode; reduce screen brightness to minimum.',
      'Tune to battery-operated radio stations (All India Radio / National Disaster Management broadcasts).',
      'Use short, low-bandwidth text broadcasts over N-HELP Emergency Mesh rather than attempting voice calls.',
      'Conserve battery: keep phones warm, turn off background app refresh, and avoid streaming media.',
      'Rely on pre-agreed family meeting schedules rather than continuous real-time messaging.'
    ],
    whatNotToDo: [
      'Do not repeatedly attempt continuous voice calls on congested cellular towers, which rapidly drains battery and blocks emergency 112 traffic.',
      'Do not believe or forward unverified rumors spreading on offline social networks.'
    ],
    important: 'Short text packets require 1/1000th of the energy and bandwidth needed for voice calls.',
    sources: ['ITU Disaster Telecommunications Handbook', 'BitChat Open-Source Mesh Protocol Documentation']
  },
  {
    id: 'guide-after-recovery',
    category: 'AFTER',
    title: 'Post-Emergency Decontamination & Safe Re-entry',
    summary: 'Returning home safely requires verification of residual contamination and official government clearance.',
    whatToDo: [
      'Return to evacuated areas ONLY after competent civil defense authorities declare the sector cleared for safe habitation.',
      'Clean indoor surfaces with damp mops and wet disposable cloths to capture residual dust; do NOT use dry brooms or leaf blowers.',
      'Continue drinking factory-sealed bottled water until municipal water testing confirms safe isotopic limits.',
      'Cooperate fully with local health authorities for whole-body radiation screening if you were present in the plume zone.'
    ],
    whatNotToDo: [
      'Do not consume food from local gardens or drink from unmonitored shallow wells.',
      'Do not enter restricted exclusion zones to retrieve abandoned property before clearance.',
      'Do not dry sweep fallout dust, which aerosolizes radioactive particulates into the lungs.'
    ],
    important: 'Remediation is systematic. Following municipal guidance prevents long-term chronic internal exposure.',
    sources: ['WHO Guidance on Public Health Response to Radiological Emergencies', 'AERB Safety Guide AERB/SG/EP-1']
  }
];
