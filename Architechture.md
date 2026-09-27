# Technical Architecture & Implementation Specification
## Project: N-HELP (Nuclear Emergency Help & Preparedness)
**Course:** CHE110 (Environmental Studies)  
**Topic:** Nuclear Disaster Management: Safety Protocols and Preventive Strategies  
**Document:** `Architechture.md` (also aliased as `Architecture.md`)  
**Version:** 1.0.0  
**Stack:** React 19, TypeScript, Vite, Tailwind CSS, Leaflet, IndexedDB, Service Worker PWA  

---

## 1. System Overview & Architectural Philosophy

N-HELP is engineered around three disaster-grade computing principles:
1. **Zero-Cloud Dependency (Offline-First):** Core safety instructions, radiation physics guides, interactive checklists, decontamination protocols, and emergency maps must load and execute when the device has zero connectivity to the internet or cellular network.
2. **Defensive Trust Boundaries:** Strict isolation between unverified community peer messages, simulated educational broadcasts, and cryptographic official alert standards.
3. **Transport-Agnostic Communication Abstraction:** The user interface never talks directly to a specific radio API. Instead, all messaging operations pass through a unified `CommunicationManager` that routes packets through the optimal available transport (Internet, Local Browser, Native Mesh Bridge, or Academic Demo Mesh Simulator).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        N-HELP Application UI Layer                     │
│  (Emergency Now, Mesh Chat, Blackout View, Kit, Map, Guides, Quiz)     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                    EmergencyContext & State Store                      │
│             (Reactive UI state, Offline Data, Power Status)            │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │                                          │
┌──────────────▼─────────────┐             ┌──────────────▼──────────────┐
│     Local Storage Layer    │             │    Communication Manager    │
│  (IndexedDB + LocalStore)  │             │    (Event Bus / Dispatch)   │
│ - Family Emergency Plan    │             └──────────────┬──────────────┘
│ - Emergency Kit Checklist  │                            │
│ - Contacts & Quiz Progress │      ┌─────────────────────┼─────────────────────┐
│ - Cached Guides & Map Data │      │                     │                     │
└────────────────────────────┘ ┌────▼──────────┐   ┌──────▼──────┐   ┌──────────▼────────┐
                               │   Internet    │   │Local Browser│   │ Native Mesh /     │
                               │  Transport    │   │  Transport  │   │ Demo Mesh Engine  │
                               │ (HTTP/WS)     │   │(BroadcastCh)│   │ (BLE Hop Model)   │
                               └───────────────┘   └─────────────┘   └───────────────────┘
```

---

## 2. Technology Stack & Rationale

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| **Language** | TypeScript | `^5.6` | Strict type safety for critical safety data schemas, message packet structures, and state transitions. |
| **Framework** | React | `^19.0` (or `^18.3`) | Declarative UI component architecture, fast DOM reconciliation, highly portable to native shells (Capacitor/React Native). |
| **Build Tool** | Vite | `^6.0` | Sub-second Hot Module Replacement (HMR), tree-shaking, fast static asset bundling, and clean PWA manifest injection. |
| **Styling** | Tailwind CSS | `^3.4` | Mobile-first utility classes, custom disaster-palette variables, zero-runtime overhead, and seamless OLED black blackout mode switching. |
| **Icons** | Lucide React | `^0.460` | Crisp, lightweight, accessible SVG emergency iconography with zero unnecessary asset overhead. |
| **Mapping** | Leaflet + React-Leaflet | `^1.9` / `^4.2` | Lightweight ( $< 40\text{ KB}$ ) mapping engine capable of rendering emergency zones (PAZ, UPZ), shelters, and hospitals offline via vector layers or pre-cached tiles. |
| **Client Storage** | IndexedDB via `idb` / `Dexie` + `localStorage` | Latest | High-capacity offline persistence for message queues, user checklists, family emergency plans, contacts, and quiz scores. |
| **PWA & Offline** | Custom Service Worker + Web App Manifest | Standard | Cache-First offline fallback routing, background caching of educational resources, and standalone install prompt handling. |

---

## 3. Communication Abstraction Architecture

### 3.1 The Multi-Transport Interface
To solve the reality that web browsers cannot natively initiate raw Bluetooth LE mesh peripheral routing without native OS permissions, N-HELP implements an abstract communication engine. The UI remains decoupled from physical hardware implementations.

```typescript
// src/types/communication.ts

