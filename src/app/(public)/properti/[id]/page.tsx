import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { BedDouble, Bath, Maximize2, MapPin, Phone, MessageSquare, ShieldCheck, ChevronLeft, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatArea } from '@/lib/utils'
import type { Metadata } from 'next'
import type { PropertyWithImages } from '@/types/supabase'
import ContactForm from '@/components/properti/ContactForm'
import PhotoGallery from '@/components/properti/PhotoGallery'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProperty(id: string): Promise<PropertyWithImages | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(*),
        agents(*, profiles(*))
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error || !data) return null
    return data as unknown as PropertyWithImages
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) return { title: 'Properti tidak ditemukan' }

  return {
    title: property.title,
    description: `${property.status === 'jual' ? 'Dijual' : 'Disewakan'}: ${property.title} di ${property.city}. ${formatPrice(property.price)}.`,
  }
}

const typeLabels: Record<string, string> = {
  rumah: 'Rumah', apartemen: 'Apartemen', ruko: 'Ruko',
  tanah: 'Tanah', villa: 'Villa', gudang: 'Gudang', kantor: 'Kantor',
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) notFound()

  const agent = property.agents
  const agentName = agent?.profiles?.full_name ?? 'PropVista Agent'
  const agentPhone = agent?.profiles?.phone ?? ''
  const isVerified = agent?.is_verified
  const sortedImages = [...(property.property_images ?? [])].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.sort_order - b.sort_order
  })

  return (
    <div className="pt-20 min-h-screen bg-bg-primary">
      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b border-border py-3">
        <div className="container-luxury">
          <div className="flex items-center gap-2 text-sm font-sans text-text-secondary">
            <Link href="/" className="hover:text-accent-gold transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/properti" className="hover:text-accent-gold transition-colors">Properti</Link>
            <span>/</span>
            <span className="text-text-primary line-clamp-1">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="container-luxury py-8">
        {/* Back */}
        <Link href="/properti" className="inline-flex items-center gap-1 text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Pencarian
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <PhotoGallery images={sortedImages} title={property.title} />

            {/* Title & badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 text-xs font-sans font-medium rounded-sm ${
                  property.status === 'jual' ? 'bg-bg-dark text-text-on-dark' : 'bg-accent-gold text-text-on-gold'
                }`}>
                  {property.status === 'jual' ? 'Dijual' : 'Disewakan'}
                </span>
                <span className="px-3 py-1 text-xs font-sans font-medium rounded-sm bg-bg-secondary text-text-secondary border border-border capitalize">
                  {typeLabels[property.type] ?? property.type}
                </span>
              </div>

              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                {property.title}
              </h1>

              <div className="flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm font-sans text-text-secondary">
                  {[property.address, property.district, property.city].filter(Boolean).join(', ')}
                </span>
              </div>

              <p className="font-serif text-3xl lg:text-4xl font-bold text-text-primary">
                {formatPrice(property.price)}
                {property.status === 'sewa' && (
                  <span className="text-text-tertiary text-lg font-sans font-normal">/bulan</span>
                )}
              </p>
            </div>

            {/* Specs */}
            {property.type !== 'tanah' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {property.bedrooms != null && (
                  <div className="bg-white rounded-sm border border-border p-4 text-center shadow-luxury">
                    <BedDouble className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                    <div className="font-sans font-semibold text-text-primary">{property.bedrooms}</div>
                    <div className="text-xs text-text-secondary font-sans">Kamar Tidur</div>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="bg-white rounded-sm border border-border p-4 text-center shadow-luxury">
                    <Bath className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                    <div className="font-sans font-semibold text-text-primary">{property.bathrooms}</div>
                    <div className="text-xs text-text-secondary font-sans">Kamar Mandi</div>
                  </div>
                )}
                {property.building_area && (
                  <div className="bg-white rounded-sm border border-border p-4 text-center shadow-luxury">
                    <Maximize2 className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                    <div className="font-sans font-semibold text-text-primary">{formatArea(property.building_area)}</div>
                    <div className="text-xs text-text-secondary font-sans">Luas Bangunan</div>
                  </div>
                )}
                {property.land_area && (
                  <div className="bg-white rounded-sm border border-border p-4 text-center shadow-luxury">
                    <Maximize2 className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                    <div className="font-sans font-semibold text-text-primary">{formatArea(property.land_area)}</div>
                    <div className="text-xs text-text-secondary font-sans">Luas Tanah</div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-sm border border-border p-6 shadow-luxury">
                <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">Deskripsi</h2>
                <p className="font-sans text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-sm border border-border p-6 shadow-luxury">
                <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">Fasilitas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 text-sm font-sans text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — agent + contact */}
          <div className="space-y-4">
            {/* Agent card */}
            <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                  {agent?.profiles?.avatar_url ? (
                    <Image src={agent.profiles.avatar_url} alt={agentName} width={56} height={56} className="object-cover" />
                  ) : (
                    <span className="text-xl font-serif font-bold text-text-secondary">
                      {agentName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-sans font-semibold text-text-primary">{agentName}</h3>
                    {isVerified && <ShieldCheck className="w-4 h-4 text-status-success" />}
                  </div>
                  {isVerified && (
                    <span className="text-xs font-sans text-status-success">Agen Terverifikasi</span>
                  )}
                  {agent?.coverage_areas && agent.coverage_areas.length > 0 && (
                    <p className="text-xs font-sans text-text-tertiary mt-0.5">
                      {agent.coverage_areas.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {agentPhone && (
                  <a
                    href={`https://wa.me/62${agentPhone.replace(/^0/, '').replace(/\D/g, '')}?text=Halo, saya tertarik dengan properti: ${property.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Agen
                  </a>
                )}
                {agentPhone && (
                  <a href={`tel:${agentPhone}`} className="btn-secondary w-full justify-center">
                    <Phone className="w-4 h-4" />
                    Telepon
                  </a>
                )}
              </div>

              {agent?.slug && (
                <Link href={`/agen/${agent.slug}`} className="text-xs font-sans text-text-tertiary hover:text-accent-gold transition-colors text-center block">
                  Lihat semua listing agen →
                </Link>
              )}
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
              <h3 className="font-serif text-lg font-semibold text-text-primary mb-4">Kirim Pesan</h3>
              <ContactForm propertyId={property.id} agentId={agent?.id ?? ''} />
            </div>

            {/* Listed date */}
            <div className="flex items-center gap-2 text-xs font-sans text-text-tertiary px-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Dipasang {new Date(property.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
