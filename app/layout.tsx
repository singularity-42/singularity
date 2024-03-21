import "./globals.css";

import type { Metadata as NextMetadata } from "next";

import { EntityProvider } from "@/hooks/useEntityOverlay";
import { VisualProvider } from "@/hooks/useVisual";
import { FilterProvider } from "@/hooks/useFilter";

import localFont from 'next/font/local';
import EntityOverlay from "@/components/layouts/OverlayEntity";
import Content from "@/components/layouts/Content";
import { SITE_METADATA } from "./defaults";
import { LoadingProvider } from "@/hooks/useLoading";
import { CredentialsProvider } from "@/hooks/provider/useCredentials";

const inter = localFont({ src: './Inter.ttf' });

export const metadata: NextMetadata = SITE_METADATA;

interface Props {
  children: React.ReactNode;
}

export default function RootLayout(props: Props) {
  const { children } = props;

  return (
    <html suppressHydrationWarning={true}>
      <body className={inter.className}>
        <LoadingProvider>
          <VisualProvider><FilterProvider>
            <CredentialsProvider>
              <EntityProvider><EntityOverlay />
                <Content>
                  {children}
                </Content>
              </EntityProvider>
            </CredentialsProvider>
          </FilterProvider></VisualProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
