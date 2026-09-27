export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'GENERAL' | 'RADIATION' | 'COMMUNICATION' | 'SAFETY';
}

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'GENERAL',
    question: 'What is a nuclear emergency?',
    answer: 'A nuclear emergency involves an incident at a facility involving nuclear fission (such as a commercial nuclear power reactor, research reactor, or naval vessel) where there is a risk or occurrence of significant core damage and potential release of radioactive fission products into the atmosphere.'
  },
  {
    id: 'faq-2',
    category: 'GENERAL',
    question: 'What is a radiological emergency?',
    answer: 'A radiological emergency involves the loss of control, theft, dispersion, or accident involving a radioactive source (such as unshielded industrial radiography cameras, medical radiotherapy equipment, or a radiological dispersal device / "dirty bomb") without any nuclear fission reaction.'
  },
  {
    id: 'faq-3',
    category: 'RADIATION',
    question: 'Can my smartphone detect dangerous radiation levels?',
    answer: 'NO. Ordinary smartphones lack ionizing radiation sensors and calibrated shielding. Apps claiming to detect radiation with the camera sensor are uncalibrated, noisy, and create dangerous false confidence. Only certified Geiger-Müller tubes or scintillators can measure radiation.'
  },
  {
    id: 'faq-4',
    category: 'SAFETY',
    question: 'What should I do immediately during an official emergency warning?',
    answer: 'STAY CALM. Go indoors immediately into a substantial brick or concrete building. Close and latch all doors and windows. Turn off all air conditioning, ventilation systems, and exhaust fans. Tune your battery-powered radio to official emergency broadcast frequencies (e.g. All India Radio / NDMA).'
  },
  {
    id: 'faq-5',
    category: 'SAFETY',
    question: 'Should I immediately evacuate in my car?',
    answer: 'NO, not unless specifically instructed by competent disaster authorities. Spontaneous self-evacuation clogs highways with traffic, trapping civilians inside cars that provide virtually zero gamma shielding directly beneath an open radioactive plume. Sheltering indoors offers vastly superior protection.'
  },
  {
    id: 'faq-6',
    category: 'COMMUNICATION',
    question: 'What if internet connectivity stops working completely?',
    answer: 'N-HELP is built offline-first. All core emergency guides, decontamination checklists, water and food safety instructions, offline demonstration maps, and family emergency plans are cached directly in your device\'s local storage and continue to function seamlessly without internet.'
  },
  {
    id: 'faq-7',
    category: 'COMMUNICATION',
    question: 'What happens when cellular voice and SMS networks fail?',
    answer: 'Cell towers quickly become congested or lose grid battery power during major disasters. N-HELP activates Emergency Mesh Mode, allowing nearby compatible devices to discover each other and route low-bandwidth short text broadcasts peer-to-peer.'
  },
  {
    id: 'faq-8',
    category: 'COMMUNICATION',
    question: 'What is mesh communication and how does it work?',
    answer: 'Mesh networking allows compatible devices (smartphones, radios) to communicate directly with nearby peers using local radio frequencies like Bluetooth Low Energy (BLE) or Wi-Fi Aware. Messages hop from device to device (store-and-forward), creating a resilient web of communication without centralized infrastructure.'
  },
  {
    id: 'faq-9',
    category: 'COMMUNICATION',
    question: 'What is BitChat and how is it related to N-HELP?',
    answer: 'BitChat is an open-source decentralized messaging project that uses Bluetooth LE mesh and store-and-forward relaying for local offline communication. N-HELP provides an educational companion guide to BitChat\'s architecture, but N-HELP is an independent academic project and never pretends the browser alone replaces native BLE mesh applications.'
  },
  {
    id: 'faq-10',
    category: 'GENERAL',
    question: 'Can N-HELP replace official government emergency authorities?',
    answer: 'ABSOLUTELY NOT. N-HELP is an academic civil defense educational and preparedness tool created for course CHE110. It has no government authority, does not declare real disasters, and never issues unilateral evacuation orders. Always obey official directives from NDMA, AERB, DAE, and local administration.'
  },
  {
    id: 'faq-11',
    category: 'SAFETY',
    question: 'Can N-HELP work completely offline?',
    answer: 'YES. When installed as a Progressive Web App (PWA) via "Add to Home Screen", its Service Worker caches the application bundle and all emergency databases in IndexedDB. It can be opened and used with airplane mode enabled.'
  },
  {
    id: 'faq-12',
    category: 'SAFETY',
    question: 'Can N-HELP receive live official government emergency alerts?',
    answer: 'In this academic prototype version, live feeds are simulated for demonstration purposes. In a future production deployment, cryptographic government digital signatures (e.g. CAP / Common Alerting Protocol) could feed verified alerts into N-HELP.'
  },
  {
    id: 'faq-13',
    category: 'COMMUNICATION',
    question: 'What should I do when my phone battery is critically low?',
    answer: 'Switch to N-HELP Blackout Mode immediately. It switches to an OLED pure-black theme (#000000) that physically turns off screen pixels, dims brightness, stops background processing, and provides direct access to critical safety checklists.'
  }
];
