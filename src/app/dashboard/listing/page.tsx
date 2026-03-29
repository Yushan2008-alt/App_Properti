import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Listing Saya' }

export default async function ListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agentRaw } = await supabase
    .from('agents')
    .select('id')
    .eq('user_id', user!.id)
    .single()
  const agent = agentRaw as { id: string } | null

  let listings: any[] = []

  if (agent) {
    const { data } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false })
    listings = data ?? []
  }

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary">Listing Saya</h1>
          <p className="text-sm text-text-secondary font-sans mt-1">{listings.length} properti total</p>
        </div>
        <Link href="/dashboard/listing/baru" className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Tambah Listing
        </Link>
      </div>

      {!agent ? (
        <div className="bg-status-warning-bg border border-status-warning/30 rounded-sm p-6 text-center">
          <p className="text-sm font-sans text-status-warning mb-3">
            Profil agen Anda belum dibuat. Lengkapi profil terlebih dahulu.
          </p>
          <Link href="/dashboard/profil" className="btn-primary">Lengkapi Profil</Link>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-sm border border-border shadow-luxury">
          <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-text-tertiary" />
          </div>
          <h3 className="font-sans font-semibold text-text-primary mb-2">Belum ada listing</h3>
          <p className="text-sm text-text-secondary font-sans mb-6">Mulai tambahkan properti pertama Anda</p>
          <Link href="/dashboard/listing/baru" className="btn-primary">Tambah Listing Pertama</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => {
            const primaryImage = listing.property_images?.find((i: any) => i.is_primary) ?? listing.property_images?.[0]
            return (
              <div key={listing.id} className="bg-white rounded-sm border border-border shadow-luxury p-4 flex gap-4 hover:shadow-luxury-hover transition-all duration-200">
                {/* Thumbnail */}
                <div className="relative w-24 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-bg-secondary">
                  {primaryImage ? (
                    <Image src={primaryImage.url} alt={listing.title} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-tertiary text-xs font-sans">No foto</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-sans font-medium text-text-primary text-sm line-clamp-1">{listing.title}</h3>
                      <p className="text-xs text-text-secondary font-sans mt-0.5">{listing.city} · {listing.type} · {listing.status === 'jual' ? 'Dijual' : 'Disewakan'}</p>
                      <p className="font-serif text-base font-semibold text-text-primary mt-1">{formatPrice(listing.price)}</p>
                    </div>
                    <span className={`text-xs font-sans px-2 py-1 rounded-sm flex-shrink-0 ${
                      listing.is_published ? 'bg-status-success-bg text-status-success' : 'bg-bg-secondary text-text-secondary'
                    }`}>
                      {listing.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link href={`/properti/${listing.id}`} className="p-2 rounded-sm hover:bg-bg-secondary transition-colors text-text-tertiary hover:text-text-primary">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link href={`/dashboard/listing/${listing.id}/edit`} className="p-2 rounded-sm hover:bg-bg-secondary transition-colors text-text-tertiary hover:text-accent-gold">
                    <Pencil className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
