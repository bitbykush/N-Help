import { RadiationLesson, ReactorBarrier } from '../types/educational';

export const RADIATION_LESSONS: RadiationLesson[] = [
  {
    id: 'rad-what-is',
    title: 'What is Radiation & Ionizing Radiation?',
    keyPrinciple: 'Radiation is energy traveling through space. Only ionizing radiation has enough energy to alter atomic structures.',
    content: 'Radiation exists in two primary categories: non-ionizing (radio waves, microwaves, visible light) which lack the energy to break chemical bonds, and ionizing radiation (alpha particles, beta particles, gamma rays, and neutrons) which carry enough energy to strip electrons from atoms, creating charged ions in living cells.',
    practicalRule: 'Ionizing radiation cannot be smelled, tasted, heard, or felt by human senses. Only calibrated instruments (Geiger counters, scintillators) can detect it.'
  },
  {
    id: 'rad-material-vs-rays',
    title: 'Radioactive Material vs. Radiation Rays',
    keyPrinciple: 'The Flashlight Analogy: Radioactive material is the flashlight bulb; radiation is the beam of light.',
    content: 'Radioactive material consists of unstable physical atoms (like Cesium-137 or Iodine-131) emitting energy as they decay. Radiation rays are the bursts of electromagnetic photons or high-speed subatomic particles emitted from that source. If you turn off or move away from the flashlight, the light disappears. If you carry the bulb itself on your clothes, it continues to illuminate.',
    practicalRule: 'Rays cannot "cling" to you, but radioactive dust particulates CAN deposit on skin or clothing.'
  },
  {
    id: 'rad-exposure-vs-contam',
    title: 'External Exposure vs. Internal Contamination',
    keyPrinciple: 'Irradiated does NOT mean radioactive. Only contaminated individuals carry physical dust.',
    content: 'External exposure occurs when penetrating gamma rays pass through a person\'s body from an external source (similar to receiving a medical chest X-ray). The exposed person does NOT become radioactive and cannot irradiate others. Contamination occurs when physical radioactive dust, ash, or liquids deposit on skin or clothing (external) or are inhaled/swallowed (internal).',
    practicalRule: 'An exposed trauma victim is NOT dangerous to touch or treat. Simple removal of outer clothing eliminates ~90% of external contamination.'
  },
  {
    id: 'rad-golden-triad',
    title: 'The Golden Triad: Time, Distance & Shielding',
    keyPrinciple: 'Dose = Rate × Time; Intensity drops with the square of the distance ($1/d^2$).',
    content: 'Civilian radiological defense relies upon three universal physical laws:\n1. TIME: Minimizing the time spent near a radiation source directly reduces total absorbed dose.\n2. DISTANCE: The Inverse-Square Law dictates that doubling your distance from a point source reduces the radiation intensity to one-fourth (25%); tripling distance drops it to one-ninth (11%).\n3. SHIELDING: Dense materials absorb penetrating photons. Half-value layers (HVL) of lead (~1 cm), concrete (~6 cm), packed earth (~9 cm), or water (~18 cm) cut radiation intensity in half.',
    practicalRule: 'Move as far away as possible, stay behind thick concrete or underground walls, and minimize duration.'
  }
];

export const REACTOR_BARRIERS: ReactorBarrier[] = [
  {
    level: 1,
    name: 'Ceramic Fuel Pellet Matrix',
    description: 'High-density uranium dioxide ($UO_2$) ceramic pellets physically lock and retain over 99% of all solid fission products directly inside their microscopic crystalline lattice.',
    failureThreshold: 'Extreme core temperatures exceeding melting point ($>2800^\circ\text{C}$).'
  },
  {
    level: 2,
    name: 'Zirconium Alloy (Zircaloy) Fuel Cladding',
    description: 'Hermetically welded cylindrical tubes that enclose fuel pellets, preventing volatile fission gases from contacting the primary coolant water.',
    failureThreshold: 'Cladding oxidation and ballooning during loss-of-coolant incidents ($>1200^\circ\text{C}$).'
  },
  {
    level: 3,
    name: 'Heavy Reactor Pressure Vessel (RPV)',
    description: 'Massive cylindrical steel vessel forged from thick alloy steel (typically 15 to 25 cm thick), engineered to contain primary coolant pressures up to 155 atmospheres.',
    failureThreshold: 'Severe overpressurization or catastrophic thermal shock.'
  },
  {
    level: 4,
    name: 'Primary Biological Shield',
    description: 'Thick, high-density concrete wall surrounding the reactor vessel, engineered to absorb neutron flux and primary gamma radiation during operation.',
    failureThreshold: 'Severe physical blast impact or structural seismic collapse.'
  },
  {
    level: 5,
    name: 'Hermetic Reinforced Concrete Containment Building',
    description: 'Massive prestressed concrete dome (1 to 2 meters thick) lined with a continuous carbon steel vapor barrier. Engineered to withstand internal design-basis pressures, tornadoes, earthquakes, and external aircraft impact.',
    failureThreshold: 'Overpressure without containment filtered venting.'
  }
];
