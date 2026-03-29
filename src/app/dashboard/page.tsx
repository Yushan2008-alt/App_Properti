import { createClient } from '@/lib/supabase/server'
import { Home, MessageSquare, Eye, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('*, agents(*)')
    .eq('id', user!.id)
    .single()
  const profile = profileRaw as unknown as { full_name: string | null; agents: { id: string } | null } | null

  const agentId = profile?.agents?.id

  let stats = { listings: 0, leads: 0, newLeads: 0 }

  if (agentId) {
    const [listingsRes, leadsRes, newLeadsRes] = await Promise.all([
      supabase.from('properties').select('id', { count: 'exact' }).eq('agent_id', agentId).eq('is_published', true),
      supabase.from('leads').select('id', { count: 'exact' }).eq('agent_id', agentId),
      supabase.from('leads').select('id', { count: 'exact' }).eq('agent_id', agentId).eq('status', 'new'),
    ])
    stats = {
      listings: listingsRes.count ?? 0,
      leads: leadsRes.count ?? 0,
      newLeads: newLeadsRes.count ?? 0,
    }
  }

  const name = profile?.full_name?.split(' ')[0] ?? 'Agen'

  return (
    <div className="pt-14 lg:pt-0">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary">
          Selamat datang, {name}
        </h1>
        <p className="text-text-secondary font-sans text-sm mt-1">
          Ini ringkasan aktivitas listing dan lead Anda
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Home, label: 'Listing Aktif', value: stats.listings, href: '/dashboard/listing', color: 'bg-accent-gold-pale text-accent-gold' },
          { icon: MessageSquare, label: 'Total Lead', value: stats.leads, href: '/dashboard/leads', color: 'bg-status-info-bg text-status-info' },
          { icon: TrendingUp, label: 'Lead Baru', value: stats.newLeads, href: '/dashboard/leads?status=new', color: 'bg-status-success-bg text-status-success' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-sm border border-border shadow-luxury p-5 hover:shadow-luxury-hover hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
              <div className="text-sm font-sans text-text-secondary">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-text-primary">Aksi Cepat</h2>
          </div>
          <div className="space-y-2">
            {[
              { href: '/dashboard/listing/baru', label: 'Tambah Listing Baru', icon: Home },
              { href: '/dashboard/leads', label: 'Lihat Lead Masuk', icon: MessageSquare },
              { href: '/dashboard/profil', label: 'Lengkapi Profil & Verifikasi', icon: Eye },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-sm hover:bg-bg-secondary transition-colors group"
              >
                <div className="w-8 h-8 bg-accent-gold-pale rounded-sm flex items-center justify-center group-hover:bg-accent-gold transition-colors duration-200">
                  <item.icon className="w-4 h-4 text-accent-gold group-hover:text-text-on-gold transition-colors duration-200" />
                </div>
                <span className="text-sm font-sans text-text-secondary group-hover:text-text-primary transition-colors">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-sm border border-border shadow-luxury p-6">
          <h2 className="font-sans font-semibold text-text-primary mb-4">Tips untuk Agen</h2>
          <ul className="space-y-3">
            {[
              'Lengkapi profil dan upload dokumen untuk mendapat badge Agen Terverifikasi',
              'Tambahkan foto berkualitas tinggi pada listing untuk meningkatkan minat buyer',
              'Respon lead dalam 1 jam pertama untuk meningkatkan closing rate 3x lipat',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 bg-accent-gold rounded-full text-text-on-gold text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-sm font-sans text-text-secondary">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
