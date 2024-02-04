import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/components/Header';
import { TooltipProvider } from '@/hooks/provider/TooltipProvider';
import { DetailsProvider } from '@/hooks/provider/DetailsProvider';
import Background from '@/components/base/Background';

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
  <html suppressHydrationWarning={true}>
    <body className={inter.className}>
       <Background />
        <DetailsProvider>
          <TooltipProvider>
            <Header />
            {children}
          </TooltipProvider>
        </DetailsProvider>
      </body>
    </html>
  )
}
