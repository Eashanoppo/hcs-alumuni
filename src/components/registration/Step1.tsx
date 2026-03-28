import { useRegistration } from "./RegistrationContext"
import { ArrowRight, User, MapPin, Briefcase, Camera, Loader2, Image as ImageIcon } from "lucide-react"
import { useState } from "react"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { useNotification } from "@/lib/contexts/NotificationContext"

export default function Step1() {
  const { nextStep, updateData, data } = useRegistration()
  const [uploading, setUploading] = useState(false)
  const { notify } = useNotification()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.workplace && !data.current_institution) {
      notify('কর্মস্থল (Workplace) অথবা শিক্ষা প্রতিষ্ঠান (Current Institution) এর যেকোনো একটি পূরণ করা বাধ্যতামূলক।', 'error')
      return
    }
    nextStep()
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      updateData({ photo_url: url })
    } catch (error) {
      console.error('Upload failed:', error)
      notify('Photo upload failed. Please ensure your Cloudinary settings are correct.', 'error')
    } finally {
      setUploading(false)
    }
  }

  // Date selectors for Gmail-style birthday input
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const years = Array.from({ length: 2026 - 1940 + 1 }, (_, i) => (2026 - i).toString())

  // Parse current dob if exists to set initial selector values
  const [localDay, setLocalDay] = useState(data.dob ? data.dob.split('-')[0] : '')
  const [localMonth, setLocalMonth] = useState(data.dob ? data.dob.split('-')[1] : '')
  const [localYear, setLocalYear] = useState(data.dob ? data.dob.split('-')[2] : '')

  const handleBirthdayChange = (d: string, m: string, y: string) => {
    setLocalDay(d)
    setLocalMonth(m)
    setLocalYear(y)
    updateData({ dob: `${d}-${m}-${y}` })
  }

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10 text-center sm:text-left text-primary">
        <h2 className="text-3xl font-black mb-2 tracking-tight">ব্যক্তিগত তথ্য (Personal Information)</h2>
        <p className="text-muted text-sm font-bold uppercase tracking-widest opacity-60">Complete your institutional record</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          {/* Photos Upload Section */}
          <div className="md:col-span-2 flex justify-center pb-6">
            <div className="relative group cursor-pointer w-40 h-40">
              <label className="block w-full h-full cursor-pointer">
                <div className="w-full h-full rounded-[2.5rem] bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group-hover:border-primary group-hover:bg-[#FAFAF7] transition-all overflow-hidden relative shadow-premium">
                  {data.photo_url ? (
                    <img src={data.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <>
                       {uploading ? (
                         <Loader2 className="animate-spin text-primary" size={32} />
                       ) : (
                         <>
                           <Camera size={32} className="text-muted group-hover:text-primary transition-colors" />
                           <span className="text-[10px] font-black text-muted mt-2 uppercase tracking-widest">Profile Photo</span>
                         </>
                       )}
                    </>
                  )}
                </div>
                {!uploading && (
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoUpload}
                  />
                )}
              </label>
              <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-2xl text-white shadow-xl group-hover:scale-110 transition-transform">
                <ImageIcon size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">Full Name (English) <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              value={data.full_name_en || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
              placeholder="Ex: Abdul Karim"
              onChange={(e) => updateData({ full_name_en: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">পুরো নাম (বাংলায়)</label>
            <input 
              type="text" 
              value={data.full_name_bn || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
              placeholder="উদা: আব্দুল করিম"
              onChange={(e) => updateData({ full_name_bn: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">পিতার নাম <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              value={data.father_name || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
              onChange={(e) => updateData({ father_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">মাতার নাম <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              value={data.mother_name || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
              onChange={(e) => updateData({ mother_name: e.target.value })}
            />
          </div>

          {/* Birthday - Direct Input (Gmail Style) */}
          <div className="md:col-span-2 space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">জন্ম তারিখ (Date of Birth) <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-4">
               <select 
                required
                value={localDay}
                className="bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                onChange={(e) => handleBirthdayChange(e.target.value, localMonth, localYear)}
               >
                 <option value="">Day</option>
                 {days.map(d => <option key={d} value={d}>{d}</option>)}
               </select>

               <select 
                required
                value={localMonth}
                className="bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                onChange={(e) => handleBirthdayChange(localDay, e.target.value, localYear)}
               >
                 <option value="">Month</option>
                 {months.map(m => <option key={m} value={m}>{m}</option>)}
               </select>

               <select 
                required
                value={localYear}
                className="bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                onChange={(e) => handleBirthdayChange(localDay, localMonth, e.target.value)}
               >
                 <option value="">Year</option>
                 {years.map(y => <option key={y} value={y}>{y}</option>)}
               </select>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2 mt-4 pt-6 border-t border-gray-50">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">বর্তমান ঠিকানা <span className="text-red-500">*</span></label>
            <textarea 
              required
              value={data.present_address || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary min-h-25"
              onChange={(e) => updateData({ present_address: e.target.value })}
            ></textarea>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">স্থায়ী ঠিকানা <span className="text-red-500">*</span></label>
            <textarea 
              required
              value={data.permanent_address || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary min-h-25"
              onChange={(e) => updateData({ permanent_address: e.target.value })}
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">পেশা (Occupation) <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              value={data.occupation || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
              onChange={(e) => updateData({ occupation: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">কর্মস্থল (Workplace)</label>
            <input 
              type="text" 
              value={data.workplace || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
              placeholder="e.g. Google, Microsoft, Self-Employed"
              onChange={(e) => updateData({ workplace: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">শিক্ষা প্রতিষ্ঠান (বর্তমান/শেষ)</label>
            <input 
              type="text" 
              value={data.current_institution || ''}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
              onChange={(e) => updateData({ current_institution: e.target.value })}
            />
          </div>

        </div>

        <div className="flex justify-end pt-12 border-t border-gray-100">
          <button 
            type="submit"
            className="w-full sm:w-auto px-16 py-5 rounded-2xl bg-primary text-white font-black hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
          >
            পরবর্তী ধাপ (Next)
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}
