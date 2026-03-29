'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Building2, Store, LandPlot, TreePine, Warehouse, Building } from 'lucide-react'

const types = [
  { icon: Home, label: 'Rumah', value: 'rumah', count: '1.200+' },
  { icon: Building2, label: 'Apartemen', value: 'apartemen', count: '450+' },
  { icon: Store, label: 'Ruko', value: 'ruko', count: '320+' },
  { icon: LandPlot, label: 'Tanah', value: 'tanah', count: '280+' },
  { icon: TreePine, label: 'Villa', value: 'villa', count: '180+' },
  { icon: Warehouse, label: 'Gudang', value: 'gudang', count: '95+' },
  { icon: Building, label: 'Kantor', value: 'kantor', count: '75+' },
]

export default function PropertyTypeSection() {
  return (
    <section className="py-20 bg-bg-primary">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent-gold font-sans text-xs font-medium tracking-[0.2em] uppercase mb-2">
            Temukan
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary">
            Jelajahi Berdasarkan Tipe
          </h2>
          <div className="w-10 h-0.5 bg-accent-gold mx-auto mt-3" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {types.map((type, i) => (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/properti?type=${type.value}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-sm border border-border shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-sm bg-bg-secondary flex items-center justify-center group-hover:bg-accent-gold transition-colors duration-300">
                  <type.icon className="w-6 h-6 text-accent-gold group-hover:text-text-on-gold transition-colors duration-300" />
                </div>
                <div className="text-center">
                  <div className="font-sans text-sm font-medium text-text-primary group-hover:text-accent-gold transition-colors duration-200">
                    {type.label}
                  </div>
                  <div className="font-sans text-xs text-text-tertiary mt-0.5">{type.count}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
