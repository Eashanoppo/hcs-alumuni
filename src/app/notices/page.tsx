import type { Metadata } from "next";
import NoticesContent from "@/components/pages/NoticesContent";

export const metadata: Metadata = {
  title: "Notices & Announcements",
  description: "Stay updated with the latest news, notices, and announcements from Holy Crescent School Ashulia. Information on upcoming events and administrative updates.",
  keywords: [
    "Holy Crescent School Notices",
    "HCS Ashulia News",
    "School Announcements Dhaka",
    "Ashulia Education Updates",
    "HCS Events"
  ],
  alternates: {
    canonical: "/notices",
  },
  openGraph: {
    title: "News & Notices — Holy Crescent School Ashulia",
    description: "Latest news, notices, and updates from Holy Crescent School.",
    url: "https://holy-crescent.com/notices",
    images: ["/images/og-image.jpg"],
  },
};

export default function NoticePage() {
  return <NoticesContent />;
}
