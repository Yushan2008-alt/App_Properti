'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Search, MapPin, TrendingUp, Home, Filter, BedDouble, Bath, Maximize2, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export interface MapProperty {
  id: string
  title: string
  type: string
  status: string
  price: number
  bedrooms: number | null
  bathrooms: number | null
  building_area: number | null
  land_area: number | null
  city: string
  district: string | null
  latitude: number
  longitude: number
  image_url: string | null
}

interface PropertyMapFullProps {
  properties: MapProperty[]
  height?: string
}

const TYPE_OPTIONS = ['Semua Tipe', 'rumah', 'apartemen', 'villa', 'ruko', 'tanah', 'gudang', 'kantor']
const STATUS_OPTIONS = ['Semua', 'jual', 'sewa']

const TYPE_COLOR: Record<string, string> = {
  rumah:     '#C9A96E',
  apartemen: '#1565c0',
  villa:     '#7b1fa2',
  ruko:      '#2e7d32',
  tanah:     '#795548',
  gudang:    '#546e7a',
  kantor:    '#37474f',
}

function formatPrice(price: number, status: string) {
  if (status === 'sewa') {
    return `Rp ${(price / 1_000_000).toFixed(0)} Jt/bln`
  }
  if (price >= 1_000_000_000) {
    return `Rp ${(price / 1_000_000_000).toFixed(1)} M`
  }
  return `Rp ${(price / 1_000_000).toFixed(0)} Jt`
}

