import { EmergencyKitItem } from '../types/checklist';

export const DEFAULT_KIT_ITEMS: EmergencyKitItem[] = [
  {
    id: 'kit-water-1',
    category: 'WATER',
    name: 'Sealed Bottled Drinking Water',
    detail: '1 gallon (3.8 liters) per person per day for minimum 3 days (12 liters per person minimum).',
    checked: false
  },
  {
    id: 'kit-water-2',
    category: 'WATER',
    name: 'Water Purification Tablets',
    detail: 'Chlorine dioxide or iodine water disinfection tablets for backup sanitation.',
    checked: false
  },
  {
    id: 'kit-food-1',
    category: 'FOOD',
    name: 'Non-Perishable Canned Goods',
    detail: 'Ready-to-eat canned meats, beans, stews, vegetables, and soups (min. 3-day supply).',
    checked: false
  },
  {
    id: 'kit-food-2',
    category: 'FOOD',
    name: 'High-Energy Survival Bars & Nuts',
    detail: 'Dense calories requiring zero cooking, boiling, or added water.',
    checked: false
  },
  {
    id: 'kit-food-3',
    category: 'FOOD',
    name: 'Manual Hand-Crank Can Opener',
    detail: 'Heavy-duty manual opener (electric openers fail in blackouts).',
    checked: false
  },
  {
    id: 'kit-med-1',
    category: 'MEDICINE',
    name: 'Prescription Daily Medications',
    detail: 'Minimum 7 to 14-day supply of critical daily personal medications in sealed bottles.',
    checked: false
  },
  {
    id: 'kit-med-2',
    category: 'MEDICINE',
    name: 'Potassium Iodide (KI) Tablets',
    detail: 'Thyroid protection for nuclear release. WARNING: Ingest ONLY when officially instructed by health authorities.',
    checked: false
  },
  {
    id: 'kit-fa-1',
    category: 'FIRST_AID',
    name: 'Trauma & Hemorrhage Kit',
    detail: 'Arterial tourniquet, sterile pressure bandages, and hemostatic gauze for blast trauma.',
    checked: false
  },
  {
    id: 'kit-fa-2',
    category: 'FIRST_AID',
    name: 'Burn & Wound Care Dressings',
    detail: 'Sterile non-adherent burn sheets, antiseptic wipes, medical tape, and trauma scissors.',
    checked: false
  },
  {
    id: 'kit-light-1',
    category: 'TORCH',
    name: 'High-Lumen LED Flashlight',
    detail: 'Impact-resistant LED flashlight with adjustable focus beam.',
    checked: false
  },
  {
    id: 'kit-bat-1',
    category: 'BATTERIES',
    name: 'Spare Alkaline Batteries',
    detail: 'Sealed multipacks of fresh AA and AAA batteries stored in dry containers.',
    checked: false
  },
  {
    id: 'kit-pwr-1',
    category: 'POWER_BANK',
    name: 'Charged USB Power Bank (20,000+ mAh)',
    detail: 'Multi-port high-capacity battery pack with appropriate charging cables for emergency phone use.',
    checked: false
  },
  {
    id: 'kit-rad-1',
    category: 'RADIO',
    name: 'Emergency Radio (Hand-Crank / Solar / Battery)',
    detail: 'Multi-band AM/FM/NOAA-compatible emergency receiver for civil defense updates during blackouts.',
    checked: false
  },
  {
    id: 'kit-doc-1',
    category: 'DOCUMENTS',
    name: 'Waterproof Vital Document Folder',
    detail: 'Copies of government IDs (Aadhaar/Passport), property deeds, medical cards, and cash.',
    checked: false
  },
  {
    id: 'kit-hyg-1',
    category: 'HYGIENE',
    name: 'Heavy-Duty Plastic Bags (4-6 mil) & Duct Tape',
    detail: 'Essential for sealing windows against fallout dust and double-bagging contaminated clothing.',
    checked: false
  },
  {
    id: 'kit-hyg-2',
    category: 'HYGIENE',
    name: 'N95 / FFP2 Particulate Masks',
    detail: 'Filters out airborne radioactive fallout particulates from being inhaled into the lungs.',
    checked: false
  },
  {
    id: 'kit-oth-1',
    category: 'OTHER',
    name: 'Emergency Signal Whistle & Work Gloves',
    detail: 'High-decibel whistle for signaling search teams and leather work gloves for clearing debris.',
    checked: false
  }
];
