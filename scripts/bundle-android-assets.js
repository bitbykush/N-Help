import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const androidAssetsDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets');

console.log('📦 [N-HELP] Packaging production web bundle into Android assets directory...');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory not found. Please run "npm run build" first.');
  process.exit(1);
}

// Ensure android assets directory exists
if (fs.existsSync(androidAssetsDir)) {
  fs.rmSync(androidAssetsDir, { recursive: true, force: true });
}
fs.mkdirSync(androidAssetsDir, { recursive: true });

// Copy all dist assets to android/app/src/main/assets
fs.cpSync(distDir, androidAssetsDir, { recursive: true });

console.log(`✅ [N-HELP] Successfully bundled ${fs.readdirSync(androidAssetsDir).length} top-level files/directories into android/app/src/main/assets!`);
console.log('🚀 Android APK will now load the complete N-HELP suite offline with Native Bluetooth LE mesh relaying.');