export type TransportType = 'INTERNET' | 'BROWSER_LOCAL' | 'NATIVE_MESH' | 'DEMO_MESH';

export type MessageStatus = 'QUEUED' | 'RELAYED' | 'DELIVERED' | 'FAILED';

export type VerificationType = 'OFFICIAL_VERIFIED' | 'COMMUNITY_UNVERIFIED' | 'ACADEMIC_DEMO';

export type ChannelId = 
  | 'emergency-general'
  | 'medical-help'
  | 'shelter-info'
  | 'family-reconnect'
  | 'supplies'
  | 'missing-persons'
  | 'local-information';

export interface MeshPeer {
  id: string;
  name: string;
  transport: TransportType;
  hopsAway: number;
  batteryLevel?: number;
  lastSeen: number;
  rssi?: number;
}

export interface MeshMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId?: string; // Empty for channel broadcast
  channelId: ChannelId;
  content: string; // Max 140 characters for low-bandwidth mesh resilience
  timestamp: number;
  ttl: number; // Max hops permitted before drop (default: 3-5)
  hops: number;
  relayPath: string[]; // Node IDs: ['NodeA', 'NodeB', 'NodeC']
  status: MessageStatus;
  verification: VerificationType;
  isDemo: boolean;
}

export interface ICommunicationTransport {
  name: TransportType;
  isAvailable(): Promise<boolean>;
  init(): Promise<void>;
  sendMessage(message: MeshMessage): Promise<boolean>;
  broadcastMessage(message: MeshMessage): Promise<boolean>;
  getPeers(): Promise<MeshPeer[]>;
  onMessageReceived(callback: (message: MeshMessage) => void): void;
  onPeerStatusChanged(callback: (peers: MeshPeer[]) => void): void;
}
```

---

### 3.2 Concrete Transport Implementations (Grill-Me Aligned)

#### 1. `InternetTransport`
- Active when browser `navigator.onLine === true` and network pings succeed.
- Connects to an optional WebSockets/REST relay server.
- Automatically yields to mesh transport when disconnection is detected.

#### 2. `LocalBrowserTransport` (Engine 1 - Real Peer Communication)
- Uses the standard browser `BroadcastChannel` API (`n-help-mesh-bus`).
- Enables genuine real-time local peer messaging across multiple open browser tabs, split windows, or compatible devices sharing local network WebRTC data channels without touching the internet.

#### 3. `DemoMeshTransport` (Engine 2 - Animated Multi-Hop Relay Simulator)
- Fully functional, highly realistic store-and-forward multi-hop routing simulation.
- Simulates 3–5 virtual peer nodes (`Node-Alpha [Hospital Base]`, `Node-Bravo [Mobile Volunteer]`, `Node-Charlie [Civil Shelter]`).
- Visualizes packet relay steps:
  $$\text{User Device} \xrightarrow{\text{BLE}} \text{Peer B (Relaying)} \xrightarrow{\text{BLE}} \text{Peer C (Final Delivery)}$$
- Demonstrates delay-tolerant buffering, hop counting, TTL expiration, and duplicate packet suppression using a Bloom filter/Set of observed message IDs.

#### 4. `NativeMeshTransport` & Native Android Companion Package
- Exposes a bidirectional IPC adapter interfacing with `window.NHelpNativeMeshBridge`.
- **Android Companion App Architecture (`android/` directory):**
  - **Wrapper Framework:** Capacitor / Android WebView shell wrapping the production N-HELP PWA bundle.
  - **`BluetoothLeService.kt`:** Native Kotlin Android Service handling:
    - `BluetoothLeAdvertiser`: Broadcasts compact 140-char mesh packet payloads over non-connectable or connectable BLE manufacturer data frames (inspired by BitChat).
    - `BluetoothLeScanner`: Continuously scans for nearby peer advertisements with service UUID `0000FE42-0000-1000-8000-00805F9B34FB`.
    - Multi-hop relay table with hop-decrement and loop suppression.
  - **`NativeMeshBridge.kt`:** `@JavascriptInterface` binding Android native mesh methods (`sendBleMeshPacket()`, `onBlePeerDiscovered()`) directly to N-HELP's `CommunicationManager`.

---

### 3.3 The `CommunicationManager` Orchestrator
```typescript
// src/services/communication/CommunicationManager.ts

