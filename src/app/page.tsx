import type { Metadata } from "next";
import HomeContent from "@/components/layout/HomeContent";

export const metadata: Metadata = {
  title: "Holy Crescent School Ashulia | Alumni Portal & Silver Jubilee 2026",
  description: "Official Alumni Registration Portal for Holy Crescent School Ashulia. Join us in celebrating our 25th Anniversary Silver Jubilee. Reconnect with fellow students, teachers, and memories.",
  keywords: [
    "Holy Crescent School",
    "Holy Crescent School Ashulia",
    "HCS Ashulia",
    "Holy Crescent School Alumni",
    "HCS Alumni Portal",
    "Silver Jubilee 2026",
    "Alumni Registration",
    "School Reunion Ashulia",
    "Ashulia School Memories",
    "Samir Kumar Sarkar"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Holy Crescent School Ashulia | Alumni Portal",
    description: "Celebrating 25 years of excellence. Join the Holy Crescent School Alumni network today.",
    url: "https://holy-crescent.com", // Official domain
    siteName: "Holy Crescent School Alumni",
    images: [
      {
        url: "/images/og-image.jpg", // Suggested OG image path
        width: 1200,
        height: 630,
        alt: "Holy Crescent School Ashulia Silver Jubilee",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Holy Crescent School Ashulia | Alumni Portal",
    description: "Join the Holy Crescent School Alumni network. Celebrating 25 years of education.",
    images: ["/images/og-image.jpg"],
  },
};

export default function Home() {
  return <HomeContent />;
}
