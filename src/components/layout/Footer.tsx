import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-text-on-dark">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold">
              Prop<span className="text-accent-gold">Vista</span>
            </Link>
            <p className="mt-4 text-sm text-stone-400 font-sans leading-relaxed">
              Platform marketplace properti premium Indonesia. Temukan properti impian dengan agen terpercaya dan terverifikasi.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center hover:bg-accent-gold/20 hover:text-accent-gold transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center hover:bg-accent-gold/20 hover:text-accent-gold transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center hover:bg-accent-gold/20 hover:text-accent-gold transition-all duration-200">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Properti
            </h4>
            <ul className="space-y-3">
              {[
                ['Rumah Dijual', '/properti?type=rumah&status=jual'],
                ['Apartemen', '/properti?type=apartemen'],
                ['Ruko & Komersial', '/properti?type=ruko'],
                ['Tanah', '/properti?type=tanah'],
                ['Villa', '/properti?type=villa'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-stone-400 hover:text-accent-gold transition-colors duration-200 font-sans">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                ['Cari Properti', '/properti'],
                ['Direktori Agen', '/agen'],
                ['Market Insight', '/market'],
                ['Daftar sebagai Agen', '/register'],
                ['Panduan Jual/Beli', '/panduan'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-stone-400 hover:text-accent-gold transition-colors duration-200 font-sans">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-stone-400 font-sans">Jakarta Selatan, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <span className="text-sm text-stone-400 font-sans">+62 21 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <span className="text-sm text-stone-400 font-sans">hello@propvista.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-500 font-sans">
            © {new Date().getFullYear()} PropVista. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6">
            {[['Privasi', '/privasi'], ['Syarat', '/syarat'], ['Cookie', '/cookie']].map(([label, href]) => (
              <Link key={label} href={href} className="text-xs text-stone-500 hover:text-accent-gold transition-colors duration-200 font-sans">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
