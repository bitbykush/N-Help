import { MedicalTriageProtocol, PotassiumIodideGuidance } from '../types/emergency';

export const MEDICAL_TRIAGE_PROTOCOLS: MedicalTriageProtocol[] = [
  {
    priority: 'TRAUMA_FIRST',
    title: 'Trauma First: Critical Life-Threatening Priority',
    goldenRule: 'Treat severe arterial bleeding, airway compromise, and shock BEFORE radiological decontamination.',
    steps: [
      'Stop catastrophic hemorrhage immediately using direct pressure, sterile pressure dressings, or an arterial tourniquet.',
      'Maintain an open airway and ensure adequate breathing.',
      'Radiation exposure does NOT cause instant collapse or immediate death within minutes; untreated arterial bleeding does.',
      'Decontamination can wait until the patient is physiologically stabilized.'
    ],
    contraindications: [
      'Do NOT delay CPR, airway management, or hemorrhage control to scan or wash a patient.',
      'Do NOT withhold life-saving emergency care due to fear of radiation contagion. An irradiated person does not emit deadly rays.'
    ],
    prohibitedActions: [
      'Do not perform invasive decontamination before controlling open wounds.',
      'Do not use tourniquets improperly; write time of placement on patient forehead.'
    ]
  },
  {
    priority: 'CONTAMINATION_TRIAGE',
    title: 'Gentle Decontamination & De-Clothing Protocol',
    goldenRule: 'Removing outer clothing removes up to 90% of radioactive fallout particulates.',
    steps: [
      'Carefully remove outer shoes, jackets, and hats before entering indoor living or shelter spaces.',
      'Avoid pulling contaminated garments over the face or head. Unbutton or cut shirts off with trauma shears to prevent inhaling particles.',
      'Double-bag contaminated clothing inside thick plastic garbage bags, seal tightly with duct tape, and store outside living areas away from people and pets.',
      'Wash exposed skin, hair, and hands gently using lukewarm water and mild non-abrasive soap.',
      'Gently blow nose into clean damp tissue; wipe ears, eyelids, and nostrils with clean damp cloths.'
    ],
    contraindications: [
      'CRITICAL: NEVER scrub skin vigorously with stiff brushes, rough sponges, or abrasive cleansers.',
      'Abrasions break the epidermal skin barrier, driving radioactive dust directly into the bloodstream and internal organs.'
    ],
    prohibitedActions: [
      'Do not use scalding water (opens pores and increases cutaneous absorption).',
      'Do not use hair conditioner (chemical binding agents lock radioactive fallout particles to hair protein fibers).'
    ]
  },
  {
    priority: 'GENERAL_FIRST_AID',
    title: 'Acute Radiation Syndrome (ARS) Recognition & Supportive Care',
    goldenRule: 'ARS onset speed correlates with dose; radiation nausea is NOT infectious.',
    steps: [
      'Monitor for prodromal phase symptoms: nausea, vomiting, sudden diarrhea, and fatigue appearing hours after exposure.',
      'Keep patient calm, warm, and rested in a sheltered, clean environment.',
      'Prevent dehydration by administering sips of verified clean water and electrolyte solution.',
      'Treat surface thermal burns from fires or blasts with sterile dry dressings (no ointments).'
    ],
    contraindications: [
      'Do NOT assume nausea alone confirms a lethal dose; severe stress and panic induce psychosomatic vomiting.',
      'Do NOT isolate patients without emotional support; psychological panic induces lethal stampedes.'
    ],
    prohibitedActions: [
      'Do not give aspirin if internal bleeding or gastrointestinal damage is suspected.',
      'Do not administer unverified herbal or DIY chemical concoctions.'
    ]
  }
];

export const POTASSIUM_IODIDE_GUIDANCE: PotassiumIodideGuidance = {
  mechanism: 'Stable Potassium Iodide (KI, containing non-radioactive Iodine-127) floods and saturates thyroid receptor sites, preventing the uptake and bio-accumulation of radioactive Iodine-131 (I-131).',
  strictlyProtects: [
    'Thyroid gland ONLY from radioactive iodine isotopes (such as I-131).'
  ],
  providesZeroProtectionAgainst: [
    'External penetrating gamma or neutron radiation.',
    'Dangerous radionuclides such as Cesium-137 (Cs-137), Strontium-90 (Sr-90), Cobalt-60 (Co-60), or Plutonium-239 (Pu-239).',
    'Any other organ in the human body (bone marrow, lungs, stomach, intestines, kidneys, reproductive organs remain completely unprotected).'
  ],
  severeRisks: [
    {
      condition: 'Graves\' Disease / Multinodular Goiter',
      risk: 'Can trigger a lethal "thyroid storm" (severe hyperthyroidism crisis, cardiac arrhythmias, fever, and shock).'
    },
    {
      condition: 'Known Iodine Allergy',
      risk: 'Can provoke severe allergic anaphylaxis, facial angioedema, airway constriction, and circulatory collapse.'
    },
    {
      condition: 'Renal Failure / Kidney Disease',
      risk: 'Potassium load can induce life-threatening hyperkalemia leading to cardiac arrest.'
    },
    {
      condition: 'Neonates & Pregnant Women',
      risk: 'Excessive or repeated iodine blocks infant thyroid hormone production, causing irreversible cognitive impairment (cretinism).'
    }
  ],
  bannedSubstitutes: [
    {
      name: 'Povidone-Iodine (Betadine)',
      danger: 'Topical skin antiseptic only. Ingesting causes corrosive esophageal ulceration, chemical gastritis, and acute kidney destruction.'
    },
    {
      name: 'Lugol\'s Solution / Tincture of Iodine',
      danger: 'Contains free elemental iodine ($I_2$), which is highly caustic and poisonous. Swallowing causes lethal gastrointestinal perforation.'
    },
    {
      name: 'Bleach / Hydrogen Peroxide / Disinfectants',
      danger: 'Corrosive poisons that destroy human tissue; causes immediate internal organ burning and fatal pulmonary edema.'
    },
    {
      name: 'Massive Table Salt Consumption',
      danger: 'Table salt is sodium chloride ($NaCl$), not potassium iodide. Excessive consumption induces hypernatremic dehydration, brain swelling, and hypertensive stroke.'
    }
  ]
};
