import { EmergencyContact } from '../types/checklist';

export const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'c-112',
    name: 'National Emergency Helpline (ERSS)',
    phone: '112',
    category: 'DISASTER_MANAGEMENT',
    isVerifiedOfficial: true,
    notes: 'Single unified emergency helpline for Police, Fire, and Ambulance across India.'
  },
  {
    id: 'c-1078',
    name: 'NDMA Disaster Management Helpline',
    phone: '1078',
    category: 'DISASTER_MANAGEMENT',
    isVerifiedOfficial: true,
    notes: 'National Disaster Management Authority 24/7 disaster crisis helpline.'
  },
  {
    id: 'c-108',
    name: 'Emergency Medical & Disaster Ambulance',
    phone: '108',
    category: 'AMBULANCE',
    isVerifiedOfficial: true,
    notes: 'Emergency ambulance response and medical dispatch service.'
  },
  {
    id: 'c-101',
    name: 'Fire & Rescue Services',
    phone: '101',
    category: 'FIRE',
    isVerifiedOfficial: true,
    notes: 'Municipal Fire Brigade and hazardous materials rescue units.'
  },
  {
    id: 'c-100',
    name: 'Police Control Room',
    phone: '100',
    category: 'POLICE',
    isVerifiedOfficial: true,
    notes: 'Direct municipal police dispatch and civil order coordination.'
  },
  {
    id: 'c-aerb',
    name: 'AERB Emergency Response Centre (ERC)',
    phone: '+91-22-25990100',
    category: 'ADMINISTRATION',
    isVerifiedOfficial: true,
    notes: 'Atomic Energy Regulatory Board Crisis Centre (Mumbai Headquarters).'
  }
];
