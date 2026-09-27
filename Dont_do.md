# SAFETY & OPERATIONAL GUARDRAILS: What N-HELP Must NEVER Do
## Project: N-HELP (Nuclear Emergency Help & Preparedness)
**Course:** CHE110 (Environmental Studies)  
**Topic:** Nuclear Disaster Management: Safety Protocols and Preventive Strategies  
**Document:** `Dont_do.md`  
**Status:** Mandatory Architectural & Content Constraints  

---

## 1. Prime Directive: Operational Authority & Legal Boundaries

> [!CAUTION]
> **N-HELP IS AN ACADEMIC PREPAREDNESS AND PEER-COMMUNICATION PROTOTYPE.**  
> It does not possess, represent, or substitute for governmental civil defense authority.

1. **NEVER pretend to be an official government emergency application.**  
   - Do NOT display fake seals, government logos, or misrepresent endorsement by NDMA, AERB, DAE, IAEA, or WHO.
   - Prominently display: *"Academic Emergency Preparedness Prototype. Follow verified official instructions from competent disaster management authorities."*
2. **NEVER independently declare that a real nuclear or radiological emergency is underway.**  
   - The application must NEVER trigger autonomous panic alarms, unilateral siren alerts, or broadcast unsanctioned catastrophe declarations.
   - All simulated alarms must be explicitly tagged **"DEMO / ACADEMIC SIMULATION"**.
3. **NEVER tell users to evacuate or shelter based on automated algorithms or user calculations.**  
   - Evacuation and sheltering decisions are strategic civil defense operations determined exclusively by incident commanders using real-time atmospheric plume modeling and aerial gamma surveys.
   - N-HELP must repeatedly reiterate: *"FOLLOW OFFICIAL DIRECTIVES ISSUED BY CIVIL AUTHORITIES VIA EMERGENCY BROADCASTS."*
4. **NEVER invent fictitious emergency broadcast alerts, evacuation zones, radiation readings, or emergency phone numbers.**  
   - Do NOT populate dummy data that looks indistinguishable from active national emergency alerts.

---

## 2. Radiation Physics & Hardware Limitations

1. **NEVER claim or imply that a normal smartphone can detect dangerous ionizing radiation.**  
   - Standard smartphone CMOS image sensors, microphones, ambient light sensors, and magnetometers **CANNOT** function as calibrated dosimeters or Geiger-Müller counters.
   - Fraudulent mobile "radiation detector" apps are lethal hazards in a disaster, giving civilians false negative readings in lethal radiation fields or false positive panic in harmless background noise.
   - The application must explicitly state: *"Smartphones lack ionizing radiation sensors. Only certified dosimeters and Geiger counters can detect radiation."*
2. **NEVER give instructions for finding, touching, handling, or transporting radioactive debris or sources.**  
   - If an unshielded industrial radiography source or reactor fuel fragment is encountered, the sole valid protocol is: **RECOGNIZE, RETREAT, AND REPORT.**
   - Do NOT provide "safe handling tricks", "improvised shielding boxes", or "burial instructions".
3. **NEVER claim a specific fixed range for peer-to-peer mesh communications.**  
   - Radio frequency propagation in disaster rubble varies unpredictably. Do NOT state "guaranteed 100-meter range". State: *"Actual transmission range depends on device hardware, RF interference, concrete shielding, and environmental topography."*

---

## 3. Medical Help, First Aid & Health Safety Boundaries

> [!WARNING]
> **UNVERIFIED MEDICAL TREATMENTS IN A RADIATION EMERGENCY CAN BE FATAL.**

1. **NEVER prescribe or encourage unguided, prophylactic Potassium Iodide (KI) ingestion.**  
   - **Do NOT advise taking KI before an official emergency instruction is confirmed.**
   - **Do NOT present KI as a universal "anti-radiation pill".** It protects **only the thyroid gland** against radioactive iodine ($^{131}\text{I}$). It provides **zero protection** against external gamma radiation, Cesium-137, Strontium-90, or Plutonium-239.
   - Must explicitly list severe medical hazards:
     - Danger of **thyroid storm** in individuals with Graves' disease, toxic nodular goiter, or autoimmune thyroiditis.
     - Danger of **severe allergic anaphylaxis** in individuals with iodine hypersensitivity.
     - Danger of **hyperkalemia and cardiac arrhythmia** in individuals with renal failure.
     - Danger of **permanent thyroid suppression (cretinism)** in neonates and fetuses if taken without pediatric medical dosing.
