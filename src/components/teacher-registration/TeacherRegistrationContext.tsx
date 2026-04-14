"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { TeacherRecord } from "@/lib/teacher-db"

interface TeacherRegistrationContextType {
  data: Partial<TeacherRecord>
  updateData: (newData: Partial<TeacherRecord>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  resetData: () => void
}

const defaultData: Partial<TeacherRecord> = {
  full_name_en: "",
  full_name_bn: "",
  designation: "",
  subject: "",
  joining_date: "",
  leaving_year: "",
  photo_url: null,
  education: [],
  present_address: "",
  mobile: "",
  email: "",
  facebook_url: "",
  current_occupation: "",
  current_institution: "",
  willing_to_attend: "হ্যাঁ",
  activities: [],
  memory_note: "",
  consent: false,
}

const TeacherRegistrationContext = createContext<TeacherRegistrationContextType | undefined>(undefined)

export function TeacherRegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Partial<TeacherRecord>>(defaultData)
  const [currentStep, setCurrentStep] = useState(1)

  const updateData = (newData: Partial<TeacherRecord>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const resetData = () => {
    setData(defaultData)
    setCurrentStep(1)
  }

  return (
    <TeacherRegistrationContext.Provider value={{ data, updateData, currentStep, setCurrentStep, resetData }}>
      {children}
    </TeacherRegistrationContext.Provider>
  )
}

export function useTeacherRegistration() {
  const context = useContext(TeacherRegistrationContext)
  if (!context) {
    throw new Error("useTeacherRegistration must be used within a TeacherRegistrationProvider")
  }
  return context
}
