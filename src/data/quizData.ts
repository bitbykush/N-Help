import { QuizQuestion } from '../types/educational';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Sheltering Priority',
    question: 'When an official radiological emergency alert instructs civilians to shelter in place, where is the safest location in a typical building?',
    options: [
      'In a top-floor attic or roof balcony to observe wind direction',
      'In a basement or underground cellar, or the center of a dense concrete building away from windows',
      'Inside a parked car in the driveway with windows closed',
      'In a glass sunroom facing away from the power station'
    ],
    correctIndex: 1,
    explanation: 'Basements and the centers of dense concrete or brick structures provide the highest Protection Factors (PF 20-50+), significantly shielding occupants from penetrating gamma radiation and airborne fallout.'
  },
  {
    id: 2,
    topic: 'Decontamination',
    question: 'What is the most effective immediate action you can take to reduce external contamination after walking outdoors during a fallout plume?',
    options: [
      'Scrub skin aggressively with an abrasive wire brush until the skin turns bright red',
      'Gently remove outer shoes, jacket, and clothing, and double-bag them in heavy plastic',
      'Wash hands with boiling water and caustic laundry bleach',
      'Take a hot sauna to sweat out radioactive toxins'
    ],
    correctIndex: 1,
    explanation: 'Carefully removing outer clothing removes up to 90% of all external radioactive fallout particulates. Scrubbing skin with abrasive brushes breaks the epidermal barrier, driving radioactive dust directly into the bloodstream.'
  },
  {
    id: 3,
    topic: 'Water Safety',
    question: 'Why should you NOT boil water collected from an outdoor rain barrel or open stream during a fallout emergency?',
    options: [
      'Boiling activates radioactive particles and causes them to replicate like bacteria',
      'Boiling evaporates clean water steam and concentrates non-volatile radioactive isotopes in the remaining water',
      'Boiled water loses its ability to hydrate the body',
      'Radioactive water cannot reach boiling temperature'
    ],
    correctIndex: 1,
    explanation: 'Radioisotopes are elements, not biological pathogens. Boiling evaporates pure water vapor into the air (creating an inhalation hazard) while leaving radioactive isotopes in the residual liquid, increasing the concentration of ingested radiation.'
  },
  {
    id: 4,
    topic: 'Medical Guidance (KI)',
    question: 'What is the true and sole medical function of Potassium Iodide (KI) tablets during a nuclear incident?',
    options: [
      'To provide a universal shield that repels external gamma radiation from all body organs',
      'To saturate the thyroid gland with stable iodine, blocking uptake of radioactive Iodine-131',
      'To cleanse the kidneys and bloodstream of heavy metals like Cesium and Plutonium',
      'To treat blast trauma and thermal burns caused by steam explosions'
    ],
    correctIndex: 1,
    explanation: 'Potassium Iodide protects ONLY the thyroid gland against radioactive iodine (I-131). It offers zero protection against external gamma rays, Cesium-137, Strontium-90, or other body organs.'
  },
  {
    id: 5,
    topic: 'Medical Priority (Triage)',
    question: 'If a survivor has severe, spurting arterial bleeding from a deep wound AND suspected radioactive dust on their clothes, what is the correct medical triage priority?',
    options: [
      'Thoroughly decontaminate and wash the patient with soap for 45 minutes before treating the bleeding',
      'Immediately control the severe arterial hemorrhage with direct pressure or a tourniquet before decontaminating',
      'Isolate the patient completely and wait for specialized military radiological teams',
      'Administer high doses of table salt and vinegar orally'
    ],
    correctIndex: 1,
    explanation: 'Trauma takes precedence over contamination. Severe arterial bleeding will kill a patient within minutes, whereas radiation takes days or weeks to manifest. Treat life-threatening physical trauma first.'
  },
  {
    id: 6,
    topic: 'Smartphone Detection',
    question: 'Can an uncalibrated smartphone camera with a downloaded app accurately detect dangerous ionizing radiation levels?',
    options: [
      'Yes, smartphone lenses are specifically engineered to measure gamma ray sieverts',
      'No, standard smartphone CMOS sensors lack certified calibration and cannot replace professional dosimeters',
      'Yes, but only if the flashlight is turned on continuously',
      'Yes, but only on devices running 5G cellular connections'
    ],
    correctIndex: 1,
    explanation: 'Smartphones lack ionizing radiation sensors and calibrated shielding. Apps claiming to turn cameras into Geiger counters produce inaccurate noise, creating fatal false confidence.'
  },
  {
    id: 7,
    topic: 'Fallout Decay Physics',
    question: 'According to the nuclear civil defense "Rule of 7/10", what happens to the radiation intensity of fallout as time passes?',
    options: [
      'Radiation intensity increases by 10% every 7 days',
      'For every 7-fold increase in time after detonation/release, the radiation dose rate drops by a factor of 10',
      'Radiation remains at 100% intensity indefinitely for 100 years',
      'Radiation only decays if washed away by heavy rainfall'
    ],
    correctIndex: 1,
    explanation: 'The 7/10 rule is an empirical decay approximation: a dose rate of 100 R/hr at 1 hour drops to 10 R/hr at 7 hours, and drops to 1 R/hr at ~49 hours (approx. 2 days), representing a 99% reduction.'
  },
  {
    id: 8,
    topic: 'Evacuation Procedures',
    question: 'When should civilians evacuate from their homes during a suspected nuclear release?',
    options: [
      'Immediately without waiting for instructions, driving on any available highway',
      'ONLY when officially instructed by competent civil defense authorities along designated evacuation corridors',
      'Never, under any circumstances, even if authorities issue an evacuation order',
      'Only during nighttime when sunlight is absent'
    ],
    correctIndex: 1,
    explanation: 'Uncontrolled self-evacuation leads to highway gridlock where families become trapped inside cars directly under open fallout plumes. Evacuate only along designated corridors managed by civil defense.'
  },
  {
    id: 9,
    topic: 'Ventilation & Infiltration',
    question: 'What immediate action must be taken regarding home ventilation systems when sheltering in place?',
    options: [
      'Turn on all bathroom exhaust fans and window air conditioning units to high',
      'Turn off all HVAC blowers, central heating, and exhaust fans, and close all fireplace dampers',
      'Open windows slightly to equalize atmospheric pressure',
      'Spray aerosols continuously into ceiling vents'
    ],
    correctIndex: 1,
    explanation: 'Exterior fans and AC units pull outdoor air and radioactive particulates directly into your living space. Shutting down all ventilation preserves clean indoor air.'
  },
  {
    id: 10,
    topic: 'Food Safety',
    question: 'Which of the following food sources is SAFEST to consume inside a fallout shelter?',
    options: [
      'Fresh leafy spinach picked from an outdoor home garden',
      'Fresh raw milk collected from a local neighborhood dairy farm',
      'Airtight factory-sealed canned soup wiped with a damp cloth on the exterior before opening',
      'Uncovered bread left on a kitchen countertop near an open window'
    ],
    correctIndex: 2,
    explanation: 'Factory-sealed cans and jars protect contents from physical fallout dust. Wiping the exterior ensures dust does not transfer to the food when the can is opened.'
  },
  {
    id: 11,
    topic: 'Dairy Vector',
    question: 'Why is fresh local cow or goat milk strictly restricted after an atmospheric radiological release?',
    options: [
      'Milk souring is accelerated by radiation rays',
      'Grazing cows rapidly bio-accumulate radioactive Iodine-131 from pasture grass into their milk within 24-48 hours',
      'Cows are physically immune to radioactive contamination',
      'Milk evaporates immediately when exposed to gamma rays'
    ],
    correctIndex: 1,
    explanation: 'Cows ingest fallout over large pasture areas and secrete Iodine-131 rapidly into milk. Ingesting this milk exposes children\'s thyroids to concentrated, dangerous internal doses.'
  },
  {
    id: 12,
    topic: 'Emergency Mesh Communication',
    question: 'In a total infrastructure collapse where cellular towers and internet fail, how does an Emergency Mesh like BitChat transmit messages?',
    options: [
      'By establishing private satellite links to geostationary orbit',
      'By hopping short text packets peer-to-peer between nearby compatible devices using Bluetooth LE / local radios',
      'By amplifying standard 5G cellular signals using phone speakers',
      'By reflecting radio waves off high-altitude clouds'
    ],
    correctIndex: 1,
    explanation: 'Decentralized peer-to-peer mesh networks relay low-bandwidth packets directly from phone to phone using short-range radios (like Bluetooth LE), allowing multi-hop communication without cell towers.'
  },
  {
    id: 13,
    topic: 'Blackout Power Management',
    question: 'What is the most effective way to extend your smartphone\'s battery life during an extended electrical blackout?',
    options: [
      'Keep the screen at maximum brightness so it can serve as a flashlight',
      'Switch the phone to ultra power saver / Blackout Mode with an OLED pure-black background and disable background apps',
      'Continuously place repeated phone calls to check if towers have rebooted',
      'Leave Wi-Fi and Bluetooth scanning continuously on maximum transmit power'
    ],
    correctIndex: 1,
    explanation: 'OLED displays consume virtually zero power when displaying pure black pixels (#000000). Throttling background processes and reducing brightness preserves critical battery hours.'
  },
  {
    id: 14,
    topic: 'Radiation Protection Principles',
    question: 'What are the three fundamental pillars of civilian radiation protection?',
    options: [
      'Speed, Agility, and Strength',
      'Time (minimize), Distance (maximize), and Shielding (dense mass)',
      'Water, Ice, and Steam',
      'Altitude, Oxygen, and Sunlight'
    ],
    correctIndex: 1,
    explanation: 'The Golden Triad of radiation defense is TIME (reduce exposure duration), DISTANCE (maximize separation according to inverse-square law), and SHIELDING (place thick concrete, lead, or earth between you and the source).'
  },
  {
    id: 15,
    topic: 'Misinformation & Panic',
    question: 'If you receive an unverified text message on a community mesh channel claiming that an explosion has occurred, what should you do?',
    options: [
      'Immediately evacuate on the nearest highway without verification',
      'Cross-check instructions via verified battery-operated emergency radio broadcasts before taking major action',
      'Forward the unverified message to all nearby mesh channels immediately',
      'Drink a bottle of topical antiseptic immediately'
    ],
    correctIndex: 1,
    explanation: 'Community mesh messages are unverified peer reports. Unconfirmed rumors cause deadly panics. Always cross-reference major civil defense moves with verified emergency authorities.'
  }
];
