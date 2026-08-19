import type { Metadata, Viewport } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Amauta - Plataforma Educativa STEM & Sabiduría",
  description: "Plataforma educativa inspirada en los maestros sabios (Amauta) con tutoría IA interactiva y tecnología PWA.",
  applicationName: "Amauta",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Amauta",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "https://cdn.phototourl.com/free/2026-08-19-1adf156d-26c7-446d-acbb-a6e0dd3e3b01.png",
    apple: "https://cdn.phototourl.com/free/2026-08-19-1adf156d-26c7-446d-acbb-a6e0dd3e3b01.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="https://cdn.phototourl.com/free/2026-08-19-1adf156d-26c7-446d-acbb-a6e0dd3e3b01.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <PWAInstallPrompt />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
