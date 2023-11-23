import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { TooltipProvider } from '@/hooks/provider/TooltipProvider';
import Tooltip from '@/components/content/Tooltip';

const inter = Inter({ subsets: ['latin'] });

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
        <TooltipProvider>
          <Header />
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
