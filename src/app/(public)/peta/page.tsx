import type { Metadata } from 'next'
import { MapPin, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyMapClient from '@/components/map/PropertyMapClient'
import type { MapProperty } from '@/components/map/PropertyMapFull'

export const metadata: Metadata = {
  title: 'Peta Properti | PropVista',
  description: 'Temukan lokasi properti impian di seluruh Indonesia. Cari rumah, villa, apartemen di peta interaktif.',
}

async function getMapProperties(): Promise<MapProperty[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id, title, type, status, price,
        bedrooms, bathrooms, building_area, land_area,
        city, district, latitude, longitude,
        property_images(url, is_primary)
      `)
      .eq('is_published', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false })

    if (error || !data) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map(p => ({
      id:            p.id,
      title:         p.title,
      type:          p.type,
      status:        p.status,
      price:         p.price,
      bedrooms:      p.bedrooms,
      bathrooms:     p.bathrooms,
      building_area: p.building_area,
      land_area:     p.land_area,
      city:          p.city,
      district:      p.district,
      latitude:      p.latitude,
      longitude:     p.longitude,
      image_url:     p.property_images?.find((img: { is_primary: boolean; url: string }) => img.is_primary)?.url
                     ?? p.property_images?.[0]?.url
                     ?? null,
    }))
  } catch {
    return []
  }
}

export default async function PetaPage() {
  const properties = await getMapProperties()

  // Ringkasan harga per kota dari data real
  const cityStats = Object.entries(
    properties.reduce<Record<string, number[]>>((acc, p) => {
      const key = p.city
      if (!acc[key]) acc[key] = []
      acc[key].push(p.price)
      return acc
    }, {})
  )
    .map(([city, prices]) => ({
      city,
      count:  prices.length,
      min:    Math.min(...prices),
      max:    Math.max(...prices),
    }))
    .sort((a, b) => b.max - a.max)

  function fmtPrice(p: number) {
    if (p >= 1_000_000_000) return `Rp ${(p / 1_000_000_000).toFixed(1)} M`
    if (p >= 1_000_000)     return `Rp ${(p / 1_000_000).toFixed(0)} Jt`
    return `Rp ${p.toLocaleString('id-ID')}`
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-accent-gold" />
            <p className="text-xs font-sans font-semibold tracking-[0.2em] text-accent-gold uppercase">
              Peta Interaktif
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
            Temukan Properti di Peta
          </h1>
          <p className="mt-1.5 text-sm font-sans text-text-secondary max-w-2xl">
            {properties.length} properti aktif tersebar di seluruh Indonesia.
            Klik pin untuk melihat detail, atau gunakan search untuk mencari lokasi tertentu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info */}
        <div className="flex items-start gap-3 bg-accent-gold/10 border border-accent-gold/30 rounded-sm px-4 py-3 mb-6">
          <Info className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
          <p className="text-xs font-sans text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">Mode Properti:</span> Klik dot/pin di peta untuk melihat detail properti beserta foto, harga, dan spesifikasi.
            {' '}<span className="font-semibold text-text-primary">Search:</span> Ketik nama kota atau area lalu tekan Enter untuk zoom otomatis ke lokasi tersebut.
            {' '}<span className="font-semibold text-text-primary">Mode Heatmap:</span> Visualisasi konsentrasi harga per area.
          </p>
        </div>

        {/* Map */}
        <PropertyMapClient
          properties={properties}
          height="calc(100vh - 320px)"
        />

        {/* Tabel ringkasan dari data real */}
        {cityStats.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-serif font-bold text-text-primary mb-4">
              Ringkasan Properti per Kota
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Kota</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Listing</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Harga Mulai</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Harga Tertinggi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cityStats.map(row => (
                    <tr key={row.city} className="hover:bg-bg-secondary transition-colors">
                      <td className="py-3 px-4 font-medium text-text-primary">{row.city}</td>
                      <td className="py-3 px-4 text-center text-text-secondary">{row.count} properti</td>
                      <td className="py-3 px-4 text-right text-text-secondary">{fmtPrice(row.min)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-text-primary">{fmtPrice(row.max)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
