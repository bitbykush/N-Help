import { WaterSafetyProtocol, FoodSafetyProtocol } from '../types/emergency';

export const WATER_SAFETY_PROTOCOL: WaterSafetyProtocol = {
  boilingMythDebunk: {
    statement: 'MYTH: "Boiling water eliminates radiation and fallout."',
    reality: 'FATAL ERROR. Boiling water kills living biological microbes (bacteria, viruses, parasites), but has ZERO effect on subatomic radioactive isotopes.',
    vaporHazard: 'Boiling contaminated water evaporates pure water as steam into the air while non-volatile radioactive elements (such as Cesium-137 and Strontium-90) remain behind, INCREASING the radioactive concentration in the pot. Inhaling the resulting radioactive steam causes severe internal lung contamination.'
  },
  tiers: [
    {
      tier: 1,
      title: 'Tier 1 (Safest): Factory-Sealed Bottled Water',
      sources: ['Commercially sealed bottled water', 'Canned juices & sodas', 'Retort beverage pouches'],
      isSafe: true,
      guideline: 'Completely safe inside. Prior to opening, wipe or wash the exterior container with a damp cloth to prevent external fallout dust from falling into the clean liquid.'
    },
    {
      tier: 2,
      title: 'Tier 2 (Safe Indoor Reserves): Sealed Domestic Storage',
      sources: [
        'Hot water heater / geyser tanks (shut off inlet and electricity/gas first)',
        'Pre-plume filled clean indoor carboys and pitchers',
        'Clean water from toilet storage cisterns (NOT the toilet bowl, and only if no chemical deodorizers or blue cleaning blocks were added)'
      ],
      isSafe: true,
      guideline: 'Enclosed indoor storage tanks that were closed prior to the fallout plume arrival contain clean, drinkable water.'
    },
    {
      tier: 3,
      title: 'Tier 3 (Caution): Municipal Tap Water',
      sources: ['Piped domestic tap water'],
      isSafe: false,
      guideline: 'Use for drinking ONLY if local municipal authorities explicitly announce the treatment plant and covered distribution aqueducts are uncompromised. Otherwise, use tap water solely for sanitation, hand-washing, and toilet flushing.'
    },
    {
      tier: 4,
      title: 'Tier 4 (EXTREMELY DANGEROUS): Open & Surface Water',
      sources: [
        'Rainwater collected during or after the plume (rain actively scrubs fallout particulates from the sky)',
        'Rivers, lakes, open ponds, streams, and canals',
        'Uncovered rooftop tanks, shallow open wells, and uncovered hand pumps'
      ],
      isSafe: false,
      guideline: 'STRICTLY PROHIBITED. Highly contaminated with radioactive particulates. Ingestion leads to acute internal dose.'
    }
  ],
  filtrationAdvice: 'Ordinary fabric filters, kitchen sediment cartridges, Brita-style carbon filters, and UV lights CANNOT filter out dissolved radioactive ions. Only certified multi-stage Reverse Osmosis (RO) with ion-exchange resin can reduce dissolved heavy radionuclides, but the RO membrane rapidly becomes an intense secondary radioactive hazard and requires electrical grid pressure to function. Prioritize sealed pre-stored water.'
};

export const FOOD_SAFETY_PROTOCOL: FoodSafetyProtocol = {
  cannedGoodsProcedure: [
    'Sealed metal cans, glass jars with airtight lids, and retort plastic packaging inside pantries are completely protected from internal radiation.',
    'Before opening any canned or jarred item, thoroughly wash the exterior container with mild soap and clean water, or wipe it carefully with a damp paper towel.',
    'Discard the damp paper towel in a sealed plastic bag.',
    'Do not rinse cans with unverified outdoor tap water.'
  ],
  freshProduceDirectives: [
    'Do NOT consume fresh vegetables, garden herbs, or surface fruits that were growing outdoors during or after the fallout plume.',
    'Leafy greens (spinach, lettuce, cabbage) have high surface area and trap fallout dust with extreme efficiency.',
    'In long-term emergencies, underground root vegetables (potatoes, carrots, beets) may be used ONLY if thoroughly scrubbed outside food prep areas, peeled thickly, and rinsed with verified clean water.'
  ],
  dairyWarningIodine131: 'CRITICAL BIOACCUMULATION VECTOR: Dairy cows and goats grazing on pastures contaminated with fallout ingest radioactive Iodine-131 (I-131), which concentrates in their milk within 24 to 48 hours. Children drinking local fresh milk receive massive, dangerous radiation doses to their thyroid glands. DO NOT consume local fresh milk or local cheese. Rely exclusively on pre-disaster canned, condensed, or powdered milk.',
  cookingLimitation: 'Cooking, baking, boiling, microwaving, or deep frying CANNOT alter nuclear radiation. Thermal heat is a molecular chemical process; radioactivity is a nuclear phenomenon. If food is contaminated with radioactive particulates, heat will not neutralize it.'
};
