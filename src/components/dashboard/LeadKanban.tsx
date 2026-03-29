'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Calendar, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const COLUMNS = [
  { id: 'new', label: 'Baru', color: 'bg-status-info-bg border-status-info/30 text-status-info' },
  { id: 'contacted', label: 'Dihubungi', color: 'bg-accent-gold-pale border-accent-gold/30 text-accent-gold' },
  { id: 'survey', label: 'Survei', color: 'bg-blue-50 border-blue-200 text-blue-600' },
  { id: 'negotiation', label: 'Negosiasi', color: 'bg-purple-50 border-purple-200 text-purple-600' },
  { id: 'closed', label: 'Closed', color: 'bg-status-success-bg border-status-success/30 text-status-success' },
  { id: 'cancelled', label: 'Batal', color: 'bg-status-error-bg border-status-error/30 text-status-error' },
]

interface Lead {
  id: string
  buyer_name: string
  buyer_phone: string | null
  buyer_email: string | null
  message: string | null
  status: string
  channel: string
  created_at: string
  properties?: { title: string; city: string } | null
}

interface Props {
  initialLeads: Lead[]
  agentId: string
}

export default function LeadKanban({ initialLeads, agentId }: Props) {
  const [leads, setLeads] = useState(initialLeads)
  const [view, setView] = useState<'kanban' | 'list'>('list')

  async function updateStatus(leadId: string, newStatus: string) {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('leads').update({ status: newStatus }).eq('id', leadId)
  }

  if (view === 'list') {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          {(['list', 'kanban'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 text-sm font-sans rounded-sm border transition-all duration-200 ${
                view === v ? 'bg-accent-gold text-text-on-gold border-accent-gold' : 'bg-white text-text-secondary border-border hover:border-accent-gold'
              }`}
            >
              {v === 'list' ? 'Tabel' : 'Kanban'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-sm border border-border shadow-luxury overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Nama</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Kontak</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Properti</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => {
                  const col = COLUMNS.find(c => c.id === lead.status)
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-border last:border-0 hover:bg-bg-primary transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-text-primary">{lead.buyer_name}</div>
                        {lead.message && <div className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{lead.message}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {lead.buyer_phone && (
                            <a href={`tel:${lead.buyer_phone}`} className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent-gold transition-colors">
                              <Phone className="w-3 h-3" />{lead.buyer_phone}
                            </a>
                          )}
                          {lead.buyer_email && (
                            <a href={`mailto:${lead.buyer_email}`} className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent-gold transition-colors">
                              <Mail className="w-3 h-3" />{lead.buyer_email}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-text-secondary line-clamp-2">{lead.properties?.title ?? '—'}</div>
                        {lead.properties?.city && <div className="text-xs text-text-tertiary">{lead.properties.city}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-sm text-xs font-medium border ${col?.color}`}>
                          {col?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-tertiary whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={e => updateStatus(lead.id, e.target.value)}
                          className="text-xs font-sans border border-border rounded-sm px-2 py-1 bg-white focus:outline-none focus:border-accent-gold transition-all"
                        >
                          {COLUMNS.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Kanban view
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {(['list', 'kanban'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-sans rounded-sm border transition-all duration-200 ${
              view === v ? 'bg-accent-gold text-text-on-gold border-accent-gold' : 'bg-white text-text-secondary border-border hover:border-accent-gold'
            }`}
          >
            {v === 'list' ? 'Tabel' : 'Kanban'}
          </button>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => l.status === col.id)
          return (
            <div key={col.id} className="flex-shrink-0 w-64">
              <div className={`px-3 py-2 rounded-sm border mb-3 ${col.color}`}>
                <span className="text-xs font-sans font-semibold">{col.label}</span>
                <span className="ml-2 text-xs opacity-70">({colLeads.length})</span>
              </div>
              <div className="space-y-2">
                {colLeads.map(lead => (
                  <motion.div
                    key={lead.id}
                    layout
                    className="bg-white rounded-sm border border-border shadow-luxury p-3 hover:shadow-luxury-hover transition-all duration-200"
                  >
                    <div className="font-sans font-medium text-text-primary text-sm mb-1">{lead.buyer_name}</div>
                    {lead.properties?.title && (
                      <div className="text-xs text-text-tertiary mb-2 line-clamp-1">{lead.properties.title}</div>
                    )}
                    {lead.buyer_phone && (
                      <a href={`https://wa.me/62${lead.buyer_phone.replace(/^0/, '').replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent-gold transition-colors mb-2"
                      >
                        <MessageSquare className="w-3 h-3" />WhatsApp
                      </a>
                    )}
                    <div className="text-xs text-text-tertiary mb-2">
                      {new Date(lead.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      className="w-full text-xs font-sans border border-border rounded-sm px-2 py-1 bg-white focus:outline-none focus:border-accent-gold"
                    >
                      {COLUMNS.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
