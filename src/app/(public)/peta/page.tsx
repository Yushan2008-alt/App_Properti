import type { Metadata } from 'next'
import { MapPin, Info } from 'lucide-react'
import MarketPriceHeatmapClient from '@/components/map/MarketPriceHeatmapClient'

export const metadata: Metadata = {
  title: 'Market Price Heatmap | PropVista',
  description: 'Visualisasi interaktif harga properti per area di seluruh Indonesia. Temukan peluang investasi terbaik.',
}

export default function PetaPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-accent-gold" />
                <p className="text-xs font-sans font-semibold tracking-[0.2em] text-accent-gold uppercase">
                  Market Price Heatmap
                </p>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
                Peta Harga Properti Indonesia
              </h1>
              <p className="mt-1.5 text-sm font-sans text-text-secondary max-w-2xl">
                Visualisasi interaktif harga properti per area. Gunakan filter kota dan tipe properti
                untuk menemukan peluang investasi terbaik di seluruh Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info banner */}
        <div className="flex items-start gap-3 bg-accent-gold/10 border border-accent-gold/30 rounded-sm px-4 py-3 mb-6">
          <Info className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
          <p className="text-xs font-sans text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">Mode Heatmap:</span> Warna merah menunjukkan area dengan harga tertinggi.
            {' '}<span className="font-semibold text-text-primary">Mode Harga per Area:</span> Klik pin untuk melihat detail harga dan tipe properti.
            Data diperbarui secara real-time dari listing aktif PropVista.
          </p>
        </div>

        {/* Full size map */}
        <MarketPriceHeatmapClient height="calc(100vh - 340px)" />

        {/* Area price table */}
        <div className="mt-10">
          <h2 className="text-lg font-serif font-bold text-text-primary mb-4">
            Ringkasan Harga per Kota
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Kota</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Tipe Dominan</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Harga Mulai</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Harga Tertinggi</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Indeks Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { kota: 'Bali', tipe: 'Villa', mulai: 'Rp 8,5 Jt/bln', tertinggi: 'Rp 18,5 M', indeks: 95, trend: 'up' },
                  { kota: 'Jakarta Selatan', tipe: 'Rumah', mulai: 'Rp 35 Jt/bln', tertinggi: 'Rp 8,5 M', indeks: 88, trend: 'up' },
                  { kota: 'Surabaya', tipe: 'Rumah', mulai: 'Rp 45 Jt/bln', tertinggi: 'Rp 5,2 M', indeks: 78, trend: 'stable' },
                  { kota: 'Bandung', tipe: 'Rumah', mulai: 'Rp 1,8 M', tertinggi: 'Rp 4,2 M', indeks: 65, trend: 'up' },
                  { kota: 'Tangerang', tipe: 'Tanah', mulai: 'Rp 3,8 M', tertinggi: 'Rp 4,5 M', indeks: 62, trend: 'stable' },
                  { kota: 'Yogyakarta', tipe: 'Rumah', mulai: 'Rp 1,8 M', tertinggi: 'Rp 2,8 M', indeks: 55, trend: 'up' },
                  { kota: 'Medan', tipe: 'Apartemen', mulai: 'Rp 980 Jt', tertinggi: 'Rp 980 Jt', indeks: 48, trend: 'stable' },
                ].map(row => (
                  <tr key={row.kota} className="hover:bg-bg-secondary transition-colors">
                    <td className="py-3 px-4 font-medium text-text-primary">{row.kota}</td>
                    <td className="py-3 px-4 text-text-secondary capitalize">{row.tipe}</td>
                    <td className="py-3 px-4 text-right text-text-secondary">{row.mulai}</td>
                    <td className="py-3 px-4 text-right font-semibold text-text-primary">{row.tertinggi}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="flex-1 max-w-[80px] bg-bg-secondary rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-accent-gold"
                            style={{ width: `${row.indeks}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-tertiary w-8 text-right">{row.indeks}</span>
                        <span className="text-xs">
                          {row.trend === 'up' ? '↑' : '→'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
