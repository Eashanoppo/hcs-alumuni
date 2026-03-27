"use client";

import Image from "next/image";
import { useRegistration } from "@/components/registration/RegistrationContext";
import Stepper from "@/components/registration/Stepper";
import Step1 from "@/components/registration/Step1";
import Step2 from "@/components/registration/Step2";
import Step3 from "@/components/registration/Step3";
import Step4 from "@/components/registration/Step4";
import Step5 from "@/components/registration/Step5";

export default function RegistrationPage() {
  const { step } = useRegistration();

  return (
    <div className="space-y-8">
      <header className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="HCS Logo"
            width={100}
            height={100}
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
          রজত জয়ন্তী উৎসব ২০২৬
        </h1>
        <p className="text-muted font-bold uppercase tracking-widest text-xs">
          Celebrate 25 Years of Excellence
        </p>
      </header>

      <Stepper />

      <section className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(31,61,43,0.06)] overflow-hidden">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
        {step === 5 && <Step5 />}
      </section>
    </div>
  );
}
