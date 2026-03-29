'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/utils'

const CITIES = ['Jakarta', 'Surabaya', 'Bandung', 'Bali', 'Yogyakarta', 'Medan', 'Makassar', 'Semarang', 'Bekasi', 'Tangerang', 'Depok', 'Bogor']

const BEDROOMS = [1, 2, 3, 4, 5]

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const [filters, setFilters] = useState({
    status: searchParams.get('status') ?? '',
    type: searchParams.get('type') ?? '',
    city: searchParams.get('city') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    bedrooms: searchParams.get('bedrooms') ?? '',
  })

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) params.set('q', q)
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    router.push(`/properti?${params.toString()}`)
    setShowMobileFilter(false)
  }, [filters, router, searchParams])

  function resetFilters() {
    setFilters({ status: '', type: '', city: '', minPrice: '', maxPrice: '', bedrooms: '' })
    const q = searchParams.get('q')
    router.push(q ? `/properti?q=${q}` : '/properti')
    setShowMobileFilter(false)
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <label className="block text-xs font-sans font-semibold text-text-primary uppercase tracking-widest mb-3">
          Tipe Transaksi
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[{ value: '', label: 'Semua' }, ...PROPERTY_STATUS].map(s => (
            <button
              key={s.value}
              onClick={() => setFilters(f => ({ ...f, status: s.value }))}
              className={`py-2 text-sm font-sans rounded-sm border transition-all duration-200 ${
                filters.status === s.value
                  ? 'bg-accent-gold text-text-on-gold border-accent-gold'
                  : 'bg-white text-text-secondary border-border hover:border-accent-gold hover:text-accent-gold'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-sans font-semibold text-text-primary uppercase tracking-widest mb-3">
          Tipe Properti
        </label>
        <select
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          className="input-luxury"
        >
          <option value="">Semua Tipe</option>
          {PROPERTY_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-sans font-semibold text-text-primary uppercase tracking-widest mb-3">
          Kota / Area
        </label>
        <select
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          className="input-luxury"
        >
          <option value="">Semua Kota</option>
          {CITIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-sans font-semibold text-text-primary uppercase tracking-widest mb-3">
          Range Harga
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Harga minimum (Rp)"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="input-luxury"
          />
          <input
            type="number"
            placeholder="Harga maximum (Rp)"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="input-luxury"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-sans font-semibold text-text-primary uppercase tracking-widest mb-3">
          Kamar Tidur
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters(f => ({ ...f, bedrooms: '' }))}
            className={`w-10 h-10 text-sm font-sans rounded-sm border transition-all duration-200 ${
              filters.bedrooms === ''
                ? 'bg-accent-gold text-text-on-gold border-accent-gold'
                : 'bg-white text-text-secondary border-border hover:border-accent-gold'
            }`}
          >
            All
          </button>
          {BEDROOMS.map(n => (
            <button
              key={n}
              onClick={() => setFilters(f => ({ ...f, bedrooms: String(n) }))}
              className={`w-10 h-10 text-sm font-sans rounded-sm border transition-all duration-200 ${
                filters.bedrooms === String(n)
                  ? 'bg-accent-gold text-text-on-gold border-accent-gold'
                  : 'bg-white text-text-secondary border-border hover:border-accent-gold'
              }`}
            >
              {n}+
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button onClick={applyFilters} className="btn-primary w-full justify-center">
          Terapkan Filter
        </button>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="btn-ghost w-full justify-center text-text-tertiary">
            Reset Filter
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilter(true)}
          className={`flex items-center gap-2 btn-secondary ${hasActiveFilters ? 'border-accent-gold text-accent-gold' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter {hasActiveFilters && <span className="bg-accent-gold text-text-on-gold text-xs w-5 h-5 rounded-full flex items-center justify-center">{Object.values(filters).filter(Boolean).length}</span>}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-sm border border-border shadow-luxury p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sans font-semibold text-text-primary">Filter</h3>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-text-tertiary hover:text-error transition-colors duration-200">
                Reset
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilter(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-sans font-semibold text-text-primary">Filter Properti</h3>
                  <button onClick={() => setShowMobileFilter(false)} className="p-1 hover:bg-bg-secondary rounded-sm">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
