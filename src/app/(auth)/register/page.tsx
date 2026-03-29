'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'buyer' | 'agent'>('agent')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok')
      return
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter')
      return
    }

    setLoading(true)
    setError('')
    const supabase = createClient()

    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
          role,
        },
      },
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-sm shadow-luxury-lg border border-border p-8 text-center"
        >
          <div className="w-16 h-16 bg-status-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-sm font-sans text-text-secondary mb-6">
            Kami telah mengirim email konfirmasi ke <strong>{form.email}</strong>. Silakan verifikasi email Anda untuk melanjutkan.
          </p>
          <Link href="/login" className="btn-dark w-full justify-center">
            Masuk Sekarang
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif font-bold text-text-primary">
            Prop<span className="text-accent-gold">Vista</span>
          </Link>
          <p className="text-text-secondary font-sans text-sm mt-2">Buat akun baru</p>
        </div>

        <div className="bg-white rounded-sm shadow-luxury-lg border border-border p-8">
          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-bg-secondary rounded-sm">
            {(['buyer', 'agent'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 text-sm font-sans font-medium rounded-sm transition-all duration-200 ${
                  role === r
                    ? 'bg-white shadow-luxury text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {r === 'buyer' ? 'Pembeli / Penyewa' : 'Agen / Developer'}
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Nama Anda"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="input-luxury pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-luxury pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Nomor HP / WA</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="input-luxury pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 karakter"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-luxury pl-10 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="password"
                  placeholder="Ulangi password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="input-luxury pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-sans text-status-error bg-status-error-bg px-3 py-2 rounded-sm"
              >
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading} className="btn-dark w-full justify-center mt-2">
              {loading ? 'Mendaftar...' : 'Buat Akun'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-sans text-text-secondary">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-accent-gold hover:text-accent-gold-hover font-medium transition-colors">
              Masuk di sini
            </Link>
          </p>

          <p className="mt-3 text-[11px] font-sans text-text-tertiary text-center">
            Dengan mendaftar, Anda menyetujui{' '}
            <Link href="/syarat" className="underline hover:text-accent-gold">Syarat & Ketentuan</Link>{' '}
            dan{' '}
            <Link href="/privasi" className="underline hover:text-accent-gold">Kebijakan Privasi</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
