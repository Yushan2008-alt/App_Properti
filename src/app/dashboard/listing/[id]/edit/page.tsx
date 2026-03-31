import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ListingForm from '@/components/dashboard/ListingForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Listing' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get agent for current user
  const { data: agentRaw } = await supabase
    .from('agents')
    .select('id')
    .eq('user_id', user.id)
    .single()
  const agent = agentRaw as { id: string } | null

  if (!agent) redirect('/dashboard/profil')

  // Get property - must belong to this agent
  const { data: property } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('id', id)
    .eq('agent_id', agent.id)
    .single()

  if (!property) notFound()

  return (
    <div className="pt-14 lg:pt-0">
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary">Edit Listing</h1>
        <p className="text-sm text-text-secondary font-sans mt-1 line-clamp-1">{property.title}</p>
      </div>

      <ListingForm agentId={agent.id} initialData={property} propertyId={id} />
    </div>
  )
}
