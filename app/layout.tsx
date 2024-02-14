import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { TooltipProvider } from "@/hooks/provider/TooltipProvider";
import { DetailsProvider } from "@/hooks/provider/DetailsProvider";
import Background from "@/components/base/Background";
import Impressum from "@/components/base/Impressum";
import AuthProvider from "@/hooks/provider/AuthProvider";
import Credentials from "@/components/layout/Credentials";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Singularity",
  description: "The Singularity is a collection of creative, concepts, collectives, and collaborations.",
  abstract: "The Singularity is a collection of creative, concepts, collectives, and collaborations.",
  keywords: ["Singularity", "Creative", "Concepts", "Collectives", "Collaborations", "Change", "Chemnitz"],
  applicationName: "Singularity",
  authors: [
    {
      name: "Singularity",
      url: "https://singularity.2n40.eu",
    },
    {
      name: "Drumni",
      url: "https://github.com/drumni",
    },
  ],
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Background />
        <AuthProvider>
          <DetailsProvider>
            <TooltipProvider>
              <Header />
              {children}
              <Credentials />
            </TooltipProvider>
            <Impressum />
          </DetailsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
