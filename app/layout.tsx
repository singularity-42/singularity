import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { TooltipProvider } from '@/hooks/provider/TooltipProvider';
import Details from '@/components/layout/Details';
import { DetailsProvider } from '@/hooks/provider/DetailsProvider';

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
        <DetailsProvider>
          <TooltipProvider>
            <Header />
            {
              // if url has #--- in name then render <Details />
              // else render children
            }
            {children}
          </TooltipProvider>
        </DetailsProvider>
      </body>
    </html>
  )
}
