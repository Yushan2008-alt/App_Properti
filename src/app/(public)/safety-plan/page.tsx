import type { Metadata } from 'next'
import { ShieldCheck, FileSearch, UserCheck, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Safety Plan | PropVista',
  description: 'Rencana keamanan dan perlindungan pengguna PropVista untuk menjaga transaksi properti tetap aman.',
}

const SAFETY_ITEMS = [
  {
    title: 'Verifikasi Agen & Listing',
    description: 'Setiap agen wajib mengunggah dokumen resmi. Listing dipantau untuk memastikan informasi akurat.',
    icon: UserCheck,
  },
  {
    title: 'Moderasi & Audit Berkala',
    description: 'Tim kami melakukan audit berkala terhadap listing, foto, dan aktivitas yang terindikasi mencurigakan.',
    icon: FileSearch,
  },
  {
    title: 'Perlindungan Data Pengguna',
    description: 'Data pribadi disimpan dengan standar keamanan tinggi dan hanya digunakan untuk kebutuhan transaksi.',
    icon: ShieldCheck,
  },
  {
    title: 'Pelaporan & Penanganan Cepat',
    description: 'Laporkan aktivitas mencurigakan melalui dashboard dan tim akan menindaklanjuti secepat mungkin.',
    icon: AlertTriangle,
  },
]

export default function SafetyPlanPage() {
  return (
    <div className="min-h-screen bg-bg-primary pt-20">
      <div className="bg-bg-secondary border-b border-border">
        <div className="container-luxury py-12 text-center">
          <p className="text-accent-gold font-sans text-xs font-medium tracking-[0.2em] uppercase mb-2">
            Keamanan & Kepercayaan
          </p>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary mb-3">
            Safety Plan PropVista
          </h1>
          <div className="w-10 h-0.5 bg-accent-gold mx-auto mb-4" />
          <p className="text-text-secondary font-sans text-base max-w-2xl mx-auto">
            Kami berkomitmen menjaga pengalaman transaksi properti yang aman, transparan, dan terpercaya
            untuk setiap buyer, agen, dan developer di platform PropVista.
          </p>
        </div>
      </div>

      <div className="container-luxury py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {SAFETY_ITEMS.map(item => (
            <div key={item.title} className="bg-white border border-border rounded-sm p-6 shadow-luxury-sm">
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-gold/10 text-accent-gold">
                  <item.icon className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-serif text-xl text-text-primary mb-2">{item.title}</h2>
                  <p className="text-sm font-sans text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-bg-secondary border border-border rounded-sm p-6 text-sm font-sans text-text-secondary">
          Untuk pertanyaan lebih lanjut, silakan hubungi tim kami melalui dashboard atau email support resmi PropVista.
        </div>
      </div>
    </div>
  )
}
