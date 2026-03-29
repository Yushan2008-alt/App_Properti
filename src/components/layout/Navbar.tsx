'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/properti', label: 'Properti' },
  { href: '/agen', label: 'Agen' },
  { href: '/market', label: 'Market Insight' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navBg = isHome
    ? isScrolled ? 'bg-white/95 backdrop-blur-md shadow-luxury' : 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-luxury'

  const textColor = isHome && !isScrolled ? 'text-white' : 'text-text-primary'
  const logoColor = isHome && !isScrolled ? 'text-white' : 'text-text-primary'
  const accentColor = isHome && !isScrolled ? 'text-accent-gold-light' : 'text-accent-gold'

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          navBg
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className={cn('text-xl lg:text-2xl font-serif font-bold tracking-tight', logoColor)}>
                Prop<span className={accentColor}>Vista</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-sm font-sans font-medium transition-colors duration-200',
                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-accent-gold',
                    'after:transition-transform after:duration-200 after:origin-left',
                    pathname === link.href
                      ? cn(accentColor, 'after:scale-x-100')
                      : cn(textColor, 'hover:text-accent-gold after:scale-x-0 hover:after:scale-x-100')
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className={cn(
                  'text-sm font-sans font-medium transition-colors duration-200',
                  textColor,
                  'hover:text-accent-gold'
                )}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className={cn(
                  'inline-flex items-center px-5 py-2.5 text-sm font-sans font-medium rounded-sm',
                  'transition-all duration-200',
                  isHome && !isScrolled
                    ? 'bg-accent-gold text-text-on-gold hover:bg-accent-gold-hover'
                    : 'bg-bg-dark text-text-on-dark hover:bg-stone-800'
                )}
              >
                Daftar Agen
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden p-2 rounded-sm transition-colors duration-200',
                textColor,
                'hover:bg-white/10'
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 top-16 z-40 bg-white shadow-luxury-lg border-b border-border lg:hidden"
          >
            <nav className="container-luxury py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block text-base font-sans font-medium py-2 transition-colors duration-200',
                      pathname === link.href ? 'text-accent-gold' : 'text-text-primary hover:text-accent-gold'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary text-center"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-dark text-center"
                >
                  Daftar Agen
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
