"use client"

import { Check } from 'lucide-react'
import { useTeacherRegistration } from './TeacherRegistrationContext'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const STEPS = [
  { id: 1, label: "ব্যক্তিগত তথ্য", en: "Personal" },
  { id: 2, label: "পেশাগত তথ্য", en: "Professional" },
  { id: 3, label: "অংশগ্রহণ", en: "Participation" },
  { id: 4, label: "যাচাই", en: "Review" },
]

export default function TeacherStepper() {
  const { currentStep } = useTeacherRegistration()

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
        
        {STEPS.map((s) => {
          const isActive = s.id === currentStep
          const isCompleted = s.id < currentStep

          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isActive && "bg-[#CEB888] text-white border-[#CEB888] shadow-lg ring-4 ring-[#CEB888]/20 scale-110",
                  isCompleted && "bg-[#1F3D2B] text-[#CEB888] border-[#1F3D2B]",
                  !isActive && !isCompleted && "bg-white text-muted border-gray-200"
                )}
              >
                {isCompleted ? <Check size={18} /> : <span className="font-bold">{s.id}</span>}
              </div>
              <span className={cn(
                "text-[10px] md:text-xs font-bold whitespace-nowrap hidden sm:block",
                isActive ? "text-primary" : "text-muted"
              )}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
