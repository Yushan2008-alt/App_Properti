'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ContactFormProps {
  propertyId: string
  agentId: string
}

export default function ContactForm({ propertyId, agentId }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setError('Nama dan nomor HP wajib diisi')
      return
    }
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('leads').insert({
        property_id: propertyId,
        agent_id: agentId,
        buyer_name: form.name,
        buyer_phone: form.phone,
        buyer_email: form.email || null,
        message: form.message || null,
        channel: 'form',
        status: 'new',
      })

      if (err) throw err
      setSuccess(true)
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch {
      setError('Gagal mengirim pesan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <CheckCircle className="w-10 h-10 text-status-success mx-auto mb-3" />
        <h4 className="font-sans font-semibold text-text-primary mb-1">Pesan Terkirim!</h4>
        <p className="text-sm font-sans text-text-secondary">
          Agen akan menghubungi Anda segera.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs font-sans text-text-tertiary hover:text-accent-gold transition-colors"
        >
          Kirim pesan lain
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Nama lengkap *"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        className="input-luxury"
        required
      />
      <input
        type="tel"
        placeholder="Nomor HP / WA *"
        value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        className="input-luxury"
        required
      />
      <input
        type="email"
        placeholder="Email (opsional)"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        className="input-luxury"
      />
      <textarea
        placeholder="Pesan untuk agen..."
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        rows={3}
        className="input-luxury resize-none"
      />

      {error && (
        <p className="text-xs font-sans text-status-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center"
      >
        {loading ? 'Mengirim...' : 'Kirim Pesan'}
      </button>

      <p className="text-[11px] font-sans text-text-tertiary text-center">
        Dengan mengirim pesan, Anda menyetujui syarat & ketentuan PropVista.
      </p>
    </form>
  )
}
