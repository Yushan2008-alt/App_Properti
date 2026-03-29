'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, LayoutDashboard, Sparkles, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Agen Terverifikasi',
    description: 'Setiap agen telah melalui proses verifikasi KTP dan lisensi resmi. Tidak ada agen abal-abal atau listing palsu.',
    badge: 'Eksklusif',
  },
  {
    icon: LayoutDashboard,
    title: 'Unified Lead Inbox',
    description: 'Dashboard agen pintar yang mengkonsolidasi semua lead dari berbagai channel dalam satu tampilan terintegrasi.',
    badge: 'Inovasi',
  },
  {
    icon: Sparkles,
    title: 'AI Property Match',
    description: 'Sistem rekomendasi cerdas yang menampilkan properti paling relevan berdasarkan preferensi dan kebutuhan Anda.',
    badge: 'Teknologi',
  },
  {
    icon: BarChart3,
    title: 'Market Price Heatmap',
    description: 'Visualisasi peta harga real estate per area secara interaktif. Temukan peluang investasi terbaik dengan data akurat.',
    badge: 'Data',
  },
]

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-bg-secondary">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-accent-gold font-sans text-xs font-medium tracking-[0.2em] uppercase mb-2">
            Mengapa PropVista
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Berbeda dari Platform Lain
          </h2>
          <div className="w-10 h-0.5 bg-accent-gold mx-auto mb-4" />
          <p className="text-text-secondary font-sans text-base leading-relaxed">
            Platform pertama di Indonesia yang menggabungkan verifikasi agen, CRM terintegrasi, dan analitik pasar dalam satu ekosistem.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white rounded-sm p-6 shadow-luxury border border-border hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-sm bg-accent-gold-pale flex items-center justify-center group-hover:bg-accent-gold transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-accent-gold group-hover:text-text-on-gold transition-colors duration-300" />
                </div>
                <span className="text-xs font-sans font-medium text-accent-gold bg-accent-gold-pale px-2 py-0.5 rounded-sm">
                  {feature.badge}
                </span>
              </div>
              <h3 className="font-sans font-semibold text-text-primary mb-2 text-base">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