export class CommunicationManager {
  private transports: Map<TransportType, ICommunicationTransport> = new Map();
  private activeTransport: TransportType = 'INTERNET';
  private messageQueue: MeshMessage[] = [];
  private seenMessageIds: Set<string> = new Set();
  private subscribers: ((message: MeshMessage) => void)[] = [];

  constructor() {
    this.registerTransports();
    this.monitorNetworkState();
  }

  public async dispatchMessage(msg: MeshMessage): Promise<MessageStatus> {
    if (this.seenMessageIds.has(msg.id)) return 'DELIVERED';
    this.seenMessageIds.add(msg.id);

    const transport = this.transports.get(this.activeTransport);
    if (!transport || !(await transport.isAvailable())) {
      msg.status = 'QUEUED';
      this.messageQueue.push(msg);
      this.persistQueueToIndexedDB();
      return 'QUEUED';
    }

    const success = await transport.sendMessage(msg);
    return success ? msg.status : 'FAILED';
  }
}
```

---

## 4. Disaster Data Models & Content Schemas

### 4.1 Medical Help & Triage Schema
```typescript
export interface MedicalTriageProtocol {
  priority: 'CRITICAL_TRAUMA' | 'CONTAMINATION_TRIAGE' | 'GENERAL_FIRST_AID';
  ruleTitle: string;
  goldenRule: string; // e.g. "Trauma First: Severe arterial bleeding takes priority over radioactive decontam"
  steps: string[];
  contraindications: string[]; // Explicit warnings
  prohibitedActions: string[]; // e.g. "Do not ingest povidone-iodine or bleach"
}

export interface PotassiumIodideGuidance {
  mechanism: string; // "Saturates thyroid with stable I-127, blocking I-131"
  strictlyProtects: string[]; // ["Thyroid gland only"]
  providesZeroProtectionAgainst: string[]; // ["External gamma", "Cs-137", "Sr-90", "All other body organs"]
  severeRisks: {
    condition: string;
    risk: string;
  }[];
  officialInstructionRequired: boolean; // Must be true
}
```

### 4.2 Water & Food Safety Protocol Schema
```typescript
export interface WaterSafetyProtocol {
  mythDebunk: {
    statement: string; // "Boiling removes radiation"
    reality: string; // "Boiling only kills microbes; it evaporates clean water and CONCENTRATES radionuclides"
    hazardExplanation: string;
  };
  safetyTiers: {
    tier: number;
    title: string;
    sources: string[];
    isSafe: boolean;
    usageDirective: string;
  }[];
  filtrationReality: string;
}

export interface FoodSafetyProtocol {
  cannedGoodsProcedure: string[]; // ["Wipe exterior before opening", "Do not rinse with unverified water"]
  freshProduceDirectives: string[]; // ["Do not consume outdoor garden produce or leafy greens"]
  dairyWarningIodine131: string; // Cow/goat milk rapid bio-accumulation vector
  cookingWarning: string; // Heat does not destroy subatomic radioactive particles
}

### 4.3 Multilingual & Bilingual Hindi i18n Architecture (Grill-Me Aligned)
```typescript
// src/i18n/types.ts
export type SupportedLanguage = 
  | 'en' // English (Default)
  | 'hi' // Hindi (Bilingual Core)
  | 'bn' // Bengali
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'ml' // Malayalam
  | 'kn' // Kannada
  | 'or'; // Odia

export interface EmergencyTranslationBundle {
  emergencyNowTitle: string;
  stayCalm: string;
  checkRadio: string;
  shelterGuidance: string;
  evacuationGuidance: string;
  decontamGuidance: string;
  waterFoodSafety: string;
  emergencyMesh: string;
  blackoutNotice: string;
}
```

---

## 5. Storage Architecture & Offline Synchronization

### 5.1 IndexedDB Schema (`n_help_db`)
IndexedDB provides persistent, high-capacity client-side storage structured as follows:

