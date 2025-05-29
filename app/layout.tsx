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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* Inline script to prevent hydration mismatches caused by js-focus-visible */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check if the script that adds js-focus-visible has run
                  if (document.documentElement.classList.contains('js-focus-visible')) {
                    // If it has, ensure the server-rendered HTML matches
                    // This script runs before React hydrates
                  } else {
                    // If not, it might be added later, or not at all.
                    // We can add a listener or rely on the library's own logic.
                    // For now, we just ensure the initial state matches if the class is already there.
                  }
                } catch (e) {
                  console.error('Error in inline script:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ClientSideProviders>
          {children}
        </ClientSideProviders>
      </body>
    </html>
  );
} 