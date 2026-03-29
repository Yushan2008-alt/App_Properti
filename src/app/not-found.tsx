'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="font-serif text-9xl font-bold text-accent-gold/30 mb-4">404</div>
        <h1 className="font-serif text-3xl font-bold text-text-primary mb-3">Halaman tidak ditemukan</h1>
        <p className="text-text-secondary font-sans text-sm mb-8">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link href="/" className="btn-primary gap-2">
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  )
}
