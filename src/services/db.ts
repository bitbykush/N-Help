import { EmergencyKitItem, FamilyPlan, EmergencyContact } from '../types/checklist';
import { MeshMessage } from '../types/communication';
import { DEFAULT_KIT_ITEMS } from '../data/kitDefaultData';
import { DEFAULT_CONTACTS } from '../data/contactsData';

const DB_NAME = 'n_help_emergency_db';
const DB_VERSION = 1;

class EmergencyDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.init();
  }

  private init(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[DB] IndexedDB not available, falling back to localStorage');
      return Promise.reject(new Error('IndexedDB not supported'));
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('kit')) {
          const store = db.createObjectStore('kit', { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains('family_plan')) {
          db.createObjectStore('family_plan', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('contacts')) {
          const store = db.createObjectStore('contacts', { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains('messages')) {
          const store = db.createObjectStore('messages', { keyPath: 'id' });
          store.createIndex('channelId', 'channelId', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- EMERGENCY KIT ---
  async getKitItems(): Promise<EmergencyKitItem[]> {
    try {
      const db = await this.init();
      return new Promise((resolve) => {
        const tx = db.transaction('kit', 'readonly');
        const store = tx.objectStore('kit');
        const req = store.getAll();
        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            resolve(req.result);
          } else {
            // Seed defaults
            this.seedKitItems(DEFAULT_KIT_ITEMS).then(() => resolve(DEFAULT_KIT_ITEMS));
          }
        };
        req.onerror = () => resolve(this.getKitFromLocalStorage());
      });
    } catch {
      return this.getKitFromLocalStorage();
    }
  }

  async saveKitItem(item: EmergencyKitItem): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction('kit', 'readwrite');
      tx.objectStore('kit').put(item);
    } catch {
      const items = this.getKitFromLocalStorage();
      const index = items.findIndex(i => i.id === item.id);
      if (index >= 0) items[index] = item;
      else items.push(item);
      localStorage.setItem('n_help_kit', JSON.stringify(items));
    }
  }

  private async seedKitItems(items: EmergencyKitItem[]): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction('kit', 'readwrite');
      const store = tx.objectStore('kit');
      items.forEach(i => store.put(i));
    } catch {
      localStorage.setItem('n_help_kit', JSON.stringify(items));
    }
  }

  private getKitFromLocalStorage(): EmergencyKitItem[] {
    const raw = localStorage.getItem('n_help_kit');
    return raw ? JSON.parse(raw) : DEFAULT_KIT_ITEMS;
  }

  // --- FAMILY PLAN ---
  async getFamilyPlan(): Promise<FamilyPlan | null> {
    try {
      const db = await this.init();
      return new Promise((resolve) => {
        const tx = db.transaction('family_plan', 'readonly');
        const store = tx.objectStore('family_plan');
        const req = store.get('current_plan');
        req.onsuccess = () => resolve(req.result || this.getFamilyPlanFromLocalStorage());
        req.onerror = () => resolve(this.getFamilyPlanFromLocalStorage());
      });
    } catch {
      return this.getFamilyPlanFromLocalStorage();
    }
  }

  async saveFamilyPlan(plan: FamilyPlan): Promise<void> {
    const record = { id: 'current_plan', ...plan, updatedAt: Date.now() };
    try {
      const db = await this.init();
      const tx = db.transaction('family_plan', 'readwrite');
      tx.objectStore('family_plan').put(record);
    } catch {
      // Fallback
    }
    localStorage.setItem('n_help_family_plan', JSON.stringify(plan));
  }

  private getFamilyPlanFromLocalStorage(): FamilyPlan | null {
    const raw = localStorage.getItem('n_help_family_plan');
    return raw ? JSON.parse(raw) : null;
  }

  // --- EMERGENCY CONTACTS ---
  async getContacts(): Promise<EmergencyContact[]> {
    try {
      const db = await this.init();
      return new Promise((resolve) => {
        const tx = db.transaction('contacts', 'readonly');
        const store = tx.objectStore('contacts');
        const req = store.getAll();
        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            resolve(req.result);
          } else {
            this.seedContacts(DEFAULT_CONTACTS).then(() => resolve(DEFAULT_CONTACTS));
          }
        };
        req.onerror = () => resolve(this.getContactsFromLocalStorage());
      });
    } catch {
      return this.getContactsFromLocalStorage();
    }
  }

  async saveContact(contact: EmergencyContact): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction('contacts', 'readwrite');
      tx.objectStore('contacts').put(contact);
    } catch {
      const contacts = this.getContactsFromLocalStorage();
      const idx = contacts.findIndex(c => c.id === contact.id);
      if (idx >= 0) contacts[idx] = contact;
      else contacts.push(contact);
      localStorage.setItem('n_help_contacts', JSON.stringify(contacts));
    }
  }

  async deleteContact(id: string): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction('contacts', 'readwrite');
      tx.objectStore('contacts').delete(id);
    } catch {
      const contacts = this.getContactsFromLocalStorage().filter(c => c.id !== id);
      localStorage.setItem('n_help_contacts', JSON.stringify(contacts));
    }
  }

  private async seedContacts(contacts: EmergencyContact[]): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction('contacts', 'readwrite');
      const store = tx.objectStore('contacts');
      contacts.forEach(c => store.put(c));
    } catch {
      localStorage.setItem('n_help_contacts', JSON.stringify(contacts));
    }
  }

  private getContactsFromLocalStorage(): EmergencyContact[] {
    const raw = localStorage.getItem('n_help_contacts');
    return raw ? JSON.parse(raw) : DEFAULT_CONTACTS;
  }

  // --- MESH MESSAGES ---
  async getMessages(channelId?: string): Promise<MeshMessage[]> {
    try {
      const db = await this.init();
      return new Promise((resolve) => {
        const tx = db.transaction('messages', 'readonly');
        const store = tx.objectStore('messages');
        const req = store.getAll();
        req.onsuccess = () => {
          let list = (req.result || []) as MeshMessage[];
          if (channelId) list = list.filter(m => m.channelId === channelId);
          resolve(list.sort((a, b) => a.timestamp - b.timestamp));
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      const raw = localStorage.getItem('n_help_messages');
      let list: MeshMessage[] = raw ? JSON.parse(raw) : [];
      if (channelId) list = list.filter(m => m.channelId === channelId);
      return list;
    }
  }

  async saveMessage(msg: MeshMessage): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction('messages', 'readwrite');
      tx.objectStore('messages').put(msg);
    } catch {
      const raw = localStorage.getItem('n_help_messages');
      const list: MeshMessage[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(m => m.id === msg.id);
      if (idx >= 0) list[idx] = msg;
      else list.push(msg);
      localStorage.setItem('n_help_messages', JSON.stringify(list));
    }
  }

  // --- FULL SYNC STATE (EXPORT / IMPORT) ---
  async exportCompleteState(): Promise<string> {
    const kit = await this.getKitItems();
    const familyPlan = await this.getFamilyPlan();
    const contacts = await this.getContacts();
    const state = {
      version: 1,
      timestamp: Date.now(),
      kit,
      familyPlan,
      contacts
    };
    return JSON.stringify(state);
  }

  async importCompleteState(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (data.kit && Array.isArray(data.kit)) {
        for (const item of data.kit) {
          await this.saveKitItem(item);
        }
      }
      if (data.familyPlan) {
        await this.saveFamilyPlan(data.familyPlan);
      }
      if (data.contacts && Array.isArray(data.contacts)) {
        for (const contact of data.contacts) {
          await this.saveContact(contact);
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to import sync state:', e);
      return false;
    }
  }
}

export const dbService = new EmergencyDatabase();

// Handle Native Intent Sync Handshake
if (typeof window !== 'undefined') {
  (window as any).NHelpApplySyncPayload = async (base64OrJson: string) => {
    try {
      let json = base64OrJson;
      try {
        json = atob(base64OrJson);
      } catch {}
      await dbService.importCompleteState(json);
      window.location.reload();
    } catch (err) {
      console.error('Sync payload application error:', err);
    }
  };
}
