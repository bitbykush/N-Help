# Product Requirements Document (PRD): N-HELP
## Nuclear Emergency Help & Preparedness Platform
**Tagline:** KNOW. PREPARE. RESPOND.  
**Academic Context:** Course CHE110 (Environmental Studies)  
**Project Topic:** Nuclear Disaster Management: Safety Protocols and Preventive Strategies  
**Document Version:** 1.0.0  
**Classification:** Academic Demonstration / Civil Defense Educational Tool  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Disaster Paradox
During a radiological or nuclear emergency (e.g., severe reactor breach, critical facility failure, dirty bomb detonation, or lost industrial source incident), civilian populations confront an acute compounding catastrophe:
1. **Infrastructure Collapse:** The electric grid may shut down or be disabled by secondary faults or grid protection triggers.
2. **Telecommunications Blackout:** Cell towers become instantly saturated by millions of simultaneous distress calls, run out of backup battery power within 2–6 hours, or lose fiber backhaul.
3. **Information Vacuum & Panic:** Lack of reliable instructions spawns toxic rumors, panic-driven stampedes, dangerous self-medication, and lethal exposure.
4. **Communication Failure:** Displaced families cannot locate one another, and civilian volunteers cannot coordinate basic mutual aid.

### 1.2 The N-HELP Solution
**N-HELP** is an offline-first, mobile-optimized progressive web application (PWA) and emergency preparedness platform engineered to operate when normal infrastructure fails. N-HELP couples:
- Authoritative, scientifically verified nuclear safety protocols (IAEA, WHO, AERB, DAE, NDMA aligned).
- Zero-connectivity offline availability (caches all guides, checklists, offline demo maps, and interactive tools via Service Workers and IndexedDB).
- A **Decentralized Emergency Mesh Communication** abstraction inspired by peer-to-peer Bluetooth mesh protocols (such as BitChat), allowing nearby devices to exchange short emergency broadcasts and family reconnect pings via store-and-forward relaying without internet or cellular connectivity.
- Rigorous public misinformation debunking (Myth vs. Fact, Radiation Education, and Emergency Knowledge Quizzes).
- Clear civil defense boundaries and medical warnings.

---

## 2. Product Identity, Roles & Boundaries

### 2.1 Core Identity
- **Product Name:** N-HELP (Nuclear Emergency Help & Preparedness)
- **Tagline:** KNOW. PREPARE. RESPOND.
- **Academic Course:** CHE110 — Environmental Studies
- **Project Topic:** Nuclear Disaster Management: Safety Protocols and Preventive Strategies
- **Primary Target Devices:** Mobile smartphones (iOS & Android via PWA / Add to Home Screen), tablets, and desktop browsers.

### 2.2 Operational Mandate
N-HELP is an **educational preparedness, civil protection guide, and peer-to-peer communication-support system**. It is **NOT** a replacement for government emergency commands, civil defense sirens, or specialized radiological emergency response teams.

---

## 3. User Personas & Core Use Cases

### Persona A: Ananya (Civilian in Emergency Zone)
- **Situation:** Nearby facility alert sirens sound; within 45 minutes, electrical power and 5G internet drop out completely.
- **Needs:** Immediate, unambiguous triage guidance (Shelter vs. Evacuate?), water/food consumption safety, steps to seal doors and windows, and a way to signal family members that she is safe.
- **N-HELP Journey:** Opens installed N-HELP PWA $\to$ Automatically enters **Blackout Mode** $\to$ Reads **Emergency Now** triage $\to$ Follows **Shelter Guidance** $\to$ Checks **Water Contamination Safety** $\to$ Sends "Family Reconnect: Safe indoors" via **Emergency Mesh**.

### Persona B: Vikram (Community Coordinator / Disaster Volunteer)
- **Situation:** Sheltered in a community school basement with 30 neighbors; no cellular connection to emergency services.
- **Needs:** Triage protocols for physical blast injuries vs. suspected radioactive contamination, verified guidelines for checking food stores, tracking local emergency supplies checklist, and broadcasting need for potable water over nearby mesh nodes.
- **N-HELP Journey:** Accesses **Emergency Kit** checklist $\to$ Consults **Medical Help & Contamination Triage** $\to$ Uses **Emergency Mesh Broadcast** to query nearby devices for clean water $\to$ Refers to **Myth vs. Fact** to prevent neighbors from consuming unsafe DIY remedies.

### Persona C: Academic Reviewer / Evaluator (CHE110 Presentation)
- **Situation:** Evaluating the project demo during a 5–7 minute presentation or video walkthrough.
- **Needs:** Clear evidence of working offline capabilities, interactive mesh store-and-forward routing simulation, scientific accuracy in radiation physics and environmental toxicology, and strict adherence to safety standards.
- **N-HELP Journey:** Toggles **Demo Mode** $\to$ Triggers simulated blackout $\to$ Observes $A \to B \to C$ packet relay $\to$ Tests interactive Leaflet map $\to$ Reviews comprehensive citations (IAEA, AERB, WHO).

---

## 4. Detailed Functional Requirements