| Object Store | Key Path | Indexes | Purpose |
|---|---|---|---|
| `emergency_kit` | `id` | `category`, `checked` | Checklists for Water, Food, Medical, Radio, Light, Documents. |
| `family_plan` | `id` | `updatedAt` | Group name, primary contact, meeting locations, safe shelters. |
| `contacts` | `id` | `category`, `isCustom` | Civil defense, hospitals, police, ambulance, custom family. |
| `mesh_messages` | `id` | `channelId`, `status`, `timestamp` | Outbox queue, received peer broadcasts, relay history. |
| `quiz_scores` | `id` | `timestamp`, `score` | Self-assessment records and timestamped knowledge scores. |

---

## 6. Progressive Web App (PWA) & Service Worker Architecture

### 6.1 Service Worker Strategy (`sw.js`)
The Service Worker utilizes a defensive dual-caching strategy:

1. **Pre-Cache Core App Shell (Install Phase):**
   - `index.html`, compiled CSS/JS bundles, emergency web manifest, core icons, and Leaflet vector styles.
2. **Cache-First for Static Emergency Assets:**
   - Pre-compiled datasets for Radiation Basics, Safety Guides, Myth vs Fact, and FAQ.
   - Guaranteed instant load even if the phone has zero connectivity.
3. **Stale-While-Revalidate for Interactive Routes:**
   - Delivers cached instant UI and updates in the background if network packets are available.
4. **Offline Fallback Route:**
   - If an uncached route is requested while offline, intercepts and returns `/index.html` (SPA fallback) or `offline-fallback.html`.

### 6.2 Web App Manifest (`manifest.json`)
```json
{
  "name": "N-HELP: Nuclear Emergency Help & Preparedness",
  "short_name": "N-HELP",
  "description": "Offline-first civil defense and peer-to-peer communication system for nuclear and radiological emergencies.",
  "start_url": "/?mode=pwa",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#000000",
  "theme_color": "#0B0F19",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## 7. Blackout Mode & Low-Power Engineering

### 7.1 Power Conservation Engine
During a major infrastructure outage, civilian device batteries are irreplaceable lifelines:
- **Pure OLED Black `#000000`:** Pixels on modern smartphone OLED/AMOLED displays are physically turned off when rendering true black, reducing display battery consumption by up to $60\%$.
- **CSS Variable Swapping:** Dynamic theme root switches to `theme-blackout` with high-contrast amber/yellow (`#F59E0B`) typography for maximum readability in dim or smoky shelters.
- **Battery Status API Integration:**
  ```typescript
  // Safe progressive enhancement for battery metrics
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      setBatteryLevel(Math.round(battery.level * 100));
      battery.addEventListener('levelchange', () => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    });
  }
  ```
- **CPU Throttling & Motion Suppression:** Disables Framer Motion / CSS background animations, reduces DOM polling intervals, and shuts down canvas rerenders.

---

## 8. Interactive Mapping Architecture

### 8.1 Offline-Ready Leaflet Map (Grill-Me Aligned)
- Standard online maps fail immediately when internet towers collapse.
- N-HELP deploys an offline-first Leaflet configuration:
  - **Academic Facility Scenario:** Narora Atomic Power Station (NAPS - $28.1578^\circ\text{ N}, 78.4144^\circ\text{ E}$, Bulandshahr, UP).
  - **AERB Emergency Zones:**
    - Precautionary Action Zone (PAZ, red ring): $0-5\text{ km}$
    - Urgent Protective Action Planning Zone (UPZ, amber ring): $5-15\text{ km}$
  - **Layer Overlays:** Designated reinforced civil shelters, District Hospital / Decontamination Center, screening checkpoints on SH-63 and GT Road.
  - Offline fallback canvas when remote OpenStreetMap tiles cannot be loaded.
  - Persistent floating badge: **"ACADEMIC DEMONSTRATION MAP — NOT AN OFFICIAL EVACUATION MAP"**.

---

## 9. Directory Structure & Source Code Layout (Grill-Me Aligned)

