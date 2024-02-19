import type { Metadata as NextMetadata } from "next";

import "./globals.css";
import Header from "@/components/layout/Header";
import { TooltipProvider } from "@/hooks/provider/TooltipProvider";
import { DetailsProvider } from "@/hooks/provider/DetailsProvider";
import Background from "@/components/base/Background";
import Impressum from "@/components/base/Impressum";
import AuthProvider from "@/hooks/provider/AuthProvider";
import Credentials from "@/components/layout/Credentials";
import {
  Inter,
  // for fallback simmilar
  Kanit,
} from 'next/font/google';
import { SITE_METADATA } from "@/types";

export const metadata: NextMetadata = SITE_METADATA;
import localFont from 'next/font/local';

const inter = localFont( {src: './Inter.ttf'});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Background />
        <AuthProvider>
          <DetailsProvider>
            <TooltipProvider>
              <Header />
              <div className="container">
                {children}
              </div>
              <Credentials />
            </TooltipProvider>
            <Impressum />
          </DetailsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