### 4.1 System Shell & Layout Architecture
- **Primary Landing Experience (Grill-Me Aligned):** 
  - The application launches into the **Home Dashboard (KNOW. PREPARE. RESPOND.)** featuring:
    - High-visibility pulsating **[ 🚨 EMERGENCY NOW ]** triage action banner.
    - Real-time disaster status indicators: Connectivity (`● ONLINE` / `● INTERNET UNAVAILABLE` / `● MESH MODE`), Battery level percentage, and Mesh availability.
    - One-tap quick action cards to the 6 core modules: `Emergency Now`, `Emergency Mesh`, `Safety Guide`, `Blackout Mode`, `Emergency Kit`, and `Emergency Map`.
    - Sticky top-bar **[ 🧪 Demo Mode ]** pill for instant 1-click scenario simulation during academic presentations.
- **Responsive Navigation:** Mobile-first sticky bottom navigation (or top header on desktop) providing one-tap access to `Home`, `Emergency Now`, `Emergency Mesh`, `Safety Guide`, `Tools (Kit & Map)`, and `Settings / More`.
- **Top Disclaimer & Status Bar:**
  - Mandatory persistent banner: *"⚠ ACADEMIC PREPAREDNESS PROTOTYPE — FOLLOW VERIFIED OFFICIAL EMERGENCY INSTRUCTIONS."*
  - Live Connectivity Pill:
    - `● ONLINE`: Normal internet connectivity detected.
    - `● INTERNET UNAVAILABLE`: Network lost; offline service worker active.
    - `● MESH MODE`: Full infrastructure outage; offline peer communication layer active.
  - Live Battery Level Indicator: Displays remaining battery percentage to promote power conservation during blackouts.
  - Quick-Access Language Switcher (English / Hindi bilingual triage + 10 regional Indian languages).

---

### 4.2 Emergency Now (Immediate Action Triage)
Immediate, high-stress visual decision tree designed for maximum readability under extreme panic:
1. **Step 1: Stay Calm & Do Not Panic.**
2. **Step 2: Check Official Emergency Broadcasts.** Instructs users to tune to emergency battery/crank radios (e.g., All India Radio / National Emergency Radio channels) or civil defense sirens.
3. **Step 3: Follow Official Directives (Shelter vs. Evacuate).**
   - Explains that civilians must never self-evacuate into a radioactive plume unless ordered by competent authorities.
4. **Step 4: Avoid Suspected External Contamination.**
   - Strip outer clothing before entering living quarters (removes $\sim 90\%$ of radioactive particulates).
5. **Step 5: Food & Water Ingestion Control.**
   - Cease consumption of unsealed tap water, open water tanks, and fresh outdoor produce.
6. **Step 6: Seek Medical Triage When Necessary.**
   - Immediate first aid for life-threatening trauma before delayed decontamination.

---

### 4.3 Comprehensive Medical Help & Health Safety (Enriched Module)

#### 4.3.1 Critical Medical Disclaimer & Guardrails
- **Not a Medical Prescriber:** N-HELP explicitly states it does not diagnose or prescribe radiation pharmaceuticals.
- **Trauma Over Contamination Priority:** Life-threatening injuries (severe hemorrhage, airway obstruction, cardiac arrest, major blast trauma) take precedence over radiological decontamination. Radiation does not cause instant death; untreated severe blood loss does.

#### 4.3.2 Acute Radiation Syndrome (ARS) vs. Contamination
- **External Exposure vs. Internal Contamination:**
  - *Exposure:* Penetrating gamma/neutron rays pass through the body (like a medical X-ray); the exposed person does **NOT** become radioactive and cannot irradiate others.
  - *Contamination:* Radioactive dust, ash, or liquids deposit on skin/hair (external) or are inhaled/ingested (internal). Contaminated individuals can spread particulates.
- **ARS Symptom Education (For Triage Awareness):**
  - Prodromal phase: Nausea, vomiting, diarrhea, fatigue occurring within hours to days (onset speed correlates with dose).
  - Latent phase: Temporary apparent improvement.
  - Manifest illness phase: Infection vulnerability (bone marrow suppression), gastrointestinal destruction.
  - Warning: Radiation nausea is not contagious; calm the patient and hydrate with sealed electrolyte solutions.

#### 4.3.3 Potassium Iodide (KI) — Critical Warnings & Misuse Hazards
- **Mechanism of Action:** Stable iodine ($^{127}\text{I}$) blocks the thyroid gland from absorbing radioactive iodine ($^{131}\text{I}$), mitigating future thyroid cancer risk.
- **What KI DOES NOT DO:**
  - **DOES NOT protect against external gamma radiation.**
  - **DOES NOT protect any other organ in the human body** (bone marrow, lungs, intestines, kidneys remain unshielded).
  - **DOES NOT protect against other dangerous radionuclides** like Cesium-137 ($^{137}\text{Cs}$), Strontium-90 ($^{90}\text{Sr}$), or Plutonium-239 ($^{239}\text{Pu}$).
