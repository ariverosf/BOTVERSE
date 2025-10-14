import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BOTVERSE - Bot Editor",
    template: "%s | BOTVERSE"
  },
  description: "Plataforma avanzada para crear y gestionar bots conversacionales con flujos visuales intuitivos",
  keywords: ["bot", "chatbot", "conversational AI", "workflow", "automation"],
  authors: [{ name: "BOTVERSE Team" }],
  creator: "BOTVERSE",
  publisher: "BOTVERSE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "BOTVERSE - Bot Editor",
    description: "Plataforma avanzada para crear y gestionar bots conversacionales",
    siteName: "BOTVERSE",
  },
  twitter: {
    card: "summary_large_image",
    title: "BOTVERSE - Bot Editor",
    description: "Plataforma avanzada para crear y gestionar bots conversacionales",
    creator: "@botverse",
  },
  robots: {
    index: false, // Bot editor should not be indexed
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1FBEBA" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
