'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, TrendingUp, Users } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-bg-dark overflow-hidden relative">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent-gold font-sans text-xs font-medium tracking-[0.2em] uppercase mb-3">
              Untuk Agen Profesional
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              Pasarkan Properti{' '}
              <span className="italic text-accent-gold">Lebih Efektif</span>
            </h2>
            <p className="text-stone-400 font-sans text-base leading-relaxed mb-8">
              Bergabunglah dengan 180+ agen terverifikasi PropVista. Dapatkan akses ke dashboard CRM canggih, lead management terintegrasi, dan jangkauan buyer yang lebih luas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="btn-primary">
                Daftar Gratis
              </Link>
              <Link href="/agen" className="btn-secondary border-stone-700 text-stone-300 hover:border-accent-gold hover:text-accent-gold hover:bg-accent-gold/5">
                Lihat Agen Lain
              </Link>
            </div>
          </motion.div>

          {/* Right — benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              {
                icon: ShieldCheck,
                title: 'Badge Agen Terverifikasi',
                desc: 'Tingkatkan kepercayaan buyer dengan badge verified resmi PropVista',
              },
              {
                icon: TrendingUp,
                title: 'CRM & Lead Management',
                desc: 'Kelola semua lead dari berbagai channel dalam satu dashboard terintegrasi',
              },
              {
                icon: Users,
                title: 'Jangkauan Lebih Luas',
                desc: 'Tampil di hadapan ribuan buyer aktif setiap bulannya di seluruh Indonesia',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-sm bg-white/5 border border-white/10 hover:border-accent-gold/30 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-sm bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <div className="font-sans font-semibold text-white text-sm mb-1">{item.title}</div>
                  <div className="font-sans text-xs text-stone-400">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
