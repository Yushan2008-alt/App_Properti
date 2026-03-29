import { createClient } from '@/lib/supabase/server'
import { MessageSquare, Phone, Mail, Calendar } from 'lucide-react'
import LeadKanban from '@/components/dashboard/LeadKanban'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Lead Inbox' }

const STATUS_LABELS: Record<string, string> = {
  new: 'Baru',
  contacted: 'Dihubungi',
  survey: 'Survei',
  negotiation: 'Negosiasi',
  closed: 'Closed',
  cancelled: 'Batal',
}

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agentRaw } = await supabase
    .from('agents')
    .select('id')
    .eq('user_id', user!.id)
    .single()
  const agent = agentRaw as { id: string } | null

  let leads: any[] = []

  if (agent) {
    const { data } = await supabase
      .from('leads')
      .select('*, properties(title, city)')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false })
    leads = data ?? []
  }

  const grouped = {
    new: leads.filter(l => l.status === 'new'),
    contacted: leads.filter(l => l.status === 'contacted'),
    survey: leads.filter(l => l.status === 'survey'),
    negotiation: leads.filter(l => l.status === 'negotiation'),
    closed: leads.filter(l => l.status === 'closed'),
    cancelled: leads.filter(l => l.status === 'cancelled'),
  }

  return (
    <div className="pt-14 lg:pt-0">
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary">Unified Lead Inbox</h1>
        <p className="text-sm text-text-secondary font-sans mt-1">
          Kelola semua lead dari berbagai channel dalam satu dashboard
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="bg-white rounded-sm border border-border p-3 text-center shadow-luxury">
            <div className="font-serif text-xl font-bold text-text-primary">{grouped[status as keyof typeof grouped].length}</div>
            <div className="text-xs font-sans text-text-secondary mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {!agent ? (
        <p className="text-sm font-sans text-text-secondary">Lengkapi profil agen terlebih dahulu untuk menerima lead.</p>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-sm border border-border shadow-luxury">
          <MessageSquare className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="font-sans font-semibold text-text-primary mb-2">Belum ada lead</h3>
          <p className="text-sm text-text-secondary font-sans">Lead akan muncul saat buyer menghubungi Anda melalui listing</p>
        </div>
      ) : (
        <LeadKanban initialLeads={leads} agentId={agent!.id} />
      )}
    </div>
  )
}
