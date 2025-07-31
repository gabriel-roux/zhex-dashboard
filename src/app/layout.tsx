import type { Metadata } from 'next'
// eslint-disable-next-line camelcase
import { Inter, Style_Script } from 'next/font/google'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import React from 'react'
import { AuthProvider } from '@/contexts/auth/provider'
import { AuthGuard } from '@/contexts/auth/auth-guard'
import { WebSocketProvider } from '@/contexts/websocket/provider'

const interSans = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const styleScript = Style_Script({
  variable: '--font-style-script',
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
})

const arabotoSans = localFont({
  src: [
    {
      path: '../assets/fonts/Araboto-Thin.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Araboto-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Araboto-Normal.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Araboto-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Araboto-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Araboto-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-araboto',
  display: 'swap', // opcional: comportamento de fallback
})

/** -------------------------------------------------------------
 * Global SEO / PWA metadata
 * ------------------------------------------------------------ */
export const metadata: Metadata = {
  metadataBase: new URL('https://zhex.io'),
  applicationName: 'Zhex',
  generator: 'Next.js 15',
  category: 'Fintech',
  title: {
    default: 'Zhex — The Global Payments Platform',
    template: '%s | Zhex',
  },
  description:
    'Zhex é o gateway de pagamentos premium para quem vende infoprodutos. Checkouts rápidos, múltiplas moedas e perks gamificados para escalar suas vendas globalmente.',
  keywords: [
    'Zhex',
    'cartpanda',
    'buygoods',
    'perfectpay',
    'payment gateway',
    'checkout',
    'fintech',
    'infoprodutos',
    'multi‑currency',
    'split payments',
  ],
  authors: [
    { name: 'Equipe Zhex -> Gabriel Fonseca', url: 'https://zhex.io/about' },
  ],
  creator: 'Zhex',
  publisher: 'Zhex',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Zhex — The Transparent Global Payments Platform',
    description:
      'Aceite pagamentos em minutos, escale mundialmente e seja recompensado pelo seu volume de vendas com a gamificação da Zhex.',
    url: 'https://zhex.io',
    siteName: 'Zhex',
    images: [
      {
        url: 'https://zhex.io/og/default-og.png',
        width: 1200,
        height: 630,
        alt: 'Visão geral do dashboard Zhex',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zhex — The Transparent Global Payments Platform',
    description:
      'Gateway de pagamentos premium, múltiplas moedas e perks gamificados para sellers.',
    images: ['https://zhex.io/og/default-og.png'],
    creator: '@zhex_oficial',
  },
  manifest: '/site.webmanifest',
  themeColor: '#002DFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${styleScript.variable} ${arabotoSans.variable} antialiased`}
      >
        <AuthProvider>
          <WebSocketProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
