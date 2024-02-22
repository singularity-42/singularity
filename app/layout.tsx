export const metadata: NextMetadata = SITE_METADATA;
import "./globals.scss";

import type { Metadata as NextMetadata } from "next";


import Content from "@/components/content/Content";

import { SITE_METADATA } from "@/types";

import { DetailsProvider } from "@/hooks/provider/DetailsProvider";
import EntityDetailsOverlay from "@/components/data/EntityDetailsOverlay";

import { CredentialsProvider } from "@/hooks/provider/CredentialsProvider";
import CredentialsOverlay from "@/components/data/CredentialsOverlay";

import { VisualProvider } from "@/hooks/provider/VisualProvider";

import { FilterProvider } from "@/hooks/provider/FilterProvider";

import localFont from 'next/font/local';
const inter = localFont( {src: './Inter.ttf'});

export default function RootLayout(props: { children: React.ReactNode }) {  
  const { children } = props;
  
  return (
    <html suppressHydrationWarning={true}>
      <body className={inter.className}>
        <CredentialsProvider><CredentialsOverlay />
          <DetailsProvider><EntityDetailsOverlay />
            <VisualProvider><FilterProvider>
              {children}
              <Content />
            </FilterProvider></VisualProvider>
          </DetailsProvider>
        </CredentialsProvider>
      </body>
    </html>
  );
}
