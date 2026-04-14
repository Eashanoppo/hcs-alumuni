"use client"

import { useState } from "react"
import { useTeacherRegistration } from "./TeacherRegistrationContext"
import { ArrowRight, Camera, Loader2, Plus, Trash2 } from "lucide-react"
import { uploadToCloudinary } from "@/lib/cloudinary"
import ImageCropperModal from "@/components/ui/ImageCropperModal"
import TeacherStepper from "./TeacherStepper"

export default function TeacherStep1() {
  const { data, updateData, currentStep, setCurrentStep } = useTeacherRegistration()
  const [uploading, setUploading] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)

  // State for joining date parts
  const [joinDay, setJoinDay] = useState(() => {
    const parts = (data.joining_date || "").split("/")
    return parts[0] || ""
  })
  const [joinMonth, setJoinMonth] = useState(() => {
    const parts = (data.joining_date || "").split("/")
    return parts[1] || ""
  })
  const [joinYear, setJoinYear] = useState(() => {
    const parts = (data.joining_date || "").split("/")
    return parts[2] || ""
  })

  const handleDateChange = (d: string, m: string, y: string) => {
    if (d && m && y) {
      updateData({ joining_date: `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}` })
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageToCrop(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onCropComplete = async (croppedFile: File) => {
    setImageToCrop(null)
    try {
      setUploading(true)
      const url = await uploadToCloudinary(croppedFile)
      updateData({ photo_url: url })
    } catch (err) {
      console.error(err)
      alert("Failed to upload photo")
    } finally {
      setUploading(false)
    }
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate joining_date is fully assembled
    if (!data.joining_date || !data.joining_date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      alert("অনুগ্রহ করে সঠিক যোগদানের তারিখ (DD/MM/YYYY) দিন।")
      return
    }
    // Validate education is mandatory (at least one entry)
    if (!data.education || data.education.length === 0) {
      alert("অনুগ্রহ করে অন্তত একটি শিক্ষার স্তর (Education Level) যোগ করুন।")
      return
    }
    // Validate that each education entry has required fields
    const invalidEdu = data.education.some(edu => !edu.level || !edu.institution);
    if (invalidEdu) {
      alert("অনুগ্রহ করে শিক্ষার স্তরের সকল তথ্য (Level & Institution) প্রদান করুন।")
      return
    }

    setCurrentStep(currentStep + 1)
  }

  const addEducation = () => {
    updateData({
      education: [...(data.education || []), { level: "", institution: "", subject: "" }]
    })
  }

  const removeEducation = (index: number) => {
    const edu = [...(data.education || [])]
    edu.splice(index, 1)
    updateData({ education: edu })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const edu = [...(data.education || [])]
    edu[index] = { ...edu[index], [field]: value }
    updateData({ education: edu })
  }

  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ]

  return (
    <>
      {imageToCrop && (
        <ImageCropperModal 
          image={imageToCrop}
          onClose={() => setImageToCrop(null)}
          onCropComplete={onCropComplete}
          aspect={1}
        />
      )}
      
      <TeacherStepper />

      <form onSubmit={handleNext} className="space-y-8 animate-fade-in">
        
        {/* Photo Upload */}
        <div className="flex flex-col items-center mb-10 pb-10 border-b border-gray-50">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4">Profile Photo / ছবি (ঐচ্ছিক)</label>
          <div className="relative group cursor-pointer w-32 h-32">
            <label className="block w-full h-full cursor-pointer">
              <div className="w-full h-full rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group-hover:border-[#1F3D2B] transition-all overflow-hidden relative">
                {data.photo_url ? (
                  <img src={data.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-gray-400 group-hover:text-[#1F3D2B] transition-colors" size={32} />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="animate-spin text-[#1F3D2B]" size={24} />
                  </div>
                )}
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Personal Info */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-primary tracking-widest uppercase border-b border-gray-50 pb-4">ক. ব্যক্তিগত তথ্য</h3>
          
          {/* Bilingual Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">
                ১. পূর্ণ নাম (বাংলায়) <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={(data as any).full_name_bn || ""}
                onChange={e => updateData({ full_name_bn: e.target.value } as any)}
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg tracking-wide text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
                placeholder="আপনার পূর্ণ নাম বাংলায় লিখুন"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">
                Full Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={(data as any).full_name_en || ""}
                onChange={e => updateData({ full_name_en: e.target.value } as any)}
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg tracking-wide text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
                placeholder="Your full name in English"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">২. পদবি (স্কুলে থাকাকালীন) <span className="text-red-500">*</span></label>
              <input required value={data.designation || ""} onChange={e => updateData({ designation: e.target.value })} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" placeholder="e.g. Senior Teacher, Head Teacher" />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">৩. পাঠদানের বিষয় <span className="text-red-500">*</span></label>
              <input required value={data.subject || ""} onChange={e => updateData({ subject: e.target.value })} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" placeholder="e.g. Mathematics, English" />
            </div>
          </div>

          {/* Joining Date DD/MM/YYYY */}
          <div className="space-y-3">
            <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">
              ৪. স্কুলে যোগদানের তারিখ (দিন/মাস/সাল) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-muted font-bold ml-1">এই তারিখটি আপনার লগইন পাসওয়ার্ড হিসেবে ব্যবহার হবে।</p>
            <div className="grid grid-cols-3 gap-6">
              {/* Day */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted text-center">দিন (Day)</label>
                <select
                  required
                  value={joinDay}
                  onChange={e => {
                    setJoinDay(e.target.value)
                    handleDateChange(e.target.value, joinMonth, joinYear)
                  }}
                  className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary text-center appearance-none cursor-pointer focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(d => (
                    <option key={d} value={d.padStart(2, '0')}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted text-center">মাস (Month)</label>
                <select
                  required
                  value={joinMonth}
                  onChange={e => {
                    setJoinMonth(e.target.value)
                    handleDateChange(joinDay, e.target.value, joinYear)
                  }}
                  className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary text-center appearance-none cursor-pointer focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
                >
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted text-center">সাল (Year)</label>
                <select
                  required
                  value={joinYear}
                  onChange={e => {
                    setJoinYear(e.target.value)
                    handleDateChange(joinDay, joinMonth, e.target.value)
                  }}
                  className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary text-center appearance-none cursor-pointer focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 2026 - 1960 + 1 }, (_, i) => (2026 - i).toString()).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            {data.joining_date && (
              <p className="text-sm font-black text-[#1F3D2B] ml-1 mt-2">✓ তারিখ: {data.joining_date}</p>
            )}
          </div>

          {/* Leaving Year */}
            <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">৫. স্কুল ত্যাগের সাল (ঐচ্ছিক)</label>
            <select value={data.leaving_year || ""} onChange={e => updateData({ leaving_year: e.target.value })} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary appearance-none cursor-pointer focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none">
              <option value="">নির্বাচন করুন (Select Year)</option>
              <option value="Present">বর্তমানে কর্মরত (Presently Working)</option>
              {Array.from({ length: 2026 - 1960 + 1 }, (_, i) => (2026 - i).toString()).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <p className="text-xs text-muted font-bold ml-1">যদি বর্তমানে কর্মরত হন তবে 'Present' নির্বাচন করুন।</p>
        </div>

        {/* Education Section */}
        <div className="pt-8 mt-8 border-t border-gray-50 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-primary tracking-widest uppercase">
              শিক্ষার স্তর (Education Level) <span className="text-red-500">*</span>
            </h3>
            <button type="button" onClick={addEducation} className="px-4 py-2 bg-[#FAFAF7] border border-[#1F3D2B]/20 text-[#1F3D2B] rounded-xl font-bold text-xs hover:bg-[#1F3D2B] hover:text-white transition-all flex items-center gap-2">
              <Plus size={14} /> শিক্ষা যোগ করুন (Add Education)
            </button>
          </div>

          {(data.education || []).map((edu, idx) => (
            <div key={idx} className="p-6 bg-[#FAFAF7] rounded-3xl border border-gray-100 space-y-4 relative">
              <button type="button" onClick={() => removeEducation(idx)} className="absolute top-4 right-4 text-rose-500 p-2 bg-white rounded-full hover:bg-rose-50 transition-all shadow-sm">
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">শিক্ষার স্তর (Level)</label>
                  <select required value={edu.level} onChange={e => updateEducation(idx, 'level', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold">
                    <option value="">নির্বাচন করুন</option>
                    {['এসএসসি (SSC)', 'এইচএসসি (HSC)', 'স্নাতক (Bachelor)', 'স্নাতকোত্তর (Master)', 'পিএইচডি (PhD)'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">ফল প্রকাশের বিষয় (Subject)</label>
                  <input value={edu.subject} onChange={e => updateEducation(idx, 'subject', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold" placeholder="যেমন: জীববিজ্ঞান" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">প্রতিষ্ঠানের নাম (Institution Name)</label>
                  <input required value={edu.institution} onChange={e => updateEducation(idx, 'institution', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold" placeholder="আপনার কলেজ বা বিশ্ববিদ্যালয়ের নাম লিখুন" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 flex justify-end">
          <button type="submit" disabled={uploading} className="px-10 py-5 bg-[#1F3D2B] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            Next Step <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </>
  )
}
