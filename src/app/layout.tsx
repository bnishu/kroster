import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://krypton.bni-nagpur.in'),
  title: {
    default: 'BNI Krypton — Premium Business Networking Directory',
    template: '%s | BNI Krypton',
  },
  description:
    'Connect with trusted BNI Krypton businesses in Nagpur. Discover verified professionals, services, and referral partners in our elite business networking platform.',
  keywords: [
    'BNI Krypton', 'business networking', 'Nagpur', 'referrals', 'professionals',
    'B2B', 'business directory', 'BNI chapter',
  ],
  openGraph: {
    title: 'BNI Krypton — Premium Business Networking Directory',
    description: 'Connect with trusted BNI Krypton businesses in Nagpur.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'BNI Krypton',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BNI Krypton — Premium Business Networking Directory',
    description: 'Connect with trusted BNI Krypton businesses in Nagpur.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BNI Krypton',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://krypton.bni-nagpur.in',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://krypton.bni-nagpur.in'}/logo.png`,
    description: 'Connect with trusted BNI Krypton businesses in Nagpur.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nagpur',
      addressRegion: 'MH',
      addressCountry: 'IN'
    }
  }

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" theme="dark" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
