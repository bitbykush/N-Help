import { MythFactEntry } from '../types/educational';

export const MYTH_FACT_ENTRIES: MythFactEntry[] = [
  {
    id: 'mf-1',
    myth: 'I can detect or sense radiation by smell, metallic taste, or tingling in the air.',
    fact: 'Ionizing radiation is completely undetectable by human sensory organs.',
    scientificExplanation: 'Alpha, beta, and gamma radiation lack chemical aromas, colors, and tactile sensations at civilian exposure levels. Metallic tastes only occur during catastrophic, near-fatal acute whole-body doses. Calibrated Geiger-Müller tubes or scintillators are the only reliable detection tools.',
    severity: 'CRITICAL'
  },
  {
    id: 'mf-2',
    myth: 'My smartphone camera can measure dangerous radiation levels with an app.',
    fact: 'Standard smartphone cameras CANNOT function as calibrated radiation dosimeters.',
    scientificExplanation: 'Phone CMOS sensors are shielded by infrared filters, microlenses, and auto-gain algorithms that produce spurious noise. In a real radiological event, relying on uncertified mobile apps leads to deadly false negatives or panic-inducing false positives.',
    severity: 'CRITICAL'
  },
  {
    id: 'mf-3',
    myth: 'A power grid blackout means a nearby nuclear power plant has suffered an explosion.',
    fact: 'Grid blackouts are routine electrical network events, not indicators of a reactor breach.',
    scientificExplanation: 'High-voltage transmission trips, severe weather, and automatic circuit protection routinely trigger blackouts. Commercial nuclear stations have independent on-site emergency diesel generators and passive decay-heat cooling systems designed to operate without off-site power.',
    severity: 'HIGH'
  },
  {
    id: 'mf-4',
    myth: 'Everyone should immediately swallow Potassium Iodide (KI) pills during any nuclear incident.',
    fact: 'KI protects ONLY the thyroid from radioactive iodine and can be harmful if taken improperly.',
    scientificExplanation: 'Potassium iodide provides zero protection against external gamma rays or other isotopes like Cesium-137 and Strontium-90. Inappropriate ingestion can induce lethal thyroid storm, severe allergic anaphylaxis, or renal complications. Take KI ONLY on explicit civil defense directives.',
    severity: 'CRITICAL'
  },
  {
    id: 'mf-5',
    myth: 'Boiling water from the tap or river removes radioactive fallout.',
    fact: 'Boiling does NOT destroy radiation; it evaporates clean water and CONCENTRATES radioactive isotopes.',
    scientificExplanation: 'Radioactivity is a subatomic property of unstable atomic nuclei, not a biological microbe. Boiling evaporates pure steam into your room (creating an inhalation hazard) while leaving radioactive salts behind in the pot, increasing the ingested dose per cup.',
    severity: 'CRITICAL'
  },
  {
    id: 'mf-6',
    myth: 'Drinking antiseptic liquids (Betadine, iodine tincture, bleach) shields against radiation.',
    fact: 'Ingesting topical antiseptics or household bleach is poisonous and frequently fatal.',
    scientificExplanation: 'Topical povidone-iodine and tinctures contain toxic elemental iodine, causing chemical caustic burns to the esophagus and acute kidney failure. Bleach is a corrosive alkali that causes pulmonary edema and organ perforation.',
    severity: 'CRITICAL'
  },
  {
    id: 'mf-7',
    myth: 'During a nuclear warning, the best action is to jump in your car and flee immediately.',
    fact: 'Spontaneous self-evacuation traps people in highway gridlock directly exposed under open fallout plumes.',
    scientificExplanation: 'Thin automotive sheet metal offers almost zero gamma shielding (Protection Factor ~1.5). Sheltering inside a sealed basement or dense concrete building (Protection Factor 20 to 50+) reduces radiation dose by over 95%.',
    severity: 'HIGH'
  },
  {
    id: 'mf-8',
    myth: 'A nuclear reactor can explode like a nuclear warhead.',
    fact: 'A commercial nuclear power reactor CANNOT explode with a nuclear weapon yield.',
    scientificExplanation: 'Nuclear weapons require highly enriched fissile material (>90% U-235). Commercial power reactors use low-enriched fuel (3% to 5% U-235) and rely on physical moderators and negative reactivity coefficients that make a nuclear detonation physically impossible.',
    severity: 'MEDIUM'
  },
  {
    id: 'mf-9',
    myth: 'You must scrub your skin aggressively with hard brushes until red to remove radiation.',
    fact: 'Abrasive scrubbing breaks the epidermal skin barrier, forcing radioactive particles into the bloodstream.',
    scientificExplanation: 'Hard bristles and scouring pads create microscopic skin tears. Radioactive dust enters capillaries and permanently lodges in bone marrow and internal organs. The official protocol is gentle washing with mild soap and lukewarm water.',
    severity: 'CRITICAL'
  },
  {
    id: 'mf-10',
    myth: 'Nuclear fallout remains intensely lethal for hundreds of years.',
    fact: 'Fallout radioactivity decays with extreme speed according to the "Rule of 7/10".',
    scientificExplanation: 'For every sevenfold increase in elapsed time after release, the radiation rate decreases tenfold. Within 48 hours, residual fallout intensity drops by over 99% compared to the 1-hour mark. This is why immediate 24 to 48-hour sheltering is so protective.',
    severity: 'HIGH'
  },
  {
    id: 'mf-11',
    myth: 'If a person is exposed to radiation, they become radioactive and contagious to others.',
    fact: 'An exposed individual does NOT emit radiation. They are not contagious.',
    scientificExplanation: 'Just as a patient receiving a medical X-ray does not emit X-rays afterward, someone exposed to gamma rays does not emit radiation. If they have dust on their clothes, gently removing those clothes eliminates 90% of all contamination risk.',
    severity: 'HIGH'
  },
  {
    id: 'mf-12',
    myth: 'Cell phones stop working during emergencies because radiation destroys the electronics.',
    fact: 'Phones stop working because cell towers lose electrical grid power and towers suffer extreme traffic congestion.',
    scientificExplanation: 'Radiation levels outside the immediate reactor core are vastly too low to affect solid-state silicon transistors. Towers fail because millions try to place voice calls simultaneously and emergency backup batteries drain within 2 to 4 hours.',
    severity: 'MEDIUM'
  },
  {
    id: 'mf-13',
    myth: 'Eating massive amounts of table salt protects the body from nuclear radiation.',
    fact: 'Table salt (Sodium Chloride, NaCl) provides zero radiological protection.',
    scientificExplanation: 'Table salt contains sodium and chlorine, not potassium iodide. Consuming massive salt amounts induces severe cellular dehydration, hypernatremia, brain edema, and cardiovascular collapse.',
    severity: 'HIGH'
  },
  {
    id: 'mf-14',
    myth: 'Family pets should be abandoned outside during an emergency.',
    fact: 'Pets should be brought indoors immediately to prevent lethal fallout exposure.',
    scientificExplanation: 'Animals accumulate fallout dust in their fur. Bring pets indoors, wipe their coats and paws thoroughly with damp paper towels (which should be double-bagged), and feed them pre-packaged canned or dry food with clean water.',
    severity: 'MEDIUM'
  },
  {
    id: 'mf-15',
    myth: 'All radiation is artificial, man-made, and unnatural.',
    fact: 'Radiation is a natural fundamental constituent of planet Earth and the cosmos.',
    scientificExplanation: 'Every human receives ~2.4 to 3.0 mSv of background radiation every year from cosmic rays, radon gas in bedrock, soil minerals (Thorium/Uranium), and Potassium-40 naturally present in bananas and human bones.',
    severity: 'LOW'
  }
];
