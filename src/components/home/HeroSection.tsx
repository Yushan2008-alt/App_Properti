'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/utils'

const CITIES = ['Jakarta', 'Surabaya', 'Bandung', 'Bali', 'Yogyakarta', 'Medan', 'Makassar', 'Semarang']

export default function HeroSection() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<'jual' | 'sewa'>('jual')
  const [type, setType] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('q', keyword)
    if (status) params.set('status', status)
    if (type) params.set('type', type)
    router.push(`/properti?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-luxury text-center pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-accent-gold font-sans text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Platform Properti Premium Indonesia
          </p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-balance">
            Temukan Properti{' '}
            <span className="italic text-accent-gold-light">Impian</span>{' '}
            Anda
          </h1>
          <p className="text-white/70 font-sans text-lg max-w-2xl mx-auto mb-10">
            Ribuan properti premium dari agen terverifikasi. Rumah, apartemen, ruko, tanah, dan villa di seluruh Indonesia.
          </p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white rounded-sm shadow-luxury-lg overflow-hidden max-w-3xl mx-auto"
          >
            {/* Tabs */}
            <div className="flex border-b border-border">
              {(['jual', 'sewa'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-3 text-sm font-sans font-medium transition-all duration-200 ${
                    status === s
                      ? 'bg-accent-gold text-text-on-gold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }`}
                >
                  {s === 'jual' ? 'Beli Properti' : 'Sewa Properti'}
                </button>
              ))}
            </div>

            {/* Search inputs */}
            <form onSubmit={handleSearch} className="p-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 border border-border rounded-sm px-3 py-2.5 focus-within:border-accent-gold focus-within:ring-1 focus-within:ring-accent-gold/30 transition-all duration-200">
                <MapPin className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Kota, area, atau nama properti..."
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  className="flex-1 text-sm font-sans text-text-primary placeholder:text-text-tertiary outline-none bg-transparent"
                />
              </div>

              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="sm:w-40 px-3 py-2.5 text-sm font-sans text-text-secondary border border-border rounded-sm focus:outline-none focus:border-accent-gold transition-all duration-200 bg-white"
              >
                <option value="">Semua Tipe</option>
                {PROPERTY_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent-gold text-text-on-gold text-sm font-sans font-medium rounded-sm hover:bg-accent-gold-hover transition-all duration-200 active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Cari</span>
              </button>
            </form>
          </motion.div>

          {/* Popular cities */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            <span className="text-white/50 text-xs font-sans">Populer:</span>
            {CITIES.slice(0, 6).map(city => (
              <button
                key={city}
                onClick={() => router.push(`/properti?q=${city}`)}
                className="text-xs font-sans text-white/70 hover:text-accent-gold transition-colors duration-200 underline underline-offset-2"
              >
                {city}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-accent-gold rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
