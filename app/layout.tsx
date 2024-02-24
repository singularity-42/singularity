export const metadata: NextMetadata = SITE_METADATA;
import "./globals.scss";

import type { Metadata as NextMetadata } from "next";


import Content from "@/components/content/Content";

import { SITE_METADATA } from "@/types";

import { EntityProvider } from "@/hooks/provider/EntityProvider";
import EntityOverlay from "@/components/data/EntityOverlay";

import { CredentialsProvider } from "@/hooks/provider/CredentialsProvider";
import CredentialsOverlay from "@/components/data/CredentialsOverlay";

import { VisualProvider } from "@/hooks/provider/VisualProvider";

import { FilterProvider } from "@/hooks/provider/FilterProvider";

import localFont from 'next/font/local';
const inter = localFont({ src: './Inter.ttf' });

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html suppressHydrationWarning={true}>
      <body className={inter.className}>
        <VisualProvider><FilterProvider>
          <CredentialsProvider><CredentialsOverlay />
            <EntityProvider><EntityOverlay />
              {children}
              <Content />
            </EntityProvider>
          </CredentialsProvider>
        </FilterProvider></VisualProvider>
      </body>
    </html>
  );
}
