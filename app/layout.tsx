import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers/ThemeProvider'
import { appConfig } from './config/app'
import { Suspense } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
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
    <html suppressHydrationWarning>
      <body className={`${inter.className} transition-colors`}>
        <ThemeProvider>
          <Suspense fallback={
            <div className="flex h-[100dvh] items-center justify-center bg-green-50 dark:bg-slate-900">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          }>
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