- **Dangerous Inappropriate Use & Contraindications:**
  - **Do NOT take KI prophylactically before an emergency is confirmed.** Indiscriminate dosing causes dangerous side effects.
  - **Thyroid Storm / Toxic Goiter:** Lethal complications in individuals with multinodular goiter, Graves' disease, or autoimmune thyroiditis.
  - **Severe Allergic Reactions:** Anaphylaxis or angioedema in individuals with known iodine allergies.
  - **Renal Impairment:** Risk of dangerous hyperkalemia from potassium overdose.
  - **Dosing in Neonates & Pregnant Women:** Requires strict medical supervision; excess iodine can suppress newborn thyroid development, causing irreversible cognitive impairment (cretinism).
- **Lethal DIY "Iodine Substitutes" to NEVER Ingest:**
  - *Povidone-iodine (Betadine)*: Antiseptic intended strictly for topical skin application; toxic if swallowed.
  - *Lugol's solution / Tincture of iodine*: High elemental iodine toxicity causing caustic burns to the esophagus, gastrointestinal necrosis, and kidney failure.
  - *Bleach, hydrogen peroxide, or industrial disinfectants*: Highly corrosive poison; never ingest or use for bathing.

#### 4.3.4 Safe Emergency Decontamination Protocol (Gentle De-Clothing)
- **The 90% Rule:** Carefully removing outer clothing, shoes, and hats removes up to $90\%$ of external radioactive particulates.
- **Procedure:**
  1. Remove clothes slowly to prevent stirring dust into the air; avoid pulling garments over the head (cut shirts off if necessary).
  2. Double-bag contaminated clothing in thick plastic garbage bags, seal with tape, and place far from people and pets.
  3. Wash exposed skin with lukewarm water and mild soap.
  4. **CRITICAL WARNING:** **NEVER scrub vigorously with rough brushes, abrasive sponges, or scourers.** Abrasions break the skin barrier and allow radioactive particles to enter the bloodstream, converting minor external contamination into severe internal contamination.
  5. Blow nose gently and wipe eyelids, ears, and nostrils with clean damp cloths.

---

### 4.4 Water Contamination Safety Protocols (Enriched Module)

#### 4.4.1 The Great Boiling Myth
- **BOILING WATER DOES NOT REMOVE OR DESTROY RADIATION.**
  - Boiling only kills biological pathogens (bacteria, viruses, parasites).
  - Radioactive isotopes are elements (atoms), not microbes.
  - **Vaporization Hazard:** Boiling radioactive water causes water to evaporate as steam while non-volatile radioactive salts and isotopes (like Cesium-137 and Strontium-90) remain behind in the pot, **increasing the concentration of radioactivity** in the remaining water. Inhaling steam from contaminated water can also lead to internal lung contamination.

#### 4.4.2 Safe vs. Unsafe Water Hierarchies
1. **Tier 1 (Safest):** Commercially sealed bottled water, canned beverages, and unopened beverage containers stored indoors prior to the incident.
2. **Tier 2 (Safe Indoor Reserves):**
   - Water stored in the hot water heater/geyser tank (turn off gas/electric supply first to prevent tank damage).
   - Water stored in clean indoor domestic storage carboys filled prior to plume arrival.
   - Clean water in toilet storage cisterns/flush tanks (NOT the toilet bowl, and only if chemical blue tablets or deodorizers have not been added).
3. **Tier 3 (Potentially Contaminated — Treat with Caution):**
   - Tap water: Safe to drink **only** if official municipal authorities verify the municipal water treatment facility and covered aqueduct system remain uncompromised. If unverified, use strictly for non-ingestion purposes (sanitation, flushing).
4. **Tier 4 (EXTREMELY DANGEROUS — DO NOT DRINK):**
   - Rainwater harvested during or after the fallout plume. Rainwater actively scrubs radioactive particulates from the atmosphere ("rainout").
   - Open surface water: Rivers, lakes, ponds, open streams, canals, and uncovered rooftop storage tanks.
   - Shallow uncovered hand pumps or open agricultural wells exposed to airborne particulate deposition.

#### 4.4.3 Household Filtration Realities
- Standard cloth filters, boiling, UV purifiers, and ordinary sediment filters **do not remove radioactive dissolved ions**.
- Certified reverse osmosis (RO) systems with high-density ion-exchange resin stages can remove a significant portion of dissolved heavy metal radionuclides, **BUT**:
  - The RO membrane concentrates radioactive waste and becomes an active radiation hazard.
  - RO systems require electrical grid pressure to function.
  - Therefore, rely first and foremost on **sealed pre-stored water**.

---

### 4.5 Food Contamination Safety Protocols (Enriched Module)

#### 4.5.1 Surface Contamination vs. Food Matrix Absorption
- **Canned, Jarred & Boxed Foods (Inside Pantry):**
  - Sealed metal cans, glass jars, retort pouches, and tightly sealed plastic tubs are **completely safe inside** because radiation cannot penetrate airtight seals to deposit physical radioactive atoms.
  - **Decontamination Protocol:** Before opening, wash the exterior of the can or jar thoroughly with soap and water, or wipe the exterior with a damp cloth or disinfectant wipe to prevent loose dust from falling onto the food during opening. Discard the wipe in a sealed bag.
