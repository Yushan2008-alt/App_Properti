import { createClient } from '@/lib/supabase/server'
import { DEMO_AGENTS, type AgentWithDetails } from '@/lib/mock-data'
import AgentList from '@/components/agen/AgentList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Direktori Agen',
  description: 'Temukan agen properti terpercaya dan terverifikasi di seluruh Indonesia.',
}

export default async function AgenPage() {
  let agents = DEMO_AGENTS
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('agents')
      .select('*, profiles(*), properties(id)')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
    if (data && data.length > 0) {
      agents = data as unknown as AgentWithDetails[]
    }
  } catch {
    // use demo data
  }

  return (
    <div className="pt-20 min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border py-12">
        <div className="container-luxury text-center">
          <p className="text-accent-gold font-sans text-xs font-medium tracking-[0.2em] uppercase mb-2">
            Agen Terpercaya
          </p>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary mb-3">
            Direktori Agen PropVista
          </h1>
          <div className="w-10 h-0.5 bg-accent-gold mx-auto mb-4" />
          <p className="text-text-secondary font-sans text-base max-w-xl mx-auto">
            Semua agen telah melalui proses verifikasi KTP dan lisensi resmi. Temukan agen yang tepat untuk kebutuhan properti Anda.
          </p>
        </div>
      </div>

      <div className="container-luxury py-10">
        <AgentList agents={agents ?? []} />
      </div>
    </div>
  )
}
