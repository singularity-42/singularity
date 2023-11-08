// path: app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/base/Header'
import { AnimatePresence } from 'framer-motion'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Singularity',
  description: '42',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <AnimatePresence exitBeforeEnter>
        <Header />

        {children}

        </AnimatePresence>
      </body>
    </html>
  )
}
