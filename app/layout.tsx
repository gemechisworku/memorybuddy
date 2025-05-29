/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientSideProviders } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MemoryBuddy",
  description: "Your friendly assistant for capturing thoughts, ideas, and memories, effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientSideProviders>
          {children}
        </ClientSideProviders>
      </body>
    </html>
  );
} 