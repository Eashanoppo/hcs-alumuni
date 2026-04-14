"use client"

import { TeacherRegistrationProvider, useTeacherRegistration } from "@/components/teacher-registration/TeacherRegistrationContext"
import TeacherStep1 from "@/components/teacher-registration/TeacherStep1"
import TeacherStep2 from "@/components/teacher-registration/TeacherStep2"
import TeacherStep3 from "@/components/teacher-registration/TeacherStep3"
import TeacherStep4 from "@/components/teacher-registration/TeacherStep4"
import Image from "next/image"

function RegistrationContent() {
  const { currentStep } = useTeacherRegistration()

  return (
    <div className="space-y-8">
      <header className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="HCS Logo"
            width={100}
            height={100}
            className="w-20 h-20 md:w-28 md:h-28 object-contain"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight mb-3">
          শিক্ষক নিবন্ধন
        </h1>
        <p className="text-muted font-bold uppercase tracking-widest text-[10px]">
          Teacher Registration — HCS Silver Jubilee 2026
        </p>
      </header>

      <section className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(31,61,43,0.06)] border border-gray-100 overflow-hidden p-8 md:p-12">
        {currentStep === 1 && <TeacherStep1 />}
        {currentStep === 2 && <TeacherStep2 />}
        {currentStep === 3 && <TeacherStep3 />}
        {currentStep === 4 && <TeacherStep4 />}
      </section>
    </div>
  )
}

export default function TeacherRegistrationPage() {
  return (
    <TeacherRegistrationProvider>
      <RegistrationContent />
    </TeacherRegistrationProvider>
  )
}
