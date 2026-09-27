# N-HELP: Nuclear Emergency Help & Preparedness Platform

> **KNOW. PREPARE. RESPOND.**  
> Offline-first civil defense and peer-to-peer emergency communication suite for nuclear and radiological emergencies.

---

## 🌟 Overview
**N-HELP** is an educational engineering research capstone (Course CHE110) designed for civilian crisis resilience. When traditional power grids, cellular towers, and central internet infrastructure collapse simultaneously, N-HELP ensures continuous community survivability through:

1. **100% Offline Capability**: Built with zero external runtime dependencies. All guides, radiation triage algorithms, and checklists remain cached on-device.
2. **Hybrid Mesh Communication**:
   - **Internet Cloud Mesh**: Seamless real-time disaster chat between website and Android app users via secure MQTT WebSockets (`wss://`).
   - **Hardware BLE Mesh Radio**: Native 2.4 GHz Bluetooth Low Energy store-and-forward hopping (BitChat-compatible) for communication when cellular and internet grids are down.
3. **Private Family Reconnect**: Client-side **AES-256-GCM** end-to-end encryption for private family check-ins across community mesh nodes.

---

## 🚀 Live Web Deployment
To host this project, connect this repository to **Vercel**, **Netlify**, or enable **GitHub Pages**:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 📱 Standalone Android APK
The native Android APK enabling 2.4 GHz hardware Bluetooth mesh radio relaying is located in the project's build directory and can be compiled using:
```bash
npm run build:apk
```

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet
- **Native Android Radio**: Kotlin, Android BLE Advertising & Scanning, GATT Server/Client
- **Mesh Relaying**: Dual-broker MQTT over WSS & Bluetooth Low Energy Store-and-Forward
