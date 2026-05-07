import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/Header'
import '@/app/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'HIAMARA CROCHÊ — Feito à mão, entregue com amor',
    template: '%s | HIAMARA CROCHÊ',
  },
  description:
    'Roupas e bonecos de crochê artesanais únicos. Cada peça feita à mão com carinho e dedicação.',
  keywords: ['crochê', 'artesanato', 'roupas crochê', 'bonecos crochê', 'feito à mão', 'artesanal'],
  authors: [{ name: 'Hiamara Crochê' }],
  creator: 'Hiamara Crochê',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    siteName: 'HIAMARA CROCHÊ',
    title: 'HIAMARA CROCHÊ — Feito à mão, entregue com amor',
    description:
      'Roupas e bonecos de crochê artesanais únicos. Cada peça feita à mão com carinho e dedicação.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HIAMARA CROCHÊ — Artesanato em crochê',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HIAMARA CROCHÊ',
    description: 'Roupas e bonecos de crochê artesanais únicos.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FDFAF5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-creme-50 text-texto-medio antialiased">
        <Header />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: 'hsl(var(--primary))', secondary: 'hsl(var(--background))' },
            },
          }}
        />
      </body>
    </html>
  )
}