- **Unsealed Produce & Fresh Foods (High Hazard):**
  - Fresh vegetables, leafy greens (spinach, cabbage, lettuce), outdoor herbs, and fresh fruits exposed to outdoor air or fallout must **NOT be consumed**.
  - Root vegetables (potatoes, carrots, beets) grown underground may be salvageable in extended survival situations **only if**:
    1. Soil is gently washed off away from food prep areas.
    2. The vegetable is peeled thickly and rinsed with verified clean water before cooking.
- **Dairy & Milk Advisory (The Iodine-131 Food Chain Vector):**
  - Dairy cows and goats grazing on fallout-contaminated pastures ingest radioactive iodine ($^{131}\text{I}$), which concentrates rapidly in their milk within 24–48 hours.
  - **Instruction:** Do not consume fresh local milk or fresh cheese produced in the affected region following an incident. Use powdered, evaporated, or canned milk packaged before the emergency.

#### 4.5.2 Cooking Does NOT Neutralize Radioactivity
- Cooking, baking, freezing, microwaves, pressure cookers, or frying do not alter the subatomic nuclear structure of radionuclides.
- Food contaminated with radioactive dust cannot be rendered safe through heat. If unsealed food was exposed to fallout dust, dispose of it.

---

### 4.6 Shelter in Place & Evacuation Guidance

#### 4.6.1 Shelter in Place Guidance
- **Principle:** Staying indoors in a dense structure dramatically attenuates gamma radiation and shields from airborne fallout.
- **Optimal Shelter Locations:**
  - Basement or underground cellars (highest protection factor, PF $\ge 20-50+$).
  - Center of a multi-story concrete/brick building (away from exterior walls and roof).
  - Avoid mobile homes, wooden shacks, glass sunrooms, and top floors directly beneath roofs where fallout dust accumulates.
- **Airflow Sealing:**
  - Turn off all central air conditioning, HVAC blowers, furnace fans, and exhaust vents.
  - Close fireplace flues and dampers.
  - Close and latch all windows and doors. Seal gaps around window frames, door perimeters, and electrical conduits with plastic sheeting and duct tape.
- **Stay Sheltered:** Remain indoors for at least 24 to 48 hours unless officially instructed otherwise, allowing short-lived isotopes (like $^{131}\text{I}$ and decay daughters) to decay significantly.

#### 4.6.2 Evacuation Guidance
- **Authority-Driven:** Evacuate **ONLY** when explicitly instructed by competent government authorities. Spontaneous self-evacuation on clogged highways exposes people to open fallout plumes and vehicle entrapment.
- **Designated Corridors:** Travel solely along officially designated evacuation routes with monitored civil defense radiation checkpoints.
- **Vehicle Precautions:**
  - Keep vehicle windows rolled up tightly.
  - Set ventilation system to "Recirculate / Internal Air" (never "Outside Air").
  - Do not use air conditioning that draws outside air.
  - Keep car radio tuned to emergency frequencies.
- **Evacuation Checklist:** Take the pre-packed N-HELP Emergency Kit, essential medications, government photo IDs, cash, waterproof poncho, and pets (kept in closed carriers).

---

### 4.7 Blackout Mode (Extreme Disaster Resilience)
When the device loses internet/cellular connectivity or when activated manually:
- **Ultra-High Contrast OLED Black Interface:** Background `#000000` with high-contrast amber/yellow (`#F59E0B`, `#EAB308`) and white typography to eliminate battery draw on OLED/AMOLED screens.
- **Live System Status Board:**
  - Battery percentage & charge status (via Battery Status API or manual monitor).
  - Connectivity states: Internet: `OFFLINE`, Cellular: `UNAVAILABLE`, Wi-Fi: `OFF`, Bluetooth: `STANDBY / ACTIVE`, Mesh: `READY`.
- **Instant Offline Action Launcher:** One-tap tiles for Emergency Now, Safety Guide, Emergency Kit, Leaflet Map, Family Plan, Contacts, and BitChat Guide.
- **Reduced Animation & Throttled Processing:** Disables CPU-heavy transitions to conserve every milliampere of device battery.

---

### 4.8 Emergency Mesh Communication System

#### 4.8.1 Concept & Architectural Decoupling (Grill-Me Aligned)
N-HELP recognizes that standard web browsers cannot natively execute full background Bluetooth Low Energy (BLE) mesh stacks due to browser sandbox constraints and lack of OS-level BLE peripheral advertising APIs in Web Bluetooth.
Therefore, N-HELP implements a **Modular Architecture & Dual-Engine Strategy**:
1. **PWA UI Layer:** Universal communication interface for composing broadcasts, channels, and family pings.
2. **CommunicationManager:** An abstraction engine that routes packets through available transports based on connectivity state.
3. **Transport Implementations:**
   - `InternetTransport`: Normal HTTP/WebSocket communication when online.
   - `LocalBrowserTransport` (Engine 1 - Real Local Peer Communication): Utilizes the standard browser `BroadcastChannel` API (`n-help-mesh-bus`). Allows two or more separate tabs, windows, or split-screen browsers on the same device or local network to exchange real data packets in real-time with zero internet connection.
   - `DemoMeshTransport` (Engine 2 - Animated Multi-Hop Relay Simulation): Interactive, high-fidelity store-and-forward simulator demonstrating multi-hop message relaying ($A \to B \to C$) with TTL, hop countdown, node failure injection, and queue states for academic evaluation.
   - `NativeMeshTransport`: IPC adapter designed to interface with native Android (Kotlin) or iOS (Swift) background companion apps utilizing Bluetooth LE mesh via `window.NHelpNativeMeshBridge`.
