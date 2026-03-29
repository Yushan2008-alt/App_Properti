'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, TrendingUp, Home, Filter } from 'lucide-react'

interface HeatPoint {
  lat: number
  lng: number
  intensity: number
  price: number
  city: string
  type: string
  title: string
}

interface MarketPriceHeatmapProps {
  points?: HeatPoint[]
  height?: string
  showLegend?: boolean
  showControls?: boolean
}

// Default data dari properti yang sudah ada di database
const DEFAULT_POINTS: HeatPoint[] = [
  // Jakarta Selatan
  { lat: -6.2697, lng: 106.7890, intensity: 0.95, price: 8500, city: 'Jakarta Selatan', type: 'rumah', title: 'Pondok Indah' },
  { lat: -6.2629, lng: 106.8136, intensity: 0.75, price: 35, city: 'Jakarta Selatan', type: 'rumah', title: 'Kemang' },
  { lat: -6.2400, lng: 106.8000, intensity: 0.80, price: 4200, city: 'Jakarta Selatan', type: 'rumah', title: 'Cilandak' },
  // Jakarta Pusat
  { lat: -6.2088, lng: 106.8219, intensity: 0.85, price: 3200, city: 'Jakarta Pusat', type: 'apartemen', title: 'Sudirman' },
  { lat: -6.1944, lng: 106.8229, intensity: 0.78, price: 2800, city: 'Jakarta Pusat', type: 'apartemen', title: 'Thamrin' },
  // Jakarta Utara
  { lat: -6.1218, lng: 106.7889, intensity: 0.70, price: 6800, city: 'Jakarta Utara', type: 'ruko', title: 'Pluit' },
  // Tangerang
  { lat: -6.3022, lng: 106.6534, intensity: 0.65, price: 4500, city: 'Tangerang', type: 'tanah', title: 'BSD City' },
  { lat: -6.2400, lng: 106.6200, intensity: 0.60, price: 3800, city: 'Tangerang', type: 'rumah', title: 'Gading Serpong' },
  // Surabaya
  { lat: -7.2575, lng: 112.7521, intensity: 0.88, price: 5200, city: 'Surabaya', type: 'rumah', title: 'Pakuwon City' },
  { lat: -7.2931, lng: 112.7195, intensity: 0.72, price: 1850, city: 'Surabaya', type: 'apartemen', title: 'Ciputra' },
  { lat: -7.2806, lng: 112.7311, intensity: 0.68, price: 45, city: 'Surabaya', type: 'ruko', title: 'Darmo' },
  { lat: -7.3119, lng: 112.7009, intensity: 0.82, price: 3800, city: 'Surabaya', type: 'rumah', title: 'Graha Famili' },
  // Bali
  { lat: -8.6910, lng: 115.1568, intensity: 1.0, price: 18500, city: 'Bali', type: 'villa', title: 'Seminyak' },
  { lat: -8.5069, lng: 115.2625, intensity: 0.78, price: 8500, city: 'Bali', type: 'villa', title: 'Ubud' },
  { lat: -8.6482, lng: 115.1302, intensity: 0.88, price: 7200, city: 'Bali', type: 'villa', title: 'Canggu' },
  { lat: -8.7200, lng: 115.1700, intensity: 0.75, price: 5500, city: 'Bali', type: 'villa', title: 'Kuta' },
  // Bandung
  { lat: -6.8620, lng: 107.6332, intensity: 0.70, price: 4200, city: 'Bandung', type: 'rumah', title: 'Dago Pakar' },
  { lat: -6.9200, lng: 107.6100, intensity: 0.55, price: 2200, city: 'Bandung', type: 'rumah', title: 'Antapani' },
  // Yogyakarta
  { lat: -7.7867, lng: 110.3706, intensity: 0.62, price: 2800, city: 'Yogyakarta', type: 'rumah', title: 'Kotabaru' },
  { lat: -7.8000, lng: 110.3650, intensity: 0.55, price: 1800, city: 'Yogyakarta', type: 'rumah', title: 'Sleman' },
  // Medan
  { lat: 3.5952, lng: 98.6722, intensity: 0.58, price: 980, city: 'Medan', type: 'apartemen', title: 'Merdeka Walk' },
]

const CITY_OPTIONS = ['Semua Kota', 'Jakarta', 'Surabaya', 'Bali', 'Bandung', 'Yogyakarta', 'Medan', 'Tangerang']
const TYPE_OPTIONS = ['Semua Tipe', 'rumah', 'apartemen', 'villa', 'ruko', 'tanah']

