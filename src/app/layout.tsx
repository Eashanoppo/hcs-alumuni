import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import ScrollReset from "@/components/common/ScrollReset";
import FloatingNotice from "@/components/common/FloatingNotice";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
});

import JsonLd from "@/components/common/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL('https://holy-crescent.com'), // Official domain
  title: {
    default: "HCS Alumni | Holy Crescent School Ashulia",
    template: "%s | Holy Crescent School Ashulia"
  },
  description: "Official Alumni Registration Portal for Holy Crescent School Ashulia Silver Jubilee 2026. Celebrating 25 years of excellence.",
  keywords: ["Holy Crescent School", "HCS Ashulia", "Alumni", "Silver Jubilee", "Samir Kumar Sarkar"],
  authors: [{ name: "Holy Crescent School Alumni Committee" }],
  creator: "Holy Crescent School",
  publisher: "Holy Crescent School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    title: "HCS Alumni",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://holy-crescent.com",
    siteName: "Holy Crescent School Alumni",
    title: "Holy Crescent School Ashulia | Alumni Portal",
    description: "Join the Silver Jubilee celebration of Holy Crescent School Ashulia. Register as an alumni today.",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Holy Crescent School Ashulia | Alumni Portal",
    description: "Celebrating 25 years of excellence at Holy Crescent School Ashulia.",
    images: ["/images/og-image.jpg"],
  },
};

const schoolSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Holy Crescent School",
  "alternateName": "হলি ক্রিসেন্ট স্কুল",
  "url": "https://holy-crescent.com",
  "logo": "https://holy-crescent.com/images/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ashulia",
    "addressRegion": "Dhaka",
    "addressCountry": "BD"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+8801912591492",
    "contactType": "Alumni Office",
    "areaServed": "BD",
    "availableLanguage": ["Bengali", "English"]
  },
  "sameAs": [
    "https://www.facebook.com/HolyCrescentSchoolAshulia" // Example, update if real
  ]
};

const silverJubileeSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Holy Crescent School Silver Jubilee 2026",
  "startDate": "2026-01-01", // Approximate, update if known
  "location": {
    "@type": "Place",
    "name": "Holy Crescent School Campus",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ashulia",
      "addressRegion": "Dhaka",
      "addressCountry": "BD"
    }
  },
  "description": "Celebrating 25 years of Holy Crescent School Ashulia.",
  "organizer": {
    "@type": "Organization",
    "name": "Holy Crescent School Alumni Committee"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${inter.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={schoolSchema} />
        <JsonLd data={silverJubileeSchema} />
        <ScrollReset />
        <NotificationProvider>
          {children}
          <FloatingNotice />
        </NotificationProvider>
      </body>
    </html>
  );
}
