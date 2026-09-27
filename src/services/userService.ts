/**
 * User Identity and Private Family Security Service for N-HELP.
 * Manages unique device ID, user display name, and client-side AES-GCM encryption for Private Family channels.
 */

export interface UserProfile {
  userId: string;
  userName: string;
  familyCode: string;
  familyName: string;
}

class UserService {
  private profile: UserProfile;

  constructor() {
    this.profile = this.loadProfile();
  }

  private loadProfile(): UserProfile {
    if (typeof window === 'undefined') {
      return {
        userId: 'usr_init',
        userName: 'Civilian',
        familyCode: 'FAM-2026',
        familyName: 'My Family'
      };
    }

    let userId = localStorage.getItem('nhelp_user_id');
    if (!userId) {
      userId = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
      localStorage.setItem('nhelp_user_id', userId);
    }

    let userName = localStorage.getItem('nhelp_user_name');
    if (!userName) {
      userName = 'Civilian-' + userId.slice(-4).toUpperCase();
      localStorage.setItem('nhelp_user_name', userName);
    }

    let familyCode = localStorage.getItem('nhelp_family_code');
    if (!familyCode) {
      familyCode = 'SAFE-2026';
      localStorage.setItem('nhelp_family_code', familyCode);
    }

    let familyName = localStorage.getItem('nhelp_family_name');
    if (!familyName) {
      familyName = 'My Family';
      localStorage.setItem('nhelp_family_name', familyName);
    }

    return { userId, userName, familyCode, familyName };
  }

  public getUserId(): string {
    return this.profile.userId;
  }

  public getUserName(): string {
    return this.profile.userName;
  }

  public setUserName(name: string): void {
    const clean = name.trim().slice(0, 20) || 'Civilian';
    this.profile.userName = clean;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nhelp_user_name', clean);
    }
  }

  public getFamilyCode(): string {
    return this.profile.familyCode;
  }

  public setFamilyCode(code: string): void {
    const clean = code.trim().toUpperCase().slice(0, 20) || 'SAFE-2026';
    this.profile.familyCode = clean;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nhelp_family_code', clean);
    }
  }

  public getFamilyName(): string {
    return this.profile.familyName;
  }

  public setFamilyName(name: string): void {
    const clean = name.trim().slice(0, 24) || 'My Family';
    this.profile.familyName = clean;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nhelp_family_name', clean);
    }
  }

  /**
   * Derive a fast, deterministic 6-character Family Hash to match sub-channels without leaking the code.
   */
  public getFamilyHash(code = this.profile.familyCode): string {
    let hash = 0;
    const str = 'nhelp_salt_' + code;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(6, '0').slice(0, 6);
  }

  /**
   * Encrypt a private family message using client-side AES-GCM (SubtleCrypto).
   */
  public async encryptFamilyContent(content: string, code = this.profile.familyCode): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      // Fallback simple obfuscation for older engines
      return 'ENC:' + btoa(encodeURIComponent(content));
    }

    try {
      const enc = new TextEncoder();
      const rawKey = await crypto.subtle.digest('SHA-256', enc.encode('nhelp_key_' + code));
      const key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt']);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(content));

      const combined = new Uint8Array(iv.length + cipher.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(cipher), iv.length);

      let binary = '';
      for (let i = 0; i < combined.length; i++) {
        binary += String.fromCharCode(combined[i]);
      }
      return 'GCM:' + btoa(binary);
    } catch (e) {
      console.warn('[UserService] Crypto fallback:', e);
      return 'ENC:' + btoa(encodeURIComponent(content));
    }
  }

  /**
   * Decrypt a private family message. Returns null if key does not match.
   */
  public async decryptFamilyContent(payload: string, code = this.profile.familyCode): Promise<string | null> {
    if (payload.startsWith('ENC:')) {
      try {
        return decodeURIComponent(atob(payload.slice(4)));
      } catch {
        return null;
      }
    }

    if (!payload.startsWith('GCM:') || typeof crypto === 'undefined' || !crypto.subtle) {
      return null;
    }

    try {
      const binary = atob(payload.slice(4));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const iv = bytes.slice(0, 12);
      const cipher = bytes.slice(12);

      const enc = new TextEncoder();
      const rawKey = await crypto.subtle.digest('SHA-256', enc.encode('nhelp_key_' + code));
      const key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']);

      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
      return new TextDecoder().decode(decrypted);
    } catch {
      // Wrong family code
      return null;
    }
  }
}

export const userService = new UserService();
