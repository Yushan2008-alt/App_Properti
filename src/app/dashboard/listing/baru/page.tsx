import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ListingForm from '@/components/dashboard/ListingForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tambah Listing Baru' }

export default async function BuatListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agentRaw } = await supabase
    .from('agents')
    .select('id')
    .eq('user_id', user!.id)
    .single()
  const agent = agentRaw as { id: string } | null

  if (!agent) {
    redirect('/dashboard/profil')
  }

  return (
    <div className="pt-14 lg:pt-0">
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary">Tambah Listing Baru</h1>
        <p className="text-sm text-text-secondary font-sans mt-1">Isi detail properti yang ingin Anda pasarkan</p>
      </div>

      <ListingForm agentId={agent!.id} />
    </div>
  )
}
