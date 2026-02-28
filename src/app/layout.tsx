import type { Metadata } from "next";
import "./globals.css";
import { LocationPopup } from "@/components/LocationPopup";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AuthModal } from "@/components/AuthModal";
import { SearchOverlay } from "@/components/SearchOverlay";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Tawakkal Paint Store | Premium Paints in Karachi",
  description: "Karachi's most trusted paint store since 2011. Authorized dealer for Gobi's, Berger, Diamond, Saasi, Brighto, Choice. Premium quality paints with free color consultation.",
  keywords: "paint store, Karachi paints, premium paints, Gobi's, Berger, Diamond, Saasi, Brighto, Choice, Rozzilac, industrial paints, automotive paints, decorative paints",
  authors: [{ name: "Tawakkal Paint Store" }],
  openGraph: {
    title: "Tawakkal Paint Store | Premium Paints in Karachi",
    description: "Karachi's most trusted paint store since 2011. Authorized dealer for premium paint brands.",
    type: "website",
    locale: "en_PK",
    siteName: "Tawakkal Paint Store"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tawakkal Paint Store | Premium Paints in Karachi",
    description: "Karachi's most trusted paint store since 2011."
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://tawakkalpaintstore.com"
  },
  icons: {
    icon: '/tph-round-icon.png',
    shortcut: '/tph-round-icon.png',
    apple: '/tph-round-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tawakkal Paint Store",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "addressCountry": "PK"
    },
    "telephone": "+923475658761",
    "areaServed": {
      "@type": "City",
      "name": "Karachi"
    },
    "priceRange": "$$",
    "openingHours": "Mo-Sat 09:00-20:00",
    "image": "https://tawakkalpaintstore.com/logo.png",
    "description": "Karachi's most trusted paint store since 2011. Authorized dealer for Gobi's, Berger, Diamond, Saasi, Brighto, Choice, and exclusive distributor for Rozzilac."
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <LocationPopup />
          <Navbar />
          <AuthModal />
          <SearchOverlay />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}
