import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Phone, 
  Heart, 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  ShieldAlert, 
  FileCheck,
  Compass,
  AlertCircle
} from 'lucide-react';
import { FamilyPlan as IFamilyPlan, FamilyPlanMember } from '../../types/checklist';
import { dbService } from '../../services/db';

export const FamilyPlan: React.FC = () => {
  const [plan, setPlan] = useState<IFamilyPlan>({
    familyName: '',
    primaryContact: '',
    secondaryContact: '',
    meetingLocationHome: '',
    meetingLocationRegional: '',
    designatedShelter: '',
    specialNotes: '',
    members: [],
    updatedAt: Date.now()
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // New member form inputs
  const [memberName, setMemberName] = useState<string>('');
  const [memberRole, setMemberRole] = useState<string>('Parent');
  const [memberPhone, setMemberPhone] = useState<string>('');
  const [memberMedNotes, setMemberMedNotes] = useState<string>('');
  const [isAddingMember, setIsAddingMember] = useState<boolean>(false);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const stored = await dbService.getFamilyPlan();
        if (stored) {
          setPlan(stored);
        }
      } catch (err) {
        console.error('Error loading family plan:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPlan();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const updated = { ...plan, updatedAt: Date.now() };
      await dbService.saveFamilyPlan(updated);
      setPlan(updated);
      setSaveStatus('Plan saved securely offline on this device.');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('Failed to save. Check storage permissions.');
    }
  };

  const addMember = () => {
    if (!memberName.trim()) return;
    const newMember: FamilyPlanMember = {
      id: `member-${Date.now()}`,
      name: memberName.trim(),
      role: memberRole,
      phone: memberPhone.trim(),
      medicalNotes: memberMedNotes.trim()
    };
    setPlan({ ...plan, members: [...plan.members, newMember] });
    setMemberName('');
    setMemberPhone('');
    setMemberMedNotes('');
    setIsAddingMember(false);
  };

  const removeMember = (id: string) => {
    setPlan({ ...plan, members: plan.members.filter(m => m.id !== id) });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-10 text-xs text-zinc-500">Loading Family Plan...</div>;
  }

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              OFFLINE FAMILY EMERGENCY PLAN
            </h1>
            <p className="text-xs text-zinc-400">
              Pre-agreed rendezvous points, emergency roles & medical needs
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Print or Save as PDF"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Print Card</span>
        </button>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Plan Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Core Contacts */}
        <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>Emergency Contacts & Identification</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Family / Household Name</label>
              <input
                type="text"
                value={plan.familyName}
                onChange={(e) => setPlan({ ...plan, familyName: e.target.value })}
                placeholder="e.g. Sharma Household"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Local Primary Contact Phone</label>
              <input
                type="tel"
                value={plan.primaryContact}
                onChange={(e) => setPlan({ ...plan, primaryContact: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-400 text-[11px] mb-1">
                Out-of-District Emergency Contact (Different city/grid unaffected by local blackout)
              </label>
              <input
                type="text"
                value={plan.secondaryContact}
                onChange={(e) => setPlan({ ...plan, secondaryContact: e.target.value })}
                placeholder="e.g. Uncle Ramesh (Jaipur) - +91 94140 12345"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Meeting Locations */}
        <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pre-Determined Meeting Locations</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">
                1. Immediate Local Meeting Point (Outside house for rapid evacuation, e.g. Community Park Gate)
              </label>
              <input
                type="text"
                value={plan.meetingLocationHome}
                onChange={(e) => setPlan({ ...plan, meetingLocationHome: e.target.value })}
                placeholder="e.g. Pillar 4 at Sector 14 Public Park"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">
                2. Regional Meeting Point (Outside neighborhood / beyond 15km UPZ evacuation boundary)
              </label>
              <input
                type="text"
                value={plan.meetingLocationRegional}
                onChange={(e) => setPlan({ ...plan, meetingLocationRegional: e.target.value })}
                placeholder="e.g. District Sports Stadium Grandstand, Aligarh"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">
                3. Designated Substantial Shelter / Basement
              </label>
              <input
                type="text"
                value={plan.designatedShelter}
                onChange={(e) => setPlan({ ...plan, designatedShelter: e.target.value })}
                placeholder="e.g. Building B Underground Parking Basement"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Household Members */}
        <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Household Members & Medical Flags</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsAddingMember(!isAddingMember)}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Add member subform */}
          {isAddingMember && (
            <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Parent, Child, Senior)"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  className="bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Blood Type & Medical Needs (e.g. O+, Insulin)"
                  value={memberMedNotes}
                  onChange={(e) => setMemberMedNotes(e.target.value)}
                  className="bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-2 py-1 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addMember}
                  className="px-3 py-1 bg-amber-500 text-black font-bold rounded"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Members list */}
          {plan.members.length === 0 ? (
            <p className="text-[11px] text-zinc-500 italic">No family members registered yet.</p>
          ) : (
            <div className="space-y-2">
              {plan.members.map((m) => (
                <div key={m.id} className="p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{m.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono">
                        {m.role}
                      </span>
                      {m.phone && <span className="text-[11px] text-zinc-400 font-mono">{m.phone}</span>}
                    </div>
                    {m.medicalNotes && (
                      <p className="text-[11px] text-red-300 mt-0.5 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400 shrink-0" />
                        <span>{m.medicalNotes}</span>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Special Instructions & Notes */}
        <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-2">
          <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
            Critical Household Instructions & Shutoff Valves
          </label>
          <textarea
            value={plan.specialNotes}
            onChange={(e) => setPlan({ ...plan, specialNotes: e.target.value })}
            placeholder="e.g. Main water valve located under front stairwell; pet carriers kept in hall closet; key to generator in kitchen drawer..."
            className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 resize-none font-mono"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors uppercase tracking-wider"
        >
          <Save className="w-4 h-4" />
          <span>Save Family Disaster Plan</span>
        </button>
      </form>
    </div>
  );
};
