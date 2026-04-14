import type { Metadata } from "next";
import TeachersContent from "@/components/pages/TeachersContent";

export const metadata: Metadata = {
  title: "Honorable Teachers — Faculty Directory",
  description: "Meet the dedicated teachers and mentors of Holy Crescent School Ashulia. Search our faculty directory to reconnect with your childhood mentors.",
  keywords: [
    "Holy Crescent School Teachers",
    "HCS Ashulia Faculty",
    "Best Teachers in Ashulia",
    "School Mentors Dhaka",
    "HCS Teacher Profiles"
  ],
  alternates: {
    canonical: "/teachers",
  },
  openGraph: {
    title: "Honorable Teachers — Holy Crescent School Ashulia",
    description: "The pillars of our institution. Reconnect with your mentors.",
    url: "https://holy-crescent.com/teachers",
    images: ["/images/og-image.jpg"],
  },
};

export default function TeachersPage() {
  return <TeachersContent />;
}
