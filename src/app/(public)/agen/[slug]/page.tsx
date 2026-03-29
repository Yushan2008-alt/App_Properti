import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/ui/PropertyCard'
import type { PropertyWithImages } from '@/types/supabase'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface AgentWithProfile {
  id: string
  slug: string
  bio: string | null
  coverage_areas: string[] | null
  is_verified: boolean
  profiles: { full_name: string | null; avatar_url: string | null; phone: string | null } | null
}

async function getAgent(slug: string): Promise<AgentWithProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('agents')
    .select('id, slug, bio, coverage_areas, is_verified, profiles(full_name, avatar_url, phone)')
    .eq('slug', slug)
    .single()
  return data as unknown as AgentWithProfile | null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const agent = await getAgent(slug)
  if (!agent) return { title: 'Agen tidak ditemukan' }
  return { title: `${agent.profiles?.full_name ?? 'Agen'} — PropVista` }
}

export default async function AgentProfilePage({ params }: PageProps) {
  const { slug } = await params
  const agent = await getAgent(slug)

  if (!agent) notFound()

  const supabase = await createClient()
  const { data: propertiesData } = await supabase
    .from('properties')
    .select('*, property_images(*), agents(*, profiles(*))')
    .eq('agent_id', agent.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const properties = (propertiesData ?? []) as unknown as PropertyWithImages[]
  const name = agent.profiles?.full_name ?? 'PropVista Agent'

  return (
    <div className="pt-20 min-h-screen bg-bg-primary">
      {/* Hero */}
      <div className="bg-bg-secondary border-b border-border py-12">
        <div className="container-luxury">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative w-24 h-24 rounded-full bg-bg-tertiary overflow-hidden flex-shrink-0 ring-4 ring-white shadow-luxury">
              {agent.profiles?.avatar_url ? (
                <Image src={agent.profiles.avatar_url} alt={name} fill className="object-cover" sizes="96px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-4xl font-bold text-text-secondary">{name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary">{name}</h1>
                {agent.is_verified && <ShieldCheck className="w-6 h-6 text-status-success" />}
              </div>
              {agent.is_verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-status-success-bg text-status-success text-sm font-sans font-medium rounded-sm mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Agen Terverifikasi PropVista
                </span>
              )}
              {agent.bio && <p className="text-text-secondary font-sans text-sm max-w-xl mt-2">{agent.bio}</p>}
              {agent.coverage_areas && agent.coverage_areas.length > 0 && (
                <div className="flex items-center gap-1 mt-2 text-sm font-sans text-text-secondary">
                  <MapPin className="w-4 h-4 text-text-tertiary" />
                  <span>Area: {agent.coverage_areas.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-luxury py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold text-text-primary">
            Listing ({properties.length})
          </h2>
        </div>

        {properties.length === 0 ? (
          <p className="text-center text-text-secondary font-sans py-12">Belum ada listing aktif</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
