import type { Metadata } from 'next'
import { Space_Grotesk, Syne, JetBrains_Mono, VT323 } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LocaleProvider } from '@/hooks/useLocale'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/site'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const vt323 = VT323({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-vt323',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Manuel Barra Lazo — Full Stack Developer · Next.js, React & TypeScript',
  description:
    'Portfolio de Manuel Barra Lazo, desarrollador full stack en Barcelona con 5+ años construyendo producto web con React, Next.js y TypeScript, de portales enterprise para CaixaBank a plataformas propias con IA generativa.',
  keywords: ['Full Stack Developer', 'Frontend Developer', 'Desarrollador Multiplataforma', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Barcelona'],
  authors: [{ name: 'Manuel Barra Lazo' }],
  creator: 'Manuel Barra Lazo',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    locale: 'es_ES',
    title: 'Manuel Barra Lazo — Full Stack Developer · Next.js, React & TypeScript',
    description: 'Portfolio interactivo de Manuel Barra Lazo: producto web con React, Next.js y TypeScript, e IA generativa aplicada.',
    siteName: 'Manuel Barra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manuel Barra Lazo — Full Stack Developer · Next.js, React & TypeScript',
    description: 'Portfolio interactivo de Manuel Barra Lazo: producto web con React, Next.js y TypeScript, e IA generativa aplicada.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable} ${vt323.variable}`}
    >
      <body>
        <JsonLd />
        <ThemeProvider>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
