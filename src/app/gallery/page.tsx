import type { Metadata } from "next";
import GalleryContent from "@/components/pages/GalleryContent";

export const metadata: Metadata = {
  title: "Memory Lane — Photo & Video Gallery",
  description: "Relive the golden moments of Holy Crescent School Ashulia. Explore our collection of photos and videos from campus life, events, and alumni reunions.",
  keywords: [
    "Holy Crescent School Gallery",
    "HCS Ashulia Photos",
    "School Memories Video",
    "Alumni Reunion Photos Dhaka",
    "Ashulia School Events"
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "School Memories — Holy Crescent School Gallery",
    description: "Capturing moments that define us at Holy Crescent School Ashulia.",
    url: "https://holy-crescent.com/gallery",
    images: ["/images/og-image.jpg"],
  },
};

export default function GalleryPage() {
  return <GalleryContent />;
}
