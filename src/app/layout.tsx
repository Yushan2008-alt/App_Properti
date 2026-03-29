import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'PropVista — Properti Premium Indonesia',
    template: '%s | PropVista',
  },
  description: 'Temukan properti impian Anda dengan agen terpercaya. Marketplace properti premium Indonesia — rumah, apartemen, ruko, tanah, villa.',
  keywords: ['properti', 'rumah dijual', 'apartemen', 'real estate Indonesia', 'agen properti'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'PropVista',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