4. **Native Android Companion Package (Grill-Me Aligned):**
   - In addition to the pure Web/PWA, N-HELP provides a complete native Android companion project blueprint (`android/` directory).
   - Uses Android WebView / Capacitor with a native Kotlin background service implementing `BluetoothLeAdvertiser` (peripheral mode) and `BluetoothLeScanner` (central mode) inspired by BitChat's protocol.
   - Bridges physical device-to-device Bluetooth LE mesh broadcasting directly into N-HELP's JavaScript `CommunicationManager`.

#### 4.8.2 Emergency Channels
Pre-configured, low-bandwidth communication channels:
- `#emergency-general`: Broad community status updates.
- `#medical-help`: Critical injury alerts and requests for first aid supplies.
- `#shelter-info`: Designated community shelter locations and capacity.
- `#family-reconnect`: Short pings to locate separated family members.
- `#supplies`: Clean water, baby food, and battery sharing.
- `#missing-persons`: Inquiries regarding separated dependents.
- `#local-information`: Street-level road blockages and hazards.

#### 4.8.3 Message Classification & Trust Badges
Every message displayed in the mesh UI must feature one of three visual badges:
1. `🛡️ VERIFIED OFFICIAL`
   - High-contrast gold/amber shield badge.
   - Reserved strictly for authorized, authenticated civil defense broadcasts.
   - Clarified with: *"Simulated sample in Academic Mode. In production, requires cryptographic public key signature from civil defense authorities."*
2. `👥 COMMUNITY MESSAGE`
   - Neutral slate/blue badge.
   - Accompanied by warning: *"Unverified peer message. Do not treat user-generated reports as official government instructions."*
3. `🧪 DEMONSTRATION`
   - Cyan/purple badge for academic testing.

#### 4.8.4 Store-and-Forward Relay & State Machine
Simulates and models delay-tolerant networking (DTN):
- Nodes without active routes buffer packets locally in IndexedDB.
- When a new peer enters proximity, queued messages are transmitted.
- **Message States:**
  - `QUEUED`: Stored locally awaiting compatible peer.
  - `RELAYED`: Transmitted to an intermediary hop (e.g., Phone B).
  - `DELIVERED`: Acknowledged by target recipient or broadcast across channel.
  - `FAILED`: Time-to-Live (TTL) expired without route.
- **Visual Hop Diagram:** Interactive visualizer displaying packet motion:
  $$\text{Phone A} \xrightarrow{\text{BLE Mesh Hop 1}} \text{Phone B (Relay Node)} \xrightarrow{\text{BLE Mesh Hop 2}} \text{Phone C (Destination)}$$
- **Packet Overhead Mitigation:** Strict 140-character limit, zero video/image attachment support in mesh mode, cryptographic message IDs to prevent relay loops and duplicate display.

#### 4.8.5 Family Reconnect
- Allows users to define a local private family roster (e.g., Dad, Mom, Sister, Self).
- Provides pre-configured, low-bandwidth single-tap status pings:
  - *"I am safe."*
  - *"Sheltered at home."*
  - *"At designated community shelter."*
  - *"Need medical assistance."*
  - *"Heading to agreed meeting location."*
  - *"Battery low (<15%)."*
- All roster details remain strictly local in IndexedDB until the user explicitly hits send.

---

