import { RegistrationProvider } from "@/components/registration/RegistrationContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegistrationProvider>
      <Navbar />
      <main className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </RegistrationProvider>
  );
}
