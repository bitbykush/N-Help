import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const androidDir = path.join(rootDir, 'android');

console.log('🚀 [N-HELP] 1-Click APK Builder starting...');

// 1. Bundle web assets
console.log('1️⃣ Compiling and bundling web app into Android assets...');
execSync('npm run bundle:android', { cwd: rootDir, stdio: 'inherit' });

// 2. Resolve JDK (prefer Android Studio JBR if available)
const jbrPath = 'C:\\Program Files\\Android\\Android Studio\\jbr';
const env = { ...process.env };
if (fs.existsSync(jbrPath)) {
  env.JAVA_HOME = jbrPath;
  env.PATH = `${path.join(jbrPath, 'bin')};${env.PATH || ''}`;
}

// 3. Run Gradle assembleDebug
console.log('2️⃣ Running Gradle assembleDebug...');
const gradlewCmd = process.platform === 'win32' ? '.\\gradlew.bat assembleDebug' : './gradlew assembleDebug';
execSync(gradlewCmd, { cwd: androidDir, env, stdio: 'inherit' });

const apkPath = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
if (fs.existsSync(apkPath)) {
  const stats = fs.statSync(apkPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 [N-HELP] Standalone Android APK built successfully!`);
  console.log(`📍 Location: ${apkPath}`);
  console.log(`📦 File Size: ${sizeMb} MB`);
} else {
  console.error('\n⚠️ APK build completed, but output file was not found.');
}