export default function PropertyMapFull({ properties, height = '600px' }: PropertyMapFullProps) {
  const mapRef      = useRef<HTMLDivElement>(null)
  const mapInst     = useRef<unknown>(null)
  const heatRef     = useRef<unknown>(null)
  const markersRef  = useRef<unknown[]>([])
  const [isLoaded,  setIsLoaded]  = useState(false)
  const [mapMode,   setMapMode]   = useState<'properti' | 'heatmap'>('properti')
  const [typeFilter, setTypeFilter] = useState('Semua Tipe')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [search, setSearch]       = useState('')
  const [searching, setSearching] = useState(false)
  const [selected, setSelected]   = useState<MapProperty | null>(null)

  const filtered = properties.filter(p => {
    const typeOk   = typeFilter   === 'Semua Tipe' || p.type   === typeFilter
    const statusOk = statusFilter === 'Semua'      || p.status === statusFilter
    return typeOk && statusOk
  })

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInst.current) return
    let mounted = true

    ;(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (await import('leaflet')).default as any
      await import('leaflet.heat')

      if (!mounted || !mapRef.current) return

      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center: [-2.5, 118.0],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      mapInst.current = map
      setIsLoaded(true)
    })()

    return () => {
      mounted = false
      if (mapInst.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInst.current as any).remove()
        mapInst.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refresh markers / heatmap whenever filter / mode / data changes
  useEffect(() => {
    if (!isLoaded || !mapInst.current) return

    ;(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L   = (await import('leaflet')).default as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = mapInst.current as any

      // Clear old layers
      if (heatRef.current) { map.removeLayer(heatRef.current); heatRef.current = null }
      markersRef.current.forEach(m => map.removeLayer(m))
      markersRef.current = []

      if (mapMode === 'heatmap') {
        // Normalize price for intensity
        const prices = filtered.map(p => p.price)
        const maxP   = Math.max(...prices, 1)
        const heatData = filtered.map(p => [p.latitude, p.longitude, p.price / maxP])
        const layer = L.heatLayer(heatData, {
          radius: 40, blur: 30, maxZoom: 13, max: 1,
          gradient: { 0.0: '#1a237e', 0.3: '#1565c0', 0.5: '#00897b', 0.7: '#f9a825', 0.85: '#e65100', 1.0: '#b71c1c' },
        }).addTo(map)
        heatRef.current = layer
        return
      }

      // Property pins mode
      filtered.forEach(prop => {
        const color = TYPE_COLOR[prop.type] || '#C9A96E'
        const icon  = L.divIcon({
          className: '',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
          html: `<div style="
            width:14px;height:14px;
            background:${color};
            border:2px solid white;
            border-radius:50%;
            box-shadow:0 2px 6px rgba(0,0,0,0.35);
            cursor:pointer;
          "></div>`,
        })

        const marker = L.marker([prop.latitude, prop.longitude], { icon })
          .addTo(map)
          .on('click', () => setSelected(prop))

        markersRef.current.push(marker)
      })
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, mapMode, filtered.length, typeFilter, statusFilter])

  // Search via Nominatim (OpenStreetMap free geocoding)
  const handleSearch = useCallback(async () => {
    if (!search.trim() || !mapInst.current) return
    setSearching(true)
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search + ', Indonesia')}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'id' } }
      )
      const data = await res.json()
      if (data[0]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInst.current as any).flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 13, { duration: 1.2 })
      }
    } finally {
      setSearching(false)
    }
  }, [search])

  const labelMap: Record<string, string> = {
    rumah: 'Rumah', apartemen: 'Apartemen', villa: 'Villa',
    ruko: 'Ruko', tanah: 'Tanah', gudang: 'Gudang', kantor: 'Kantor',
  }

  return (
    <div className="w-full flex flex-col gap-4">

      {/* ── Controls bar ── */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs border border-border rounded-sm overflow-hidden bg-white">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Cari lokasi, kota, area..."
            className="flex-1 px-3 py-2 text-xs font-sans text-text-primary placeholder-text-tertiary focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-3 py-2 bg-accent-gold hover:bg-accent-gold-hover text-white transition-colors"
          >
            {searching
              ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Search className="w-3.5 h-3.5" />
            }
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-bg-secondary border border-border rounded-sm overflow-hidden">
          <button
            onClick={() => setMapMode('properti')}
            className={`px-4 py-2 text-xs font-sans font-medium transition-colors flex items-center gap-1.5 ${
              mapMode === 'properti' ? 'bg-bg-dark text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Properti
          </button>
          <button
            onClick={() => setMapMode('heatmap')}
            className={`px-4 py-2 text-xs font-sans font-medium transition-colors flex items-center gap-1.5 ${
              mapMode === 'heatmap' ? 'bg-bg-dark text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Heatmap
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-xs font-sans border border-border rounded-sm px-3 py-2 bg-white text-text-primary focus:outline-none focus:border-accent-gold capitalize"
          >
            {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-sans border border-border rounded-sm px-3 py-2 bg-white text-text-primary focus:outline-none focus:border-accent-gold capitalize"
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s === 'Semua' ? 'Jual & Sewa' : s === 'jual' ? 'Dijual' : 'Disewa'}</option>)}
          </select>
        </div>

        {/* Count */}
        <div className="ml-auto flex items-center gap-1.5 text-xs font-sans text-text-tertiary shrink-0">
          <Home className="w-3.5 h-3.5" />
          <span>{filtered.length} properti</span>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="relative rounded-sm overflow-hidden border border-border" style={{ height }}>
        {/* Loading */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-bg-secondary flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-sans text-text-tertiary">Memuat peta...</p>
            </div>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        {/* ── Property popup card ── */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[1000] bg-white rounded-sm shadow-luxury border border-border overflow-hidden">
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-bg-secondary transition-colors"
            >
              <X className="w-3.5 h-3.5 text-text-secondary" />
            </button>

            {/* Image */}
            <div className="relative h-36 bg-bg-secondary">
              {selected.image_url ? (
                <Image
                  src={selected.image_url}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="w-8 h-8 text-text-tertiary" />
                </div>
              )}
              {/* Badge */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-sm text-white ${
                  selected.status === 'jual' ? 'bg-status-success' : 'bg-accent-gold'
                }`}>
                  {selected.status === 'jual' ? 'Dijual' : 'Disewa'}
                </span>
                <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-sm bg-white/90 text-text-primary capitalize">
                  {labelMap[selected.type] || selected.type}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-xs font-sans font-bold text-accent-gold mb-0.5">
                {formatPrice(selected.price, selected.status)}
              </p>
              <h3 className="text-sm font-serif font-bold text-text-primary leading-snug line-clamp-2 mb-1">
                {selected.title}
              </h3>
              <p className="text-[11px] font-sans text-text-tertiary flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 shrink-0" />
                {[selected.district, selected.city].filter(Boolean).join(', ')}
              </p>

              {/* Specs */}
              {(selected.bedrooms || selected.bathrooms || selected.building_area) && (
                <div className="flex items-center gap-3 text-[11px] font-sans text-text-secondary mb-3">
                  {selected.bedrooms && (
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3 h-3" />{selected.bedrooms} KT
                    </span>
                  )}
                  {selected.bathrooms && (
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />{selected.bathrooms} KM
                    </span>
                  )}
                  {selected.building_area && (
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" />{selected.building_area} m²
                    </span>
                  )}
                </div>
              )}

              <Link
                href={`/properti/${selected.id}`}
                className="flex items-center justify-center gap-2 w-full py-2 bg-bg-dark text-white text-xs font-sans font-medium rounded-sm hover:bg-stone-800 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Lihat Detail Properti
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      {mapMode === 'properti' && (
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(TYPE_COLOR).map(([type, color]) => (
            <button
              key={type}
              onClick={() => setTypeFilter(f => f === type ? 'Semua Tipe' : type)}
              className={`flex items-center gap-1.5 text-xs font-sans transition-opacity ${
                typeFilter !== 'Semua Tipe' && typeFilter !== type ? 'opacity-40' : ''
              }`}
            >
              <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
              <span className="text-text-tertiary capitalize">{labelMap[type]}</span>
            </button>
          ))}
        </div>
      )}
      {mapMode === 'heatmap' && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans text-text-tertiary">Harga relatif:</span>
          <div className="h-2.5 w-36 rounded-full" style={{
            background: 'linear-gradient(to right, #1a237e, #1565c0, #00897b, #f9a825, #e65100, #b71c1c)'
          }} />
          <span className="text-xs font-sans text-text-tertiary">Rendah → Tinggi</span>
        </div>
      )}
    </div>
  )
}
