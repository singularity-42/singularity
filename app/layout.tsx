import "./globals.css";

import type { Metadata as NextMetadata } from "next";

import { EntityProvider } from "@/hooks/provider/useEntityOverlay";
import { CredentialsProvider } from "@/hooks/provider/useCredentials";
import { VisualProvider } from "@/hooks/provider/useVisual";
import { FilterProvider } from "@/hooks/provider/useFilter";

import localFont from 'next/font/local';
import CredentialsOverlay from "@/components/layouts/OverlayCredentials";
import EntityOverlay from "@/components/layouts/OverlayEntity";
import Content from "@/components/layouts/Content";
import { SITE_METADATA } from "./defaults";
import { LoadingProvider } from "@/hooks/provider/useLoading";

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
            <CredentialsProvider><CredentialsOverlay />
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
