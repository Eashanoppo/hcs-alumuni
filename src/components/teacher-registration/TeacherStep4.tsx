"use client"

import { useState } from "react"
import { useTeacherRegistration } from "./TeacherRegistrationContext"
import { ArrowLeft, CheckCircle, Loader2, Phone, Key } from "lucide-react"
import { submitTeacherRegistration, TeacherRecord } from "@/lib/teacher-db"
import Link from "next/link"
import TeacherStepper from "./TeacherStepper"

export default function TeacherStep4() {
  const { data, currentStep, setCurrentStep } = useTeacherRegistration()
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      await submitTeacherRegistration(data as TeacherRecord)
      setIsSuccess(true)
    } catch (err: any) {
      console.error(err)
      setError("Registration failed. Are you already registered with this mobile number?")
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const displayName = (data as any).full_name_en || (data as any).full_name_bn || ""

  if (isSuccess) {
    return (
      <div className="text-center py-10 animate-fade-in flex flex-col items-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-emerald-500" size={48} />
        </div>
        <h2 className="text-3xl font-black text-primary mb-4">Registration Submitted!</h2>
        <p className="text-muted mb-3 max-w-md mx-auto leading-relaxed font-medium">
          Thank you for registering. Your application is currently{" "}
          <span className="font-black text-[#CEB888] uppercase tracking-widest">Pending Approval</span>.
        </p>
        <div className="bg-[#FAFAF7] border border-gray-100 rounded-3xl p-8 mb-10 text-left space-y-4 w-full max-w-md shadow-sm">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#CEB888] mb-2">আপনার লগইন তথ্য (Credentials)</p>
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">Mobile / Login ID</p>
              <p className="font-bold text-primary text-base font-mono tracking-wider">{data.mobile}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Key size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">Password (Date of Join)</p>
              <p className="font-bold text-primary text-base font-mono tracking-wider">{data.joining_date}</p>
            </div>
          </div>
        </div>
        <Link href="/login/teachers" className="px-10 py-5 bg-[#1F3D2B] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-black transition-all">
          Go to Teacher Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <TeacherStepper />

      <div className="text-center mb-8">
        <h3 className="text-xl font-black text-primary tracking-tight">Review Your Application</h3>
        <p className="text-muted text-xs uppercase tracking-widest font-bold mt-2">Please check your details before submitting</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm border border-rose-100 text-center">
          {error}
        </div>
      )}

      <div className="bg-[#FAFAF7] rounded-[2rem] border border-gray-100 p-8 space-y-8">
        <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
          <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            {data.photo_url ? (
               <img src={data.photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <div className="text-3xl font-black text-gray-300">{displayName.charAt(0)}</div>
            )}
          </div>
          <div>
            <h4 className="text-3xl font-black text-primary tracking-tight mb-1">{displayName}</h4>
            {(data as any).full_name_bn && (data as any).full_name_en && (
              <p className="text-lg font-bold text-[#CEB888]">{(data as any).full_name_bn}</p>
            )}
            <p className="font-bold text-muted text-base mt-2">{data.designation} • {data.subject}</p>
            <p className="text-xs uppercase tracking-widest font-black text-[#CEB888] mt-3">
              Joined: {data.joining_date} — Left: {data.leaving_year}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h5 className="text-xs uppercase tracking-widest font-black text-muted border-b border-gray-100 pb-3 flex items-center gap-2">Contact Details</h5>
            <ul className="space-y-4">
              <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Mobile (Login ID)</span> <span className="font-bold text-xl text-primary font-mono tracking-wider">{data.mobile}</span></li>
              <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Password (Joining Date)</span> <span className="font-bold text-xl text-primary font-mono tracking-wider">{data.joining_date}</span></li>
              <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Email</span> <span className="font-bold text-lg text-primary">{data.email || 'N/A'}</span></li>
              <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Facebook</span> <span className="font-bold text-lg text-primary truncate">{(data.facebook_url && data.facebook_url !== 'N/A') ? 'Profile Linked' : 'N/A'}</span></li>
              <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Current Address</span> <span className="font-bold text-lg text-primary leading-relaxed">{data.present_address}</span></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-xs uppercase tracking-widest font-black text-muted border-b border-gray-100 pb-3 flex items-center gap-2">Professional & Event</h5>
            <ul className="space-y-4">
              <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Current Occupation</span> <span className="font-bold text-lg text-primary">{data.current_occupation || 'N/A'}</span></li>
              <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Institution / Institution</span> <span className="font-bold text-lg text-primary">{data.current_institution || 'N/A'}</span></li>
              <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Will Attend Jubilee?</span> <span className="font-bold text-lg text-primary">{data.willing_to_attend}</span></li>
              {(data as any).activities && (data as any).activities.length > 0 && (
                <li className="flex flex-col"><span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Activities</span> <span className="font-bold text-lg text-primary">{(data as any).activities.join(', ')}</span></li>
              )}
            </ul>
          </div>
        </div>

        {data.education && data.education.length > 0 && (
          <div className="pt-4">
            <h5 className="text-xs uppercase tracking-widest font-black text-muted mb-5 border-b border-gray-100 pb-3">Education History</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-50 flex flex-col gap-1 shadow-sm">
                   <div className="text-xs uppercase tracking-widest font-black text-[#CEB888]">{edu.level}</div>
                   <div className="font-bold text-lg text-primary">{edu.subject}</div>
                   <div className="text-sm font-bold text-muted">{edu.institution}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.memory_note && (
          <div className="pt-4">
            <h5 className="text-xs uppercase tracking-widest font-black text-muted mb-4 border-b border-gray-100 pb-3">Memory / Note for HCS</h5>
            <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
              <p className="text-lg font-medium text-primary italic leading-relaxed">"{data.memory_note}"</p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 flex justify-between">
        <button type="button" onClick={handlePrev} className="px-10 py-5 bg-[#FAFAF7] text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200 flex items-center justify-center gap-3 disabled:opacity-50" disabled={loading}>
          <ArrowLeft size={20} /> Back
        </button>
        <button type="button" onClick={handleSubmit} disabled={loading} className="px-10 py-5 bg-[#1F3D2B] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
          Submit Application
        </button>
      </div>
    </div>
  )
}
