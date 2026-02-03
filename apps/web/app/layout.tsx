import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patchin - Connect your data to any AI agent",
  description: "One connection. All your data. Every AI agent. Stop setting up integrations one by one.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://plausible.io/js/pa-TW0pQYEFXEk_pFT8YdSwb.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </head>
      <body
        className={`${inter.variable} antialiased`}
        style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
