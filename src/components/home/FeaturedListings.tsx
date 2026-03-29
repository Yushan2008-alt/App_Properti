'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PropertyCard from '@/components/ui/PropertyCard'
import type { PropertyWithImages } from '@/types/supabase'

interface FeaturedListingsProps {
  properties: PropertyWithImages[]
}

export default function FeaturedListings({ properties }: FeaturedListingsProps) {
  if (!properties.length) return null

  return (
    <section className="py-20 bg-bg-primary">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-accent-gold font-sans text-xs font-medium tracking-[0.2em] uppercase mb-2">
              Pilihan Terbaik
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary">
              Properti Unggulan
            </h2>
            <div className="w-10 h-0.5 bg-accent-gold mt-3" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/properti"
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors duration-200 group"
            >
              Lihat semua
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