### 4.9 BitChat Companion Integration & Documentation Guide
A dedicated civil defense guide educating users on how to deploy real-world Bluetooth LE mesh tools:
- **What is BitChat?** An open-source, decentralized, peer-to-peer messaging application using Bluetooth LE mesh and Wi-Fi Aware, supporting multi-hop packet routing and store-and-forward mechanics without cellular or internet infrastructure.
- **Official Source Verification:** Instructs users to install BitChat strictly from verified, official source repositories (official project releases / GitHub) and **warns against downloading APKs from unverified third-party mirrors**.
- **OS Permissions & Configuration:**
  - Android: Requires Bluetooth, Nearby Devices (`BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `BLUETOOTH_ADVERTISE`), Location permissions (required by Android OS for BLE scanning), and Battery Optimization exemptions.
  - iOS: Requires Bluetooth sharing permissions.
- **Security & Cryptography Advisory:** Explains that while peer-to-peer mesh provides physical resilience, public channels are unencrypted broadcasts, and private channels may not have undergone formal external cryptographic auditing. N-HELP treats mesh strictly as **communication support**, never as official authority.
- **Button:** `[ Open Official BitChat Project Repository ]` (pointing to verified repository).

---

### 4.10 Emergency Tools & Offline Local Storage

#### 4.10.1 Interactive Emergency Kit Checklist
Interactive checklist structured by critical survival categories:
- **Water & Hydration:** 1 gallon (3.8 liters) per person per day for minimum 3 days; water purification tablets.
- **Food & Nutrition:** 3-day supply of non-perishable canned food, high-energy bars, manual can opener.
- **Radiation & Medical First Aid:** Sterile bandages, tourniquet, antiseptic wipes, sterile saline wash, prescribed family medications, dust masks / N95 respirators (to filter airborne fallout particulates).
- **Power & Light:** High-lumen LED torch, spare alkaline batteries, multi-port charged power banks, solar/hand-crank emergency radio.
- **Sanitation & Hygiene:** Heavy-duty plastic garbage bags, duct tape (for sealing windows), cable ties, moist towelettes, soap.
- **Important Documents:** Waterproof folder containing photo IDs, deed copies, medical insurance records, family emergency plan.
- **Interactive Capabilities:** Item checking, persistent storage in IndexedDB, custom item addition, completion progress bar ($X/Y$ items ready).

#### 4.10.2 Family Emergency Plan Generator
- Guided form fields:
  - Family/Group Name.
  - Primary Contact & Out-of-Area Emergency Contact.
  - Primary Meeting Location (Near home) & Secondary Meeting Location (Outside neighborhood).
  - Designated Evacuation Center / Safe Haven.
  - Specific Medical Needs / Dependent Care Notes.
- **Actions:**
  - `[ Save Plan to Device ]` (IndexedDB persistent storage).
  - `[ Export / Print Emergency Card ]` (generates formatted printable card for physical wallets).

#### 4.10.3 Leaflet Emergency Demonstration Map (Grill-Me Aligned)
- Interactive, responsive map built with Leaflet.js:
  - Works completely offline using cached vector geometry or pre-cached base tiles.
  - Prominent persistent overlay: **"ACADEMIC DEMONSTRATION MAP — NOT AN OFFICIAL EVACUATION MAP"**.
  - **Indian Regulatory Scenario (AERB & IAEA Standards):**
    - **Simulated Facility:** Narora Atomic Power Station (NAPS, Bulandshahr, Uttar Pradesh - $28.1578^\circ\text{ N}, 78.4144^\circ\text{ E}$) / Kalpakkam (MAPS, Tamil Nadu).
    - **Precautionary Action Zone (PAZ):** $0-5\text{ km}$ inner radius (immediate sheltering & evacuation planning zone).
    - **Urgent Protective Action Planning Zone (UPZ):** $5-15\text{ km}$ secondary radius (food/water monitoring and decontamination control).
    - **Safe Shelters:** Designated reinforced concrete civic shelters, community underground basements.
    - **Medical Aid Stations:** District Trauma Center, Decontamination Triage Center, Primary Health Center.
    - **Decontamination Checkpoints:** Road access control stations along state highways.
  - Clickable pins provide facility type, capacity, real-time simulated status, and civil defense instructions.

#### 4.10.4 Emergency Contacts Manager (Grill-Me Aligned)
- Pre-populated with verified National Indian Disaster Helplines:
  - **112**: National Emergency Response Support System (ERSS - Police, Fire, Ambulance unified)
  - **1078**: National Disaster Management Authority (NDMA) Disaster Helpline
  - **108**: Emergency Medical & Disaster Ambulance Services
  - **101**: Fire & Rescue Services
  - **100**: Police Control Room
  - **AERB Emergency Response Centre (ERC)**: Crisis Management Helpline ($+91\text{-}22\text{-}2599\text{ }0100$)
  - Explicit disclaimer: *"National reference helplines shown. Local district disaster control room numbers vary by state and district."*
- Full offline CRUD capability: Users can add, edit, delete, call, or copy custom family and local community volunteer contacts stored safely in local IndexedDB.

---

### 4.11 Public Education & Misinformation Awareness

#### 4.11.1 Safety Guide (Before, During, After)
15+ categorized articles written with rigorous environmental studies rigor. Every guide includes:
- **What to Do** (concise, actionable bullet points).
- **What NOT to Do** (preventing dangerous errors).
- **Important Notice** (vital environmental physics context).
- **Authoritative Sources** (citations: IAEA GS-R-2, WHO Radiation Emergency Guidance, AERB Safety Manuals, NDMA Nuclear Guidelines).

#### 4.11.2 Radiation Basics
- What is Radiation? (Electromagnetic spectrum vs. particle radiation).
- Non-ionizing vs. Ionizing Radiation (UV/radio vs. X-ray/Gamma/Alpha/Beta).
- Radioactive Material vs. Radiation Rays (The flashlight vs. light bulb analogy).
- Exposure vs. Contamination (Standing in the beam vs. carrying the dust).
- **The Golden Triad of Radiation Protection:**
  - **Time:** Minimize duration near sources ($\text{Dose} \propto \text{Time}$).
  - **Distance:** Maximize separation (Inverse-Square Law: doubling distance quarters the dose rate, $I \propto \frac{1}{d^2}$).
  - **Shielding:** Dense materials (lead, thick concrete, packed earth, water) absorb penetrating gamma photons.

#### 4.11.3 Nuclear Facility Safety & Defence-in-Depth
- How Nuclear Power Works (Fission, fuel bundles, moderator, coolant).
- The 5 Physical Barriers of Defence-in-Depth:
  1. Ceramic fuel pellet matrix (retains $99\%$ of fission products).
  2. Zircaloy fuel cladding tubes.
  3. Heavy reactor pressure vessel (thick steel walls).
  4. Primary biological radiation shield (high-density concrete).
  5. Hermetic containment building (prestressed reinforced concrete dome engineered to withstand internal pressure and aircraft impacts).
- Emergency Planning Zones (On-site vs. Off-site emergency classifications).

#### 4.11.4 Myth vs. Fact Library (15+ Verified Entries)
1. *Myth: "I can sense radiation by smell, taste, or metallic air feeling."*  
   **Fact:** Ionizing radiation is completely undetectable by human senses. Only specialized Geiger-Müller tubes or scintillators can measure it.
2. *Myth: "My smartphone camera can measure dangerous radiation levels with an app."*  
   **Fact:** Standard CMOS sensors cannot reliably measure radiation doses without specialized calibration, light-shielding covers, and algorithm validation. Fraudulent apps give lethal false confidence.
3. *Myth: "A power blackout means a nearby nuclear plant has exploded."*  
   **Fact:** Grid blackouts occur routinely due to transmission line trips, storms, or grid balance faults. Nuclear plants have on-site emergency diesel generators and passive cooling systems.
4. *Myth: "Everyone should take Potassium Iodide (KI) pills immediately in any nuclear incident."*  
   **Fact:** KI only protects the thyroid against radioactive iodine; it does nothing for external radiation or other isotopes, and causes severe side effects if taken inappropriately.
5. *Myth: "Boiling water removes radiation from fallout."*  
   **Fact:** Boiling kills bacteria but concentrates radioactive isotopes. Only drink sealed bottled water.
6. *Myth: "Drinking diluted antiseptic or iodine tincture protects against radiation."*  
   **Fact:** Ingesting topical antiseptic is poisonous and can cause kidney and esophageal destruction.
7. *Myth: "In an emergency, the safest thing is to jump in your car and drive away immediately."*  
   **Fact:** Self-evacuating clogs roads and traps you in your car under the open fallout plume. Sheltering indoors offers vastly superior protection.
8. *Myth: "A nuclear reactor can explode like a nuclear weapon."*  
   **Fact:** Commercial reactors use $3-5\%$ low-enriched uranium, making a nuclear weapon yield physics explosion physically impossible.
9. *Myth: "You must scrub your skin aggressively until it turns red to get radiation off."*  
   **Fact:** Vigorous scrubbing causes skin abrasions, allowing radioactive particles to enter your bloodstream. Wash gently with mild soap.
10. *Myth: "Nuclear fallout remains intensely radioactive forever."*  
    **Fact:** The 7/10 rule of fallout decay means for every sevenfold increase in time after detonation/release, radiation drops by a factor of 10. Within 48 hours, intensity drops by over $99\%$.
11. *Myth: "If someone is exposed to radiation, they are contagious and you shouldn't touch them."*  
    **Fact:** An irradiated person does not emit radiation. If they have dust on them, removing their clothes eliminates $90\%$ of contamination.
12. *Myth: "Cell phones stop working because radiation fries the electronics."*  
    **Fact:** Phones fail because towers lose power and cellular networks suffer extreme call congestion.
13. *Myth: "Eating raw salt or vinegar shields your body from radiation."*  
    **Fact:** Common table salt ($NaCl$) contains no active shielding properties; excess consumption causes dehydration and hypertension.
14. *Myth: "Pets should be left outside during a nuclear emergency."*  
    **Fact:** Pets should be brought indoors immediately. If they were outside, wipe their paws and fur with damp cloths before letting them inside living areas.
15. *Myth: "All radiation is man-made and unnatural."*  
    **Fact:** Humans are bathed in background radiation daily from cosmic rays, radon gas, soil rocks, and dietary potassium-40.

#### 4.11.5 Emergency Knowledge Quiz (15+ Questions)
- 15 scenario-based, multi-choice educational questions assessing sheltering, decontamination, water safety, mesh communication, and radiation physics.
- **Scoring Principle:** Shows *"Knowledge Score: X / 15"* with detailed rationale for each answer. Never says *"YOU ARE SAFE"*.

---

### 4.12 Platform Experience & Technical Features

#### 4.12.1 Progressive Web App (PWA) Requirements
- Fully compliant `manifest.json`:
  - `name`: "N-HELP: Nuclear Emergency Help & Preparedness"
  - `short_name`: "N-HELP"
  - `display`: "standalone"
  - `theme_color`: "#0B0F19"
  - `background_color`: "#000000"
  - Valid high-resolution maskable and standard icons (192px, 512px).
- Custom Service Worker (`sw.js`):
  - Pre-caches core HTML, bundled CSS/JS, and static educational data on first visit.
  - Stale-While-Revalidate caching strategy for application pages.
  - Cache-First fallback for all emergency guides and checklist data.
  - Allows full offline functionality if reopened while disconnected.
- In-App Install Prompt: Custom banner and modal detecting browser installation support, with step-by-step instructions for iOS Safari ("Share $\to$ Add to Home Screen") and Android Chrome.

#### 4.12.2 Global Offline Search
- Client-side search indexing all Safety Guides, Radiation Basics, Nuclear Reactor articles, Myth vs. Fact, Checklist items, and FAQs.
- Instant fuzzy query execution with zero network latency.

#### 4.12.3 Multilingual Readiness & Hindi Bilingual Core (Grill-Me Aligned)
- **Primary Language:** English (complete technical and safety manuals).
- **Critical Bilingual Tier (Hindi - हिन्दी):**
  - Full native Hindi translations for the high-stress **Emergency Now** triage workflow ("आपातकालीन कदम: शांत रहें, आधिकारिक रेडियो सुनें, आश्रय लें"), key life-safety action buttons, decontamination warnings, and water/food safety alerts.
- **Regional Indian Languages Selector:**
  - Interactive language selector supporting extensible translation dictionaries for 10 major Indian constitutional languages:
    - Hindi (हिन्दी)
    - Bengali (বাংলা)
    - Tamil (தமிழ்)
    - Telugu (తెలుగు)
    - Marathi (मराठी)
    - Gujarati (ગુજરાતી)
    - Punjabi (ਪੰਜਾਬੀ)
    - Malayalam (മലയാളം)
    - Kannada (ಕನ್ನಡ)
    - Odia (ଓଡ଼ିଆ)
  - Features sample translated emergency terms and a clear readiness indicator for community-verified safety translations.

---

## 5. Non-Functional Requirements

### 5.1 Performance & Resource Efficiency
- **Initial Bundle Size:** $< 350\text{ KB}$ gzipped.
- **First Contentful Paint (FCP):** $< 1.0\text{ s}$ on 4G / offline cache.
- **Zero API Dependency:** No remote database queries required for core safety functions.

### 5.2 Accessibility & Usability (WCAG 2.1 AA)
- Minimum touch target size $\ge 48\times 48\text{ px}$.
- High contrast color ratios ($\ge 7:1$ in Blackout Mode, $\ge 4.5:1$ in standard dark mode).
- Full keyboard navigation and ARIA landmarks for screen-reader accessibility.
- Reduced motion support honoring `prefers-reduced-motion`.

### 5.3 Privacy & Data Sovereignty
- **Zero Sign-Up / Zero Login:** No user accounts, passwords, or emails required.
- **Local-Only Storage:** All family plans, kit checklists, custom contacts, and quiz scores reside strictly in browser IndexedDB/LocalStorage. No telemetry, analytics, or tracking cookies.

---

## 6. Academic Presentation & Demonstration Workflow (Grill-Me Aligned)

For the CHE110 project video / presentation (5–7 minutes):
- **Presentation Controls:**
  - **Sticky Top Bar '🧪 Demo Mode' Pill:** One-tap trigger accessible from any view to launch or pause the disaster simulation sequence.
  - **Settings Toggle & 1-Click Scenario Runner:** Automatically cycles through the simulated disaster sequence, with an **Instant Reset** button to restore normal baseline data.
- **Walkthrough Acts:**
  1. **Act 1: Normal Operation (Online):** Introduce N-HELP at `/n-help`, explain the civil defense problem, demonstrate PWA install prompt.
  2. **Act 2: The Emergency & Blackout:** Click `[ 🧪 Demo Mode ]` $\to$ Trigger simulated nuclear event + telecommunications collapse $\to$ App enters **Blackout Mode**, displays battery percentage, offline radios, and emergency warning.
  3. **Act 3: Immediate Triage:** Open **Emergency Now** $\to$ Toggle Hindi/English $\to$ Walk through Shelter Guidance, Water Contamination (debunking boiling), and Gentle Decontamination protocols.
  4. **Act 4: Emergency Mesh Demonstration:** Open **Emergency Mesh** $\to$ Send emergency broadcast "Need potable water" $\to$ Animate multi-hop packet relay ($A \to B \to C$) $\to$ Show Message Queued $\to$ Relayed $\to$ Delivered lifecycle $\to$ Show real cross-tab communication $\to$ Transmit Family Reconnect status ping.
  5. **Act 5: Preparedness Tools:** Check off items in the **Emergency Kit**, show the **Family Emergency Plan** with print preview, inspect the **Narora Facility Leaflet Map** (PAZ / UPZ zones).
  6. **Act 6: Public Awareness & Verification:** Walk through **Myth vs. Fact**, complete a question in the **Emergency Quiz**, review **BitChat Companion Guide** with official repository link, and highlight authoritative references (IAEA, AERB, NDMA).
