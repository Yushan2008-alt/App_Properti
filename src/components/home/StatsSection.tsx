'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 2500, suffix: '+', label: 'Properti Aktif', description: 'Listing terkurasi dan terverifikasi' },
  { value: 180, suffix: '+', label: 'Agen Terverifikasi', description: 'Profesional berlisensi resmi' },
  { value: 45, suffix: '+', label: 'Kota di Indonesia', description: 'Jangkauan nasional' },
  { value: 98, suffix: '%', label: 'Kepuasan Klien', description: 'Rating rata-rata 4.9/5' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = 16
    const increment = value / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, step)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{display.toLocaleString('id-ID')}{suffix}</span>
}

export default function StatsSection() {
  return (
    <section className="bg-bg-dark py-20">
      <div className="container-luxury">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-serif text-4xl lg:text-5xl font-bold text-accent-gold mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white font-sans font-medium text-sm mb-1">{stat.label}</div>
              <div className="text-stone-500 font-sans text-xs">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
