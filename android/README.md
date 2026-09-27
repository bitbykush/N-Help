# N-HELP Native Android Companion App (BitChat-Grade Mesh)

This directory provides the standalone native Android application for **N-HELP**, integrating **genuine Bluetooth Low Energy (BLE) Mesh peripheral advertising, continuous scanning, and multi-hop relaying** inspired by the BitChat decentralized mesh protocol.

---

## 1. Architecture

```
N-HELP Complete Suite (Offline React PWA bundled inside APK assets)
         │
  window.NHelpNativeMeshBridge
         │
 NativeMeshBridge.kt (@JavascriptInterface)
         │
 BluetoothLeService.kt (Foreground Service)
   ├── BluetoothLeAdvertiser (Broadcasts compact 140-char payloads via UUID 0000FE42...)
   └── BluetoothLeScanner (Listens for nearby peer distress packets and relays)
```

---

## 2. One-Step Build & Asset Bundling

To compile the latest N-HELP web application and bundle it directly into the Android assets:

```bash
# From the project root (d:\N-help)
npm run bundle:android
```

This single command:
1. Compiles the TypeScript PWA into `dist/`.
2. Packages `dist/` directly into `android/app/src/main/assets/`.

---

## 3. Opening in Android Studio & Building the APK

1. **Open Android Studio**:
   - Select **Open an existing Project**.
   - Navigate to and select the `android/` directory (`d:\N-help\android`).
2. **Sync Gradle**:
   - Android Studio will automatically resolve Gradle dependencies (`compileSdk 34`, `minSdk 26`).
3. **Build APK**:
   - Menu: **Build** $\to$ **Build Bundle(s) / APK(s)** $\to$ **Build APK(s)**.
   - Or run from terminal:
     ```bash
     ./gradlew assembleDebug
     ```
   - Output APK will be generated at:
     `android/app/build/outputs/apk/debug/app-debug.apk`
4. **Deploy to Physical Devices**:
   - Install on 2 or more Android phones.
   - Turn off Wi-Fi and Cellular Data on both phones.
   - Open N-HELP Mesh $\to$ Grant Bluetooth permissions $\to$ Send messages over peer-to-peer Bluetooth radio!