2. **NEVER provide or tolerate unsafe DIY radiation "treatments" or ingestible chemicals.**  
   - **NEVER advise drinking topical antiseptics (povidone-iodine / Betadine, Lugol's solution, iodine tincture).** Ingesting topical antiseptic burns the esophagus, causes gastrointestinal perforation, and leads to lethal acute renal necrosis.
   - **NEVER suggest ingesting bleach, chlorine, hydrogen peroxide, vinegar, or industrial disinfectants.**
   - **NEVER suggest eating massive quantities of table salt ($NaCl$).** Salt does not block radiation and induces severe dehydration, electrolyte collapse, and hypertensive crises.
3. **NEVER instruct users to scrub their skin aggressively during decontamination.**  
   - Hard bristle brushes, abrasive scouring pads, or scalding water abrade the epidermis.
   - Skin abrasions allow external radioactive particulates to penetrate directly into the capillary bloodstream, converting easily-washed external contamination into lethal internal organ contamination.
   - The rule is strictly: **Gentle washing with lukewarm water and mild soap. Never abrade.**
4. **NEVER prioritize radiological decontamination over life-threatening trauma.**  
   - In severe disaster triage: severe arterial bleeding, airway obstruction, tension pneumothorax, and severe shock must be treated immediately before decontamination. A patient will die of hemorrhage in minutes, whereas radiation takes days to manifest.

---

## 4. Water & Food Contamination Guardrails

1. **NEVER claim that boiling water removes, neutralizes, or destroys radiation.**  
   - Boiling kills living microbes; it has **zero effect on subatomic radioactive isotopes**.
   - Boiling contaminated water **evaporates pure water vapor and concentrates radioactive isotopes** (e.g., $^{137}\text{Cs}$, $^{90}\text{Sr}$) in the residual liquid, increasing toxicity. Inhaling the resulting radioactive steam also causes internal lung contamination.
2. **NEVER suggest drinking rainwater collected during or immediately after fallout.**  
   - Rain droplets actively scrub radioactive particulates out of the air ("rainout" / "washout"), making fresh fallout rain intensely radioactive.
3. **NEVER claim ordinary cloth masks or simple kitchen filters make contaminated water safe to drink.**  
   - Activated carbon and cloth filters do not remove dissolved radioactive salts.
4. **NEVER suggest cooking, baking, or frying contaminated food makes it safe.**  
   - Thermal energy cannot alter nuclear isotope stability.
   - If food has been directly exposed to fallout dust, heat will not decontaminate it.
5. **NEVER advise consuming fresh local dairy (cow/goat milk) or leafy outdoor vegetables.**  
   - Dairy concentrates Iodine-131 within 24–48 hours of cattle grazing on contaminated pastures. Only commercially sealed pre-disaster canned or powdered milk is safe.

---

## 5. Communications & Emergency Mesh Integrity

1. **NEVER fake native Bluetooth Mesh functionality in standard web browsers.**  
   - Standard browser sandboxes and Web Bluetooth APIs do NOT support the Bluetooth SIG Mesh profile or background peripheral mesh advertising.
   - Do NOT mislead the user by claiming the web app alone is creating a physical Bluetooth mesh without a native companion layer.
   - Always clearly label the browser simulation as **"DEMO — SIMULATED MESH"** and explain the native companion architecture.
2. **NEVER allow ordinary user-generated mesh messages to resemble official government emergency broadcasts.**  
   - Community messages must be visually distinct (slate/neutral badge, standard bubble).
   - Official alerts must possess a distinct gold/amber shield badge and explicit authentication status.
   - Prominently display: *"Messages in the mesh are unverified. Do not treat user messages as official emergency instructions."*
3. **NEVER fake successful message delivery.**  
   - If a message has not reached its target or acknowledged by a peer, display `QUEUED` or `RELAYED`. Never falsely mark an unverified packet as `DELIVERED`.
4. **NEVER link to unverified third-party APK mirrors or pirate distribution sites for BitChat.**  
   - Point exclusively to the official, verified project repository. Third-party APK mirrors often bundle malware or spyware that jeopardizes civilian devices during emergencies.

---

## 6. Privacy, Security & User Data

1. **NEVER require user registration, logins, passwords, emails, or phone numbers to access emergency guides.**  
   - In an emergency, authentication paywalls and sign-ups cost precious minutes and fail completely when internet servers are unreachable.
2. **NEVER send local user data (family plans, kit checklists, custom contacts) to remote servers.**  
   - Maintain a strict local-first, zero-telemetry architecture. All user data stays in local browser storage (IndexedDB/LocalStorage).
3. **NEVER transmit sensitive unencrypted personal details over public mesh channels.**  
   - Family Reconnect must transmit standardized, low-bandwidth status flags (e.g., "Safe", "At Shelter") rather than sensitive home addresses or banking details.

---

## 7. Summary Checklist for Code Reviews

- [ ] Does the UI display the persistent disclaimer that N-HELP is an academic prototype?
- [ ] Are all simulated emergency alerts watermarked with "DEMO / SIMULATION"?
- [ ] Does the Medical Guide emphasize that life-threatening trauma precedes decontamination?
- [ ] Does the Potassium Iodide guide explicitly list contraindications and non-protection against external gamma rays?
- [ ] Is the boiling water myth explicitly debunked with an explanation of concentration hazards?
- [ ] Is skin scrubbing explicitly forbidden in decontamination instructions?
- [ ] Are community mesh messages clearly demarcated from official broadcasts?
- [ ] Is the browser mesh clearly labeled as a simulation with an explanation of native companion requirements?
- [ ] Are all family plans and kit items stored purely client-side without external tracking?
