export type KitCategory = 
  | 'WATER'
  | 'FOOD'
  | 'MEDICINE'
  | 'FIRST_AID'
  | 'TORCH'
  | 'BATTERIES'
  | 'POWER_BANK'
  | 'RADIO'
  | 'DOCUMENTS'
  | 'HYGIENE'
  | 'OTHER';

export interface EmergencyKitItem {
  id: string;
  category: KitCategory;
  name: string;
  detail: string;
  checked: boolean;
  isCustom?: boolean;
}

export interface FamilyPlanMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  medicalNotes?: string;
}

export interface FamilyPlan {
  familyName: string;
  primaryContact: string;
  secondaryContact: string;
  meetingLocationHome: string;
  meetingLocationRegional: string;
  designatedShelter: string;
  specialNotes: string;
  members: FamilyPlanMember[];
  updatedAt: number;
}

export type ContactCategory = 
  | 'POLICE'
  | 'FIRE'
  | 'AMBULANCE'
  | 'HOSPITAL'
  | 'ADMINISTRATION'
  | 'DISASTER_MANAGEMENT'
  | 'FAMILY'
  | 'COMMUNITY';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  category: ContactCategory;
  isVerifiedOfficial: boolean;
  notes?: string;
  isCustom?: boolean;
}