```
d:/N-help/
├── PRD.md                       # Product Requirements Document
├── Dont_do.md                   # Safety & Operational Prohibitions
├── Architechture.md             # Technical Architecture (this document)
├── Architecture.md              # Standard-spelling alias
├── index.html                   # HTML5 Entry Point + Fallback Meta
├── package.json                 # Dependencies & Build Scripts
├── tsconfig.json                # TypeScript Compiler Configuration
├── vite.config.ts               # Vite Bundler & PWA Config
├── tailwind.config.js           # Tailwind CSS Configuration
├── postcss.config.js            # PostCSS Autoprefixer
├── android/                     # Native Android Companion Package (Grill-Me Aligned)
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml  # BLUETOOTH_ADVERTISE, SCAN, CONNECT permissions
│   │   └── java/org/nhelp/mesh/
│   │       ├── MainActivity.kt  # WebView container & Bridge injector
│   │       ├── BluetoothLeService.kt # BLE advertiser, scanner & relay engine
│   │       └── NativeMeshBridge.kt   # JavascriptInterface bridge to window.NHelpNativeMeshBridge
│   └── README.md                # Compilation & APK build instructions
├── public/
│   ├── manifest.json            # PWA Manifest
│   ├── sw.js                    # Custom Service Worker
│   ├── offline-fallback.html    # Static offline emergency page
│   └── icons/                   # High-res PWA icons
└── src/
    ├── main.tsx                 # React DOM Root
    ├── App.tsx                  # Main Layout & Tab Router
    ├── types/                   # Type Definitions
    │   ├── emergency.ts         # Triage, Medical, Food/Water types
    │   ├── communication.ts     # Mesh, Peer, Message, Transport types
    │   ├── checklist.ts         # Kit and Checklist models
    │   └── educational.ts       # Guides, Radiation, Myth/Fact, Quiz types
    ├── i18n/                    # Multilingual System (Grill-Me Aligned)
    │   ├── translations.ts      # English base + Hindi core + 10 language dictionaries
    │   └── useTranslation.ts   # i18n hook
    ├── services/
    │   ├── db.ts                # IndexedDB database service
    │   └── communication/
    │       ├── CommunicationManager.ts
    │       ├── InternetTransport.ts
    │       ├── LocalBrowserTransport.ts # Engine 1: Real BroadcastChannel
    │       ├── NativeMeshTransport.ts   # Bridge to Native Android
    │       └── DemoMeshTransport.ts     # Engine 2: Animated Multi-Hop DTN Simulator
    ├── context/
    │   ├── EmergencyContext.tsx # Central disaster & offline state
    │   └── CommunicationContext.tsx # Messaging state & bus
    ├── components/
    │   ├── common/              # Header, DisclaimerBanner, Navigation, InstallModal, DemoModeBanner
    │   ├── emergency/           # EmergencyNow (Bilingual), MedicalHelp, WaterFoodSafety, ShelterGuide
    │   ├── mesh/                # MeshDashboard, ChannelChat, StoreForwardVisualizer, FamilyReconnect
    │   ├── blackout/            # BlackoutScreen, PowerSaverWidget
    │   ├── tools/               # KitChecklist, FamilyPlan, LeafletMap, Contacts
    │   ├── education/           # SafetyGuide, RadiationBasics, MythVsFact, Quiz
    │   └── reference/           # BitChatGuide, SourcesReferences, FaqSection, AboutProject
    └── data/                    # Pre-compiled static disaster data
        ├── medicalSafetyData.ts # ARS, trauma, KI hazards, de-clothing
        ├── waterFoodSafetyData.ts # Boiling debunk, storage tiers, milk vector
        ├── safetyGuidesData.ts  # Before/During/After guides
        ├── radiationBasicsData.ts # Time/distance/shielding, reactor containment
        ├── mythFactData.ts      # 15+ verified entries
        ├── quizData.ts          # 15+ scenario questions
        └── faqsData.ts          # Civil defense FAQs
```

---

## 10. Verification & Quality Assurance Strategy

1. **Static Analysis & Typecheck:** Run `tsc --noEmit` to ensure zero type discrepancies across all data structures and transport interfaces.
2. **Service Worker Offline Test:** Verify in Chrome/Edge DevTools (Network tab set to "Offline") that all emergency guides, medical warnings, water protocols, and kit checklists load seamlessly.
3. **PWA Lighthouse Audit:** Ensure high scores for PWA installability, Performance, and Accessibility.
4. **Mesh Store-and-Forward Verification:** Test packet transit across the simulator, verifying status updates: `QUEUED` $\to$ `RELAYED` $\to$ `DELIVERED`.
