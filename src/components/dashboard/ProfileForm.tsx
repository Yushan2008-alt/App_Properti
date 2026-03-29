'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Agent } from '@/types/supabase'

interface Props {
  profile: Profile | null
  agent: Agent | null
  userId: string
}

export default function ProfileForm({ profile, agent, userId }: Props) {
  const [form, setForm] = useState({
    fullName: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    bio: agent?.bio ?? '',
    slug: agent?.slug ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: userId, full_name: form.fullName, phone: form.phone })

    if (profileError) {
      setError('Gagal menyimpan profil')
      setSaving(false)
      return
    }

    // Upsert agent
    if (form.slug) {
      const { error: agentError } = await supabase
        .from('agents')
        .upsert({
          user_id: userId,
          bio: form.bio,
          slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
          is_verified: agent?.is_verified ?? false,
        }, { onConflict: 'user_id' })

      if (agentError) {
        setError('Gagal menyimpan profil agen')
        setSaving(false)
        return
      }
    }

    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Profile info */}
      <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
        <h2 className="font-sans font-semibold text-text-primary mb-6">Informasi Profil</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              className="input-luxury"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Nomor HP / WA</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="input-luxury"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Slug URL Profil</label>
            <div className="flex items-center border border-border rounded-sm overflow-hidden focus-within:border-accent-gold focus-within:ring-1 focus-within:ring-accent-gold/30 transition-all">
              <span className="px-3 py-3 bg-bg-secondary text-text-tertiary text-sm font-sans border-r border-border whitespace-nowrap">/agen/</span>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="nama-agen-anda"
                className="flex-1 px-3 py-3 text-sm font-sans text-text-primary outline-none bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Bio Singkat</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Ceritakan pengalaman dan keahlian Anda..."
              className="input-luxury resize-none"
            />
          </div>

          {error && <p className="text-xs text-status-error">{error}</p>}

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-sans text-status-success"
            >
              <CheckCircle className="w-4 h-4" />
              Profil berhasil disimpan
            </motion.div>
          )}
        </form>
      </div>

      {/* Verification */}
      <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
        <h2 className="font-sans font-semibold text-text-primary mb-2">Verifikasi Agen</h2>
        <p className="text-xs font-sans text-text-secondary mb-6 leading-relaxed">
          Upload KTP dan Surat Izin Agen (SIU/SIK) untuk mendapatkan badge Agen Terverifikasi. Review admin memakan waktu 1–2 hari kerja.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">
              KTP (Scan / Foto)
              {agent?.ktp_url && <span className="ml-2 text-status-success">✓ Sudah diupload</span>}
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-text-secondary font-sans border border-border rounded-sm px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-accent-gold-pale file:text-accent-gold hover:file:bg-accent-gold hover:file:text-text-on-gold file:transition-all file:cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">
              Surat Izin Agen (SIU/SIK)
              {agent?.license_url && <span className="ml-2 text-status-success">✓ Sudah diupload</span>}
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-text-secondary font-sans border border-border rounded-sm px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-accent-gold-pale file:text-accent-gold hover:file:bg-accent-gold hover:file:text-text-on-gold file:transition-all file:cursor-pointer"
            />
          </div>

          <div className="p-3 bg-bg-secondary rounded-sm border border-border">
            <p className="text-xs font-sans text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Format yang diterima:</strong> JPG, PNG, PDF (maks. 5MB).<br />
              Dokumen harus terbaca jelas. Identitas harus sesuai dengan nama yang didaftarkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
