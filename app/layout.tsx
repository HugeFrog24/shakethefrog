import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers/ThemeProvider'
import { appConfig } from './config/app'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
  icons: {
    icon: appConfig.assets.favicon
  },
  openGraph: {
    title: appConfig.name,
    description: appConfig.description,
    url: appConfig.url,
    siteName: appConfig.name,
    images: [{
      url: '/api/og',
      width: appConfig.assets.ogImage.width,
      height: appConfig.assets.ogImage.height,
      alt: `${appConfig.name} preview`
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.name,
    description: appConfig.description,
    images: ['/api/og']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
