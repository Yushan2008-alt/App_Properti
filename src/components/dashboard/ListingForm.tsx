'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/utils'

const AMENITIES_OPTIONS = [
  'Carport', 'Garasi', 'Kolam Renang', 'Taman', 'Keamanan 24 Jam',
  'CCTV', 'AC', 'Furnished', 'Semi Furnished', 'Water Heater',
  'Listrik PLN', 'Air PDAM', 'Internet/WiFi', 'Akses Jalan Lebar',
  'Dekat Sekolah', 'Dekat Mall', 'Dekat Tol', 'Dekat Stasiun',
]

interface Props {
  agentId: string
  initialData?: any
}

export default function ListingForm({ agentId, initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    type: initialData?.type ?? 'rumah',
    status: initialData?.status ?? 'jual',
    price: initialData?.price ?? '',
    land_area: initialData?.land_area ?? '',
    building_area: initialData?.building_area ?? '',
    bedrooms: initialData?.bedrooms ?? '',
    bathrooms: initialData?.bathrooms ?? '',
    city: initialData?.city ?? '',
    district: initialData?.district ?? '',
    address: initialData?.address ?? '',
    is_published: initialData?.is_published ?? false,
    amenities: initialData?.amenities ?? [] as string[],
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{ url: string; is_primary: boolean }[]>([])
  const [error, setError] = useState('')

  function toggleAmenity(a: string) {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x: string) => x !== a) : [...f.amenities, a],
    }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    const supabase = createClient()

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `properties/${agentId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('property-images').upload(path, file)
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(path)
        setUploadedImages(prev => [...prev, { url: urlData.publicUrl, is_primary: prev.length === 0 }])
      }
    }
    setUploading(false)
  }

  function removeImage(url: string) {
    setUploadedImages(prev => {
      const filtered = prev.filter(i => i.url !== url)
      if (filtered.length > 0 && !filtered.some(i => i.is_primary)) {
        filtered[0].is_primary = true
      }
      return filtered
    })
  }

  function setPrimary(url: string) {
    setUploadedImages(prev => prev.map(i => ({ ...i, is_primary: i.url === url })))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.price || !form.city) {
      setError('Judul, harga, dan kota wajib diisi')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()

    const { data: property, error: propError } = await supabase
      .from('properties')
      .insert({
        agent_id: agentId,
        title: form.title,
        description: form.description || null,
        type: form.type as any,
        status: form.status as any,
        price: Number(form.price),
        land_area: form.land_area ? Number(form.land_area) : null,
        building_area: form.building_area ? Number(form.building_area) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        city: form.city,
        district: form.district || null,
        address: form.address || null,
        amenities: form.amenities.length > 0 ? form.amenities : null,
        is_published: form.is_published,
      })
      .select()
      .single()

    if (propError || !property) {
      setError('Gagal menyimpan listing')
      setSaving(false)
      return
    }

    // Upload images
    if (uploadedImages.length > 0) {
      await supabase.from('property_images').insert(
        uploadedImages.map((img, i) => ({
          property_id: property.id,
          url: img.url,
          is_primary: img.is_primary,
          sort_order: i,
        }))
      )
    }

    router.push('/dashboard/listing')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
        <h2 className="font-sans font-semibold text-text-primary mb-5">Informasi Dasar</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Judul Listing *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Contoh: Rumah Minimalis Modern 3KT di Kemang, Jakarta Selatan"
              className="input-luxury"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Tipe Properti *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-luxury">
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Status *</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-luxury">
                {PROPERTY_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">
              Harga (Rp) * {form.status === 'sewa' && <span className="text-text-tertiary">/bulan</span>}
            </label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="Contoh: 2500000000"
              className="input-luxury"
              min={0}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={5}
              placeholder="Deskripsikan properti secara detail..."
              className="input-luxury resize-none"
            />
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
        <h2 className="font-sans font-semibold text-text-primary mb-5">Spesifikasi</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'land_area', label: 'Luas Tanah (m²)', show: true },
            { key: 'building_area', label: 'Luas Bangunan (m²)', show: form.type !== 'tanah' },
            { key: 'bedrooms', label: 'Kamar Tidur', show: !['tanah', 'gudang'].includes(form.type) },
            { key: 'bathrooms', label: 'Kamar Mandi', show: !['tanah', 'gudang'].includes(form.type) },
          ].filter(f => f.show).map(field => (
            <div key={field.key}>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">{field.label}</label>
              <input
                type="number"
                value={(form as any)[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                min={0}
                className="input-luxury"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
        <h2 className="font-sans font-semibold text-text-primary mb-5">Lokasi</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Kota *</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="Jakarta Selatan"
                className="input-luxury"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Kecamatan / Area</label>
              <input
                type="text"
                value={form.district}
                onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                placeholder="Kemang"
                className="input-luxury"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-text-primary mb-1.5">Alamat Lengkap</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Jl. Kemang Raya No. XX"
              className="input-luxury"
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
        <h2 className="font-sans font-semibold text-text-primary mb-5">Fasilitas</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_OPTIONS.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`px-3 py-1.5 text-xs font-sans rounded-sm border transition-all duration-200 ${
                form.amenities.includes(a)
                  ? 'bg-accent-gold text-text-on-gold border-accent-gold'
                  : 'bg-white text-text-secondary border-border hover:border-accent-gold hover:text-accent-gold'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
        <h2 className="font-sans font-semibold text-text-primary mb-5">Foto Properti</h2>

        {/* Upload zone */}
        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-sm cursor-pointer hover:border-accent-gold hover:bg-accent-gold-pale transition-all duration-200 mb-4">
          <Upload className="w-8 h-8 text-text-tertiary mb-2" />
          <span className="text-sm font-sans text-text-secondary">
            {uploading ? 'Mengupload...' : 'Klik atau drag foto ke sini'}
          </span>
          <span className="text-xs font-sans text-text-tertiary mt-1">JPG, PNG (maks. 5MB per foto)</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Preview */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {uploadedImages.map((img, i) => (
              <div key={img.url} className={`relative group aspect-square rounded-sm overflow-hidden border-2 ${img.is_primary ? 'border-accent-gold' : 'border-transparent'}`}>
                <img src={img.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  {!img.is_primary && (
                    <button type="button" onClick={() => setPrimary(img.url)} className="p-1 bg-accent-gold rounded-sm text-text-on-gold text-xs">
                      Utama
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(img.url)} className="p-1 bg-status-error rounded-sm text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {img.is_primary && (
                  <div className="absolute bottom-1 left-1 bg-accent-gold text-text-on-gold text-[10px] px-1 py-0.5 rounded-sm font-sans">
                    Utama
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
              className="w-4 h-4 accent-accent-gold"
            />
            <span className="text-sm font-sans text-text-primary">Langsung publish setelah disimpan</span>
          </label>
        </div>

        {error && <p className="text-xs text-status-error mb-4">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan Listing'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Batal
          </button>
        </div>
      </div>
    </form>
  )
}
