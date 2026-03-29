'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapIcon } from 'lucide-react'

const MarketPriceHeatmap = dynamic(
  () => import('@/components/map/MarketPriceHeatmap'),
  { ssr: false }
)

export default function HeatmapSection() {
  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-xs font-sans font-semibold tracking-[0.2em] text-accent-gold uppercase mb-3 flex items-center gap-2">
              <MapIcon className="w-3.5 h-3.5" />
              DATA
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary leading-tight">
              Market Price Heatmap
            </h2>
            <p className="mt-3 text-sm font-sans text-text-secondary max-w-lg">
              Visualisasi interaktif harga properti per area di seluruh Indonesia.
              Temukan peluang investasi terbaik berdasarkan data pasar real-time.
            </p>
          </div>
          <Link
            href="/peta"
            className="flex items-center gap-2 text-sm font-sans font-medium text-accent-gold hover:text-accent-gold-hover transition-colors group shrink-0"
          >
            Lihat Peta Lengkap
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <MarketPriceHeatmap
            height="460px"
            showLegend={true}
            showControls={true}
          />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {[
            { label: 'Kota Terdata', value: '6+' },
            { label: 'Area Dipantau', value: '20+' },
            { label: 'Update Data', value: 'Real-time' },
            { label: 'Tipe Properti', value: '7 Tipe' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-bg-secondary border border-border rounded-sm px-4 py-3 text-center"
            >
              <p className="text-lg font-serif font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs font-sans text-text-tertiary mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
