import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  Layers, 
  ShieldAlert, 
  Hospital, 
  Home, 
  MapPin, 
  Wind, 
  Download,
  Trash2,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MapPoi {
  id: string;
  name: string;
  category: 'REACTOR' | 'SHELTER' | 'MEDICAL' | 'CHECKPOINT';
  lat: number;
  lng: number;
  description: string;
  capacity?: string;
  distanceKm: number;
}

type MapProviderType = 'cartodb-dark' | 'osm-standard' | 'mapbox-dark' | 'mapbox-satellite';

export const EmergencyMapLeaflet: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Filter state
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showMedical, setShowMedical] = useState<boolean>(true);
  const [showCheckpoints, setShowCheckpoints] = useState<boolean>(true);
  const [showPlume, setShowPlume] = useState<boolean>(true);
  const [selectedPoi, setSelectedPoi] = useState<MapPoi | null>(null);

  // Offline Caching State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [cachedTileCount, setCachedTileCount] = useState<number>(0);
  const [lastCachedTime, setLastCachedTime] = useState<string | null>(() => {
    return localStorage.getItem('n_help_map_cached_at');
  });

  // Map Provider & API Key State
  const [showKeyGuide, setShowKeyGuide] = useState<boolean>(false);
  const [mapProvider, setMapProvider] = useState<MapProviderType>(() => {
    return (localStorage.getItem('n_help_map_provider') as MapProviderType) || 'cartodb-dark';
  });
  const [mapboxKey, setMapboxKey] = useState<string>(() => {
    return localStorage.getItem('n_help_mapbox_key') || '';
  });
  const [keyInput, setKeyInput] = useState<string>(mapboxKey);
  const [keyMessage, setKeyMessage] = useState<string | null>(null);

  // Narora Atomic Power Station (NAPS) Coordinates
  const NAPS_LAT = 28.1578;
  const NAPS_LNG = 78.4144;

  const POIS: MapPoi[] = [
    {
      id: 'naps-core',
      name: 'Narora Atomic Power Station (NAPS)',
      category: 'REACTOR',
      lat: NAPS_LAT,
      lng: NAPS_LNG,
      description: 'Twin 220 MWe Pressurized Heavy Water Reactors (PHWR). Reference demonstration focal point.',
      distanceKm: 0
    },
    {
      id: 'shelter-narora-civic',
      name: 'Narora Civil Defense Underground Shelter',
      category: 'SHELTER',
      lat: 28.1950,
      lng: 78.3800,
      description: 'Reinforced concrete community basement. Protection Factor (PF) ~40. Stocked with sealed water.',
      capacity: '450 Persons',
      distanceKm: 5.3
    },
    {
      id: 'shelter-anupshahr',
      name: 'Anupshahr Municipal Primary Shelter',
      category: 'SHELTER',
      lat: 28.3600,
      lng: 78.2700,
      description: 'Designated civil emergency evacuation shelter located outside the 15km UPZ.',
      capacity: '1,200 Persons',
      distanceKm: 26.8
    },
    {
      id: 'hosp-bulandshahr',
      name: 'Bulandshahr District Hospital & Decon Unit',
      category: 'MEDICAL',
      lat: 28.4069,
      lng: 77.8498,
      description: 'Designated radiological triage center, external decontamination wash bays & medical trauma unit.',
      capacity: '300 Beds + Decon Facility',
      distanceKm: 62.0
    },
    {
      id: 'hosp-aligarh-jnmc',
      name: 'Jawaharlal Nehru Medical College (Aligarh)',
      category: 'MEDICAL',
      lat: 27.9150,
      lng: 78.0820,
      description: 'Tertiary referral center with advanced acute radiation syndrome (ARS) isolation beds.',
      capacity: 'Regional Trauma Command',
      distanceKm: 42.5
    },
    {
      id: 'checkpoint-north',
      name: 'Radiation Screening Checkpoint North (NH 509)',
      category: 'CHECKPOINT',
      lat: 28.2800,
      lng: 78.4300,
      description: 'Civil defence portal radiation monitor (PRM) vehicular screening and wash point.',
      distanceKm: 13.7
    },
    {
      id: 'checkpoint-south',
      name: 'Radiation Screening Checkpoint South (Debai Rd)',
      category: 'CHECKPOINT',
      lat: 28.1000,
      lng: 78.3500,
      description: 'Evacuation traffic regulation and pedestrian whole-body contamination screening.',
      distanceKm: 9.1
    }
  ];

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check existing cached tile count
    if ('caches' in window) {
      caches.open('n-help-map-tiles-v1').then(cache => {
        cache.keys().then(keys => {
          setCachedTileCount(keys.length);
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper to get tile URL according to selected provider
  const getTileUrl = (provider: MapProviderType, key: string): { url: string; attribution: string } => {
    if (provider === 'mapbox-satellite' && key.trim()) {
      return {
        url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${key.trim()}`,
        attribution: '&copy; Mapbox &copy; OpenStreetMap contributors'
      };
    }
    if (provider === 'mapbox-dark' && key.trim()) {
      return {
        url: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${key.trim()}`,
        attribution: '&copy; Mapbox &copy; OpenStreetMap contributors'
      };
    }
    if (provider === 'osm-standard') {
      return {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors'
      };
    }
    // Default: CartoDB Dark Matter
    return {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB &copy; OpenStreetMap contributors'
    };
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [NAPS_LAT, NAPS_LNG],
      zoom: 11,
      minZoom: 9,
      maxZoom: 15,
      zoomControl: false
    });

    const { url, attribution } = getTileUrl(mapProvider, mapboxKey);
    const tileLayer = L.tileLayer(url, {
      attribution,
      maxZoom: 18,
      crossOrigin: true
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;
    layersGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when provider or API key changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const { url, attribution } = getTileUrl(mapProvider, mapboxKey);
    const newLayer = L.tileLayer(url, {
      attribution,
      maxZoom: 18,
      crossOrigin: true
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [mapProvider, mapboxKey]);

  // Update map overlays whenever filters change
  useEffect(() => {
    const layerGroup = layersGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw AERB Emergency Planning Zones
    if (showZones) {
      // On-site exclusion (1.6 km)
      L.circle([NAPS_LAT, NAPS_LNG], {
        radius: 1600,
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '4, 4'
      }).bindTooltip('Exclusion Zone (1.6 km)', { permanent: false }).addTo(layerGroup);

      // Precautionary Action Zone - PAZ (5 km)
      L.circle([NAPS_LAT, NAPS_LNG], {
        radius: 5000,
        color: '#ea580c',
        fillColor: '#ea580c',
        fillOpacity: 0.15,
        weight: 2
      }).bindTooltip('AERB PAZ: Precautionary Action Zone (0-5 km)', { permanent: false }).addTo(layerGroup);

      // Urgent Protective Action Planning Zone - UPZ (15 km)
      L.circle([NAPS_LAT, NAPS_LNG], {
        radius: 15000,
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '6, 6'
      }).bindTooltip('AERB UPZ: Urgent Protective Action Zone (5-15 km)', { permanent: false }).addTo(layerGroup);
    }

    // 2. Draw Hypothetical Wind Dispersion Plume (Eastward / South-East)
    if (showPlume) {
      const plumeCoords: [number, number][] = [
        [NAPS_LAT, NAPS_LNG],
        [NAPS_LAT + 0.04, NAPS_LNG + 0.18],
        [NAPS_LAT - 0.02, NAPS_LNG + 0.22],
        [NAPS_LAT - 0.08, NAPS_LNG + 0.17],
        [NAPS_LAT, NAPS_LNG]
      ];

      L.polygon(plumeCoords, {
        color: '#f43f5e',
        fillColor: '#f43f5e',
        fillOpacity: 0.2,
        weight: 1.5,
        dashArray: '3, 6'
      }).bindTooltip('Simulated Downwind Plume Sector (Gaussian Model Demonstration)', { permanent: false }).addTo(layerGroup);
    }

    // 3. Draw POI Markers
    POIS.forEach(poi => {
      if (poi.category === 'SHELTER' && !showShelters) return;
      if (poi.category === 'MEDICAL' && !showMedical) return;
      if (poi.category === 'CHECKPOINT' && !showCheckpoints) return;

      let color = '#3b82f6';
      let iconSymbol = '📍';

      if (poi.category === 'REACTOR') {
        color = '#ef4444';
        iconSymbol = '⚛️';
      } else if (poi.category === 'SHELTER') {
        color = '#10b981';
        iconSymbol = '🛡️';
      } else if (poi.category === 'MEDICAL') {
        color = '#06b6d4';
        iconSymbol = '🏥';
      } else if (poi.category === 'CHECKPOINT') {
        color = '#f59e0b';
        iconSymbol = '🚧';
      }

      const customIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `<div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(0,0,0,0.6);
          font-size: 15px;
          cursor: pointer;
        ">${iconSymbol}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedPoi(poi);
      });
      marker.addTo(layerGroup);
    });
  }, [showZones, showShelters, showMedical, showCheckpoints, showPlume]);

  // Coordinate to Tile Helpers
  const lon2tile = (lon: number, zoom: number): number => {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  };

  const lat2tile = (lat: number, zoom: number): number => {
    return Math.floor(
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
        Math.pow(2, zoom)
    );
  };

  // DOWNLOAD ACTUAL MAP TILES FOR OFFLINE USE
  const handleDownloadOfflineMap = async () => {
    if (!isOnline) {
      alert('Cannot download map while offline. Please connect to the internet first to download and cache map tiles.');
      return;
    }

    if (!('caches' in window)) {
      alert('Your browser does not support CacheStorage for offline maps.');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    // Bounding Box around Narora Nuclear Facility & 30km Planning Area:
    // Lat: 27.90 to 28.45 | Lng: 78.10 to 78.70
    const zooms = [10, 11, 12];
    const tilesToFetch: string[] = [];

    const { url: template } = getTileUrl(mapProvider, mapboxKey);

    zooms.forEach(z => {
      const minX = lon2tile(78.10, z);
      const maxX = lon2tile(78.70, z);
      const minY = lat2tile(28.45, z);
      const maxY = lat2tile(27.90, z);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          const tileUrl = template
            .replace('{s}', 'a')
            .replace('{z}', z.toString())
            .replace('{x}', x.toString())
            .replace('{y}', y.toString())
            .replace('{r}', '');
          tilesToFetch.push(tileUrl);
        }
      }
    });

    const total = tilesToFetch.length;
    let completed = 0;

    try {
      const mapCache = await caches.open('n-help-map-tiles-v1');

      for (const tUrl of tilesToFetch) {
        try {
          const res = await fetch(tUrl, { mode: 'cors' });
          if (res.ok || res.type === 'opaque') {
            await mapCache.put(tUrl, res);
          }
        } catch (e) {
          // If a single tile fails, continue with remaining
        }
        completed++;
        setDownloadProgress(Math.round((completed / total) * 100));
      }

      const keys = await mapCache.keys();
      setCachedTileCount(keys.length);
      const timeStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastCachedTime(timeStr);
      localStorage.setItem('n_help_map_cached_at', timeStr);
      alert(`Success! Downloaded ${keys.length} map tiles covering Narora and surrounding civil defense zones. The map will now work completely offline.`);
    } catch (err) {
      console.error('Failed to cache map tiles:', err);
      alert('Failed to cache all tiles. Check connection and retry.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Clear offline map cache
  const handleClearOfflineMap = async () => {
    if (window.confirm('Delete downloaded offline map tiles? The map will require internet until re-downloaded.')) {
      if ('caches' in window) {
        await caches.delete('n-help-map-tiles-v1');
        setCachedTileCount(0);
        setLastCachedTime(null);
        localStorage.removeItem('n_help_map_cached_at');
      }
    }
  };

  // Save Custom Mapbox Key
  const handleSaveMapboxKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyInput.trim();
    setMapboxKey(trimmed);
    localStorage.setItem('n_help_mapbox_key', trimmed);
    if (trimmed) {
      setMapProvider('mapbox-dark');
      localStorage.setItem('n_help_map_provider', 'mapbox-dark');
      setKeyMessage('Mapbox token applied successfully! Switched to Mapbox Dark layer.');
    } else {
      setMapProvider('cartodb-dark');
      localStorage.setItem('n_help_map_provider', 'cartodb-dark');
      setKeyMessage('Token cleared. Switched back to CartoDB Dark Matter.');
    }
    setTimeout(() => setKeyMessage(null), 4000);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              OFFLINE EMERGENCY MAP: NARORA (NAPS)
            </h1>
            <p className="text-xs text-zinc-400">
              AERB Civil Defense Planning Zones (PAZ/UPZ), Shelters & Offline Caching
            </p>
          </div>
        </div>

        {/* Online / Offline Status Badge */}
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold">
              <Wifi className="w-3.5 h-3.5" />
              <span>ONLINE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-amber-400 font-bold">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE</span>
            </span>
          )}
        </div>
      </div>

      {/* OFFLINE MAP DOWNLOAD & CACHING CONTROL BAR */}
      <div className="p-4 bg-disaster-card border border-disaster-border rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Offline Map Storage & Download Manager
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {cachedTileCount > 0 ? (
                <span className="text-emerald-400 font-semibold">
                  ✓ {cachedTileCount} tiles cached locally (Narora + 30km radius) • Last downloaded: {lastCachedTime || 'Recently'}
                </span>
              ) : (
                <span>No offline map downloaded yet. Download now while internet is available.</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {cachedTileCount > 0 && (
              <button
                onClick={handleClearOfflineMap}
                disabled={isDownloading}
                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-800 rounded-lg text-xs transition-colors flex items-center gap-1"
                title="Delete cached map tiles"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Map</span>
              </button>
            )}

            <button
              onClick={handleDownloadOfflineMap}
              disabled={isDownloading}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-colors ${
                isDownloading
                  ? 'bg-amber-500/50 text-black cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black'
              }`}
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading ({downloadProgress}%)</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{cachedTileCount > 0 ? 'Update Offline Map' : 'Download Map for Offline'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Download Progress Bar */}
        {isDownloading && (
          <div className="space-y-1 pt-1 animate-fade-in">
            <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-zinc-800">
              <div 
                className="h-full bg-cyan-400 transition-all duration-200 rounded-full"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>Fetching Narora Emergency Sector tiles...</span>
              <span>{downloadProgress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* FREE MAP API KEY & PROVIDER ACCORDION GUIDE */}
      <div className="bg-disaster-card border border-disaster-border rounded-xl overflow-hidden">
        <div 
          onClick={() => setShowKeyGuide(!showKeyGuide)}
          className="p-3.5 cursor-pointer hover:bg-zinc-800/40 transition-colors flex items-center justify-between select-none"
        >
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Map Provider & Free API Key Guide
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400">
              Current: {mapProvider === 'cartodb-dark' ? 'CartoDB Dark (Free)' : mapProvider === 'osm-standard' ? 'OpenStreetMap' : 'Mapbox Custom'}
            </span>
            {showKeyGuide ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </div>
        </div>

        {showKeyGuide && (
          <div className="p-4 border-t border-zinc-800/80 space-y-3.5 text-xs text-zinc-300 animate-fade-in">
            {/* Guide Text */}
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs uppercase">
                1. Default Provider: OpenStreetMap / CartoDB (Zero Key Needed)
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                By default, N-HELP uses <strong>CartoDB Dark Matter</strong>. It is 100% free, open-source, and requires <strong>NO API key or signup</strong>. It is pre-configured and ready to download offline immediately.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <h3 className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                <span>2. Want Satellite / High-Res Mapbox Imagery? How to get a FREE API Key:</span>
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Mapbox provides a <strong>100% Free Forever Tier</strong> that includes <strong>50,000 free map loads every month</strong> without paying a single rupee.
              </p>

              <div className="space-y-1.5 bg-black/60 p-3 rounded-lg border border-zinc-800 text-[11px] font-mono">
                <p>• <strong>Step 1:</strong> Go to <a href="https://account.mapbox.com/auth/signup/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">account.mapbox.com/auth/signup/ <ExternalLink className="w-2.5 h-2.5" /></a> and create a free account.</p>
                <p>• <strong>Step 2:</strong> Once logged in, open your Account Dashboard $\to$ click <strong>Tokens</strong>.</p>
                <p>• <strong>Step 3:</strong> Copy your <strong>Default public token</strong> (it begins with <code>pk.eyJ...</code>).</p>
                <p>• <strong>Step 4:</strong> Paste it in the input below and click "Save & Apply".</p>
              </div>
            </div>

            {/* Token Input Form */}
            <form onSubmit={handleSaveMapboxKey} className="space-y-2 pt-1">
              <label className="block text-[11px] font-bold text-zinc-300">
                Custom Mapbox Access Token (Optional):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Paste your free Mapbox public token (pk.eyJ...)"
                  className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-colors shrink-0"
                >
                  Save & Apply
                </button>
              </div>
              {keyMessage && (
                <p className="text-[11px] text-emerald-400 font-medium">{keyMessage}</p>
              )}
            </form>

            {/* Provider Switcher Buttons */}
            <div className="pt-2 border-t border-zinc-800 space-y-1.5">
              <span className="block text-[11px] font-bold text-zinc-400 uppercase">
                Switch Active Tile Layer:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMapProvider('cartodb-dark');
                    localStorage.setItem('n_help_map_provider', 'cartodb-dark');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    mapProvider === 'cartodb-dark' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  CartoDB Dark Matter (Free Default)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMapProvider('osm-standard');
                    localStorage.setItem('n_help_map_provider', 'osm-standard');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    mapProvider === 'osm-standard' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  OpenStreetMap Standard (Free)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!mapboxKey) {
                      alert('Please paste and save your free Mapbox token first.');
                      return;
                    }
                    setMapProvider('mapbox-dark');
                    localStorage.setItem('n_help_map_provider', 'mapbox-dark');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    mapProvider === 'mapbox-dark' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Mapbox Dark (Token Required)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!mapboxKey) {
                      alert('Please paste and save your free Mapbox token first.');
                      return;
                    }
                    setMapProvider('mapbox-satellite');
                    localStorage.setItem('n_help_map_provider', 'mapbox-satellite');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    mapProvider === 'mapbox-satellite' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Mapbox Satellite (Token Required)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Academic Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/60 flex items-start gap-2.5 text-xs text-red-200">
        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-red-300">
            ACADEMIC SCENARIO DEMONSTRATION MAP
          </span>
          <span className="text-[11px] leading-relaxed text-red-200/90">
            This map displays hypothetical civil defense planning zones and shelters around Narora Atomic Power Station for Course CHE110. It does NOT provide real-time sensor measurements or live fallout trajectories.
          </span>
        </div>
      </div>

      {/* Map Filter Controls */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setShowZones(!showZones)}
          className={`px-3 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
            showZones 
              ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>AERB Zones (5/15 km)</span>
        </button>

        <button
          onClick={() => setShowShelters(!showShelters)}
          className={`px-3 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
            showShelters 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Civil Shelters</span>
        </button>

        <button
          onClick={() => setShowMedical(!showMedical)}
          className={`px-3 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
            showMedical 
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}
        >
          <Hospital className="w-3.5 h-3.5" />
          <span>Hospitals & Decon</span>
        </button>

        <button
          onClick={() => setShowPlume(!showPlume)}
          className={`px-3 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
            showPlume 
              ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Simulated Plume Vector</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[440px] rounded-2xl overflow-hidden border border-disaster-border shadow-2xl bg-black">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Legend Box in Upper Left */}
        <div className="absolute top-3 left-3 z-10 p-2.5 rounded-xl bg-black/85 backdrop-blur border border-zinc-800 text-[10px] space-y-1.5 max-w-[190px]">
          <span className="font-bold text-zinc-300 uppercase tracking-wider block">Zone Reference</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
            <span className="text-zinc-300">0-1.6 km: Exclusion Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-600 shrink-0" />
            <span className="text-zinc-300">0-5 km: PAZ (Immediate)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <span className="text-zinc-300">5-15 km: UPZ (Urgent Prep)</span>
          </div>
        </div>

        {/* Selected POI Details Modal */}
        {selectedPoi && (
          <div className="absolute bottom-3 left-3 right-3 z-10 p-3.5 rounded-xl bg-zinc-950/95 backdrop-blur border border-zinc-700 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold uppercase">
                  {selectedPoi.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{selectedPoi.name}</h3>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">{selectedPoi.description}</p>
                {selectedPoi.capacity && (
                  <p className="text-emerald-400 text-[11px] font-mono mt-1 font-semibold">
                    Capacity: {selectedPoi.capacity}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedPoi(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
