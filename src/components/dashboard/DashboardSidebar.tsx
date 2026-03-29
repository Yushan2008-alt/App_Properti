'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Home, Users, MessageSquare, User, LogOut, Menu, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/dashboard/listing', icon: Home, label: 'Listing Saya' },
  { href: '/dashboard/leads', icon: MessageSquare, label: 'Lead Inbox' },
  { href: '/dashboard/profil', icon: User, label: 'Profil & Verifikasi' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      {/* Logo */}
      <div className="px-6 mb-8">
        <Link href="/" className="text-xl font-serif font-bold text-text-primary">
          Prop<span className="text-accent-gold">Vista</span>
        </Link>
        <div className="text-xs font-sans text-text-tertiary mt-0.5">Dashboard Agen</div>
      </div>

      {/* New listing button */}
      <div className="px-4 mb-6">
        <Link href="/dashboard/listing/baru" className="btn-primary w-full justify-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Listing
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans font-medium transition-all duration-200',
              isActive(item)
                ? 'bg-accent-gold text-text-on-gold'
                : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pt-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-sm font-sans font-medium text-text-secondary hover:bg-status-error-bg hover:text-status-error transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-border flex-col shadow-luxury z-30">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-border px-4 h-14 flex items-center justify-between shadow-luxury">
        <Link href="/" className="text-lg font-serif font-bold text-text-primary">
          Prop<span className="text-accent-gold">Vista</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-sm hover:bg-bg-secondary transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
