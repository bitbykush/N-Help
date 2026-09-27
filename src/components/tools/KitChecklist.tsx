import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  RotateCcw, 
  Search, 
  Filter, 
  AlertCircle, 
  ShieldCheck, 
  Droplet, 
  Utensils, 
  Pill, 
  Radio, 
  Flashlight, 
  FileText, 
  HeartHandshake,
  Trash2,
  Share2
} from 'lucide-react';
import { EmergencyKitItem, KitCategory } from '../../types/checklist';
import { dbService } from '../../services/db';
import { DEFAULT_KIT_ITEMS } from '../../data/kitDefaultData';

export const KitChecklist: React.FC = () => {
  const [items, setItems] = useState<EmergencyKitItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemDetail, setNewItemDetail] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<KitCategory>('OTHER');

  // Load items from database
  const loadItems = async () => {
    try {
      const data = await dbService.getKitItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load kit items:', err);
      setItems(DEFAULT_KIT_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Toggle item check status
  const handleToggle = async (item: EmergencyKitItem) => {
    const updated = { ...item, checked: !item.checked };
    const nextList = items.map(i => (i.id === item.id ? updated : i));
    setItems(nextList);
    await dbService.saveKitItem(updated);
  };

  // Add custom item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: EmergencyKitItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      detail: newItemDetail.trim() || 'Custom civilian emergency supply item',
      category: newItemCategory,
      checked: false,
      isCustom: true
    };

    const nextList = [newItem, ...items];
    setItems(nextList);
    await dbService.saveKitItem(newItem);

    // Reset form
    setNewItemName('');
    setNewItemDetail('');
    setIsAddingItem(false);
  };

  // Reset to default
  const handleReset = async () => {
    if (window.confirm('Reset checklist back to official civil defense defaults? All custom items will be cleared.')) {
      setLoading(true);
      localStorage.removeItem('n_help_kit');
      await loadItems();
    }
  };

  // Calculations
  const totalCount = items.length;
  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { key: string; label: string; icon: any }[] = [
    { key: 'ALL', label: 'All Items', icon: Filter },
    { key: 'WATER', label: 'Water (3-Day)', icon: Droplet },
    { key: 'FOOD', label: 'Food & Rations', icon: Utensils },
    { key: 'MEDICINE', label: 'Medicine', icon: Pill },
    { key: 'FIRST_AID', label: 'First Aid', icon: HeartHandshake },
    { key: 'RADIO', label: 'Comms / Radio', icon: Radio },
    { key: 'TORCH', label: 'Light / Power', icon: Flashlight },
    { key: 'DOCUMENTS', label: 'Docs / Cash', icon: FileText },
  ];

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide uppercase">
                72-HOUR DISASTER SURVIVAL KIT
              </h1>
              <p className="text-xs text-zinc-400">
                IAEA & NDMA Recommended Civil Radiological Supply Checklist
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            title="Reset Checklist"
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Readiness Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300">
              Emergency Readiness: <span className="font-mono text-amber-400 font-bold">{progressPercent}%</span>
            </span>
            <span className="font-mono text-zinc-400 text-[11px]">
              {checkedCount} / {totalCount} Supplies Acquired
            </span>
          </div>
          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent >= 80 ? 'bg-emerald-500' : progressPercent >= 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Academic Warning Note */}
        <div className="mt-3 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-start gap-2 text-[11px] text-zinc-300">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Academic Note:</strong> Standard civil defence guidelines mandate minimum 3 to 7 days of complete autonomy. Sealed canned goods and plastic-bottled water avoid external radionuclide deposition.
          </span>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search kit items (e.g. water, radio, mask)..."
            className="w-full bg-disaster-card border border-disaster-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setIsAddingItem(!isAddingItem)}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom</span>
        </button>
      </div>

      {/* Add Custom Item Drawer */}
      {isAddingItem && (
        <form onSubmit={handleAddItem} className="p-4 bg-zinc-900 border border-amber-500/40 rounded-xl space-y-3 animate-fade-in">
          <h3 className="text-xs font-bold uppercase text-amber-400">Add Custom Supply Item</h3>
          <div className="space-y-2">
            <input
              type="text"
              required
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name (e.g., Baby Formula 2-week supply)"
              className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              value={newItemDetail}
              onChange={(e) => setNewItemDetail(e.target.value)}
              placeholder="Quantity / specific instructions"
              className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as KitCategory)}
              className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="WATER">Water & Hydration</option>
              <option value="FOOD">Food & Nutrition</option>
              <option value="MEDICINE">Prescription Medicine</option>
              <option value="FIRST_AID">First Aid Supplies</option>
              <option value="RADIO">Communication / Radio</option>
              <option value="TORCH">Lighting & Batteries</option>
              <option value="DOCUMENTS">Vital Documents</option>
              <option value="HYGIENE">Sanitation & Decontamination</option>
              <option value="OTHER">Other Essential</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400"
            >
              Save to Kit
            </button>
          </div>
        </form>
      )}

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors border ${
                isActive 
                  ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Item List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-10 text-xs text-zinc-500">Loading checklist items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-10 bg-disaster-card border border-disaster-border rounded-xl">
            <p className="text-xs text-zinc-400">No kit items found matching your criteria.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleToggle(item)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                item.checked 
                  ? 'bg-emerald-950/20 border-emerald-900/60 text-zinc-300' 
                  : 'bg-disaster-card border-disaster-border hover:border-zinc-700 text-zinc-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {item.checked ? (
                  <div className="w-5 h-5 rounded bg-emerald-500 text-black flex items-center justify-center font-bold">
                    <CheckSquare className="w-4 h-4 text-black" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded border border-zinc-600 bg-zinc-900 flex items-center justify-center hover:border-amber-400">
                    <Square className="w-3.5 h-3.5 text-transparent" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold ${item.checked ? 'line-through text-zinc-400' : 'text-white'}`}>
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {item.category}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-relaxed ${item.checked ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