export default function MarketPriceHeatmap({
  points = DEFAULT_POINTS,
  height = '500px',
  showLegend = true,
  showControls = true,
}: MarketPriceHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const heatLayerRef = useRef<unknown>(null)
  const markersRef = useRef<unknown[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Semua Kota')
  const [selectedType, setSelectedType] = useState('Semua Tipe')
  const [hoveredPoint, setHoveredPoint] = useState<HeatPoint | null>(null)
  const [mapMode, setMapMode] = useState<'heat' | 'pins'>('heat')

  const filteredPoints = points.filter(p => {
    const cityMatch = selectedCity === 'Semua Kota' || p.city.includes(selectedCity)
    const typeMatch = selectedType === 'Semua Tipe' || p.type === selectedType
    return cityMatch && typeMatch
  })

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamic import untuk menghindari SSR error
    const initMap = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (await import('leaflet')).default as any
      await import('leaflet.heat')

      // Fix default icon issue dengan Next.js
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Inisialisasi peta Indonesia
      const map = L.map(mapRef.current!, {
        center: [-2.5, 118.0],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      // Tile layer OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      mapInstanceRef.current = map
      setIsLoaded(true)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update heatmap/pins saat filter atau mode berubah
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return

    const updateMap = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (await import('leaflet')).default as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = mapInstanceRef.current as any

      // Hapus layer lama
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      }
      markersRef.current.forEach(m => map.removeLayer(m))
      markersRef.current = []

      if (mapMode === 'heat') {
        // Heatmap mode
        const heatData = filteredPoints.map(p => [p.lat, p.lng, p.intensity])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const heatLayer = (L as any).heatLayer(heatData, {
          radius: 35,
          blur: 25,
          maxZoom: 12,
          max: 1.0,
          gradient: {
            0.0: '#1a237e',
            0.2: '#1565c0',
            0.4: '#00897b',
            0.6: '#f9a825',
            0.8: '#e65100',
            1.0: '#b71c1c',
          },
        }).addTo(map)
        heatLayerRef.current = heatLayer
      } else {
        // Pins mode
        filteredPoints.forEach(p => {
          const colorMap: Record<string, string> = {
            rumah: '#C9A96E',
            apartemen: '#1565c0',
            villa: '#6a1b9a',
            ruko: '#2e7d32',
            tanah: '#795548',
            gudang: '#546e7a',
            kantor: '#37474f',
          }
          const color = colorMap[p.type] || '#C9A96E'

          const customIcon = L.divIcon({
            className: '',
            html: `<div style="
              background:${color};
              color:white;
              padding:4px 8px;
              border-radius:4px;
              font-size:11px;
              font-weight:600;
              font-family:sans-serif;
              white-space:nowrap;
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
              border:2px solid white;
            ">
              Rp ${p.price >= 1000 ? (p.price / 1000).toFixed(1) + 'M' : p.price + 'Jt'}
            </div>`,
            iconAnchor: [30, 12],
          })

          const marker = L.marker([p.lat, p.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:sans-serif;padding:4px;">
                <strong style="font-size:13px;">${p.title}</strong><br/>
                <span style="color:#666;font-size:12px;">${p.city} · ${p.type}</span><br/>
                <span style="color:#C9A96E;font-weight:700;font-size:14px;">
                  Rp ${p.price >= 1000 ? (p.price / 1000).toFixed(1) + ' M' : p.price + ' Jt'}
                </span>
              </div>
            `)
          markersRef.current.push(marker)
        })
      }
    }

    updateMap()
  }, [isLoaded, filteredPoints, mapMode])

  return (
    <div className="w-full">
      {/* Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Mode Toggle */}
          <div className="flex bg-bg-secondary border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setMapMode('heat')}
              className={`px-4 py-2 text-xs font-sans font-medium transition-colors flex items-center gap-1.5 ${
                mapMode === 'heat'
                  ? 'bg-bg-dark text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Heatmap
            </button>
            <button
              onClick={() => setMapMode('pins')}
              className={`px-4 py-2 text-xs font-sans font-medium transition-colors flex items-center gap-1.5 ${
                mapMode === 'pins'
                  ? 'bg-bg-dark text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Harga per Area
            </button>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-text-tertiary" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="text-xs font-sans border border-border rounded-sm px-3 py-2 bg-white text-text-primary focus:outline-none focus:border-accent-gold"
            >
              {CITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs font-sans border border-border rounded-sm px-3 py-2 bg-white text-text-primary focus:outline-none focus:border-accent-gold capitalize"
          >
            {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>

          {/* Stats */}
          <div className="ml-auto flex items-center gap-1.5 text-xs font-sans text-text-tertiary">
            <Home className="w-3.5 h-3.5" />
            <span>{filteredPoints.length} area terdata</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-sm overflow-hidden border border-border" style={{ height }}>
        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-bg-secondary flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-sans text-text-tertiary">Memuat peta...</p>
            </div>
          </div>
        )}

        {/* Leaflet map mount point */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Tooltip hover */}
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 bg-white border border-border rounded-sm shadow-luxury px-4 py-3 z-[1000] pointer-events-none"
          >
            <p className="text-xs font-sans font-semibold text-text-primary">{hoveredPoint.title}</p>
            <p className="text-xs font-sans text-text-tertiary capitalize">{hoveredPoint.type} · {hoveredPoint.city}</p>
            <p className="text-sm font-sans font-bold text-accent-gold mt-1">
              Rp {hoveredPoint.price >= 1000 ? (hoveredPoint.price / 1000).toFixed(1) + ' M' : hoveredPoint.price + ' Jt'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      {showLegend && mapMode === 'heat' && (
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs font-sans text-text-tertiary">Harga per area:</span>
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-32 rounded-full" style={{
              background: 'linear-gradient(to right, #1a237e, #1565c0, #00897b, #f9a825, #e65100, #b71c1c)'
            }} />
          </div>
          <div className="flex items-center justify-between text-xs font-sans text-text-tertiary gap-2">
            <span>Rendah</span>
            <span>Tinggi</span>
          </div>
        </div>
      )}

      {/* Type legend for pins mode */}
      {showLegend && mapMode === 'pins' && (
        <div className="flex flex-wrap items-center gap-3 mt-3">
          {[
            { type: 'rumah', color: '#C9A96E', label: 'Rumah' },
            { type: 'apartemen', color: '#1565c0', label: 'Apartemen' },
            { type: 'villa', color: '#6a1b9a', label: 'Villa' },
            { type: 'ruko', color: '#2e7d32', label: 'Ruko' },
            { type: 'tanah', color: '#795548', label: 'Tanah' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-sans text-text-tertiary">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
