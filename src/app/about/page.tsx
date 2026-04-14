import type { Metadata } from "next";
import AboutContent from "@/components/pages/AboutContent";

export const metadata: Metadata = {
  title: "About Us — Our History & Legacy",
  description: "Learn about the 25-year history of Holy Crescent School Ashulia. Our mission, vision, and the journey that shaped generations.",
  keywords: [
    "Holy Crescent School History",
    "HCS Ashulia Mission",
    "School Legacy Dhaka",
    "Ashulia Education History",
    "Samir Kumar Sarkar",
    "Holy Crescent School Founders"
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Holy Crescent School Ashulia | Our Legacy",
    description: "Discover the journey of Holy Crescent School over the last 25 years.",
    url: "https://holy-crescent.com/about",
    images: ["/images/og-image.jpg"],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
