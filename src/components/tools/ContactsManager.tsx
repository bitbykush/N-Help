import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  Copy, 
  Check, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Radio, 
  Search, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { EmergencyContact, ContactCategory } from '../../types/checklist';
import { dbService } from '../../services/db';
import { DEFAULT_CONTACTS } from '../../data/contactsData';

export const ContactsManager: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // New contact inputs
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [category, setCategory] = useState<ContactCategory>('FAMILY');
  const [notes, setNotes] = useState<string>('');

  const loadContacts = async () => {
    try {
      const data = await dbService.getContacts();
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
      setContacts(DEFAULT_CONTACTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleCopy = (id: string, phoneStr: string) => {
    navigator.clipboard.writeText(phoneStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact: EmergencyContact = {
      id: `custom-contact-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      category,
      notes: notes.trim() || undefined,
      isVerifiedOfficial: false,
      isCustom: true
    };

    await dbService.saveContact(newContact);
    setContacts([...contacts, newContact]);

    setName('');
    setPhone('');
    setNotes('');
    setIsAdding(false);
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Delete this custom emergency contact?')) {
      await dbService.deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              OFFLINE EMERGENCY HELPLINES & DIRECTORY
            </h1>
            <p className="text-xs text-zinc-400">
              Verified National Disaster & Nuclear Emergency Helplines
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search verified helplines, police, ambulance or custom contacts..."
          className="w-full bg-disaster-card border border-disaster-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Add Custom Contact Drawer */}
      {isAdding && (
        <form onSubmit={handleAddContact} className="p-4 bg-zinc-900 border border-emerald-500/40 rounded-xl space-y-3 animate-fade-in text-xs">
          <h3 className="text-xs font-bold uppercase text-emerald-400">Add Local Emergency Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Contact Name (e.g. Ward Warden Sharma)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="tel"
              required
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ContactCategory)}
              className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="FAMILY">Family Member</option>
              <option value="COMMUNITY">Community / Neighbor</option>
              <option value="HOSPITAL">Local Hospital / Doctor</option>
              <option value="POLICE">Local Police Station</option>
              <option value="DISASTER_MANAGEMENT">Disaster Official</option>
            </select>
            <input
              type="text"
              placeholder="Notes (e.g. Has 4x4 vehicle & solar battery)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 text-black font-bold rounded-lg text-xs hover:bg-emerald-400"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Helplines List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="text-center py-10 text-xs text-zinc-500">Loading emergency directory...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-10 bg-disaster-card border border-disaster-border rounded-xl">
            <p className="text-xs text-zinc-400">No emergency contacts matched your search.</p>
          </div>
        ) : (
          filteredContacts.map(c => (
            <div
              key={c.id}
              className="p-3.5 bg-disaster-card border border-disaster-border rounded-xl flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{c.name}</span>
                  {c.isVerifiedOfficial && (
                    <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>OFFICIAL</span>
                    </span>
                  )}
                  {c.isCustom && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-semibold">
                      CUSTOM
                    </span>
                  )}
                </div>
                <div className="font-mono text-amber-400 font-bold tracking-wider text-sm">
                  {c.phone}
                </div>
                {c.notes && (
                  <p className="text-[11px] text-zinc-400">{c.notes}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${c.phone}`}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-colors flex items-center justify-center"
                  title="Direct Phone Call"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleCopy(c.id, c.phone)}
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl border border-zinc-800 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedId === c.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {c.isCustom && (
                  <button
                    onClick={() => handleDeleteContact(c.id)}
                    className="p-2.5 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete Custom Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Civil Defense Radio Frequencies Box */}
      <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2.5">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            OFFLINE HAM RADIO & DEFENCE FREQUENCIES
          </h3>
        </div>
        <p className="text-[11px] text-zinc-400">
          When cellular towers and internet service are interrupted, civilian ham radio operators and disaster broadcast transmitters communicate on standardized emergency frequencies:
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2 bg-black/60 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">National Calling VHF</span>
            <span className="text-white font-bold">144.500 MHz</span>
          </div>
          <div className="p-2 bg-black/60 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Disaster Distress UHF</span>
            <span className="text-white font-bold">433.500 MHz</span>
          </div>
          <div className="p-2 bg-black/60 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">All India Radio MW</span>
            <span className="text-white font-bold">666 kHz AM</span>
          </div>
          <div className="p-2 bg-black/60 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">AIR Delhi Northern Net</span>
            <span className="text-white font-bold">819 kHz AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
