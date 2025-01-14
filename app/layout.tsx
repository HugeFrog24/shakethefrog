import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shake the Frog',
  description: 'A fun interactive frog that reacts to shaking!',
  icons: {
    icon: '/images/frog.svg'
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
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
