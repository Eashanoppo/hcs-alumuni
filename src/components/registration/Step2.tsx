"use client"

import { useRegistration } from "./RegistrationContext"
import { ArrowRight, ArrowLeft, GraduationCap, School, Upload, Image as ImageIcon } from "lucide-react"
import { useState } from "react"

export default function Step2() {
  const { nextStep, prevStep, updateData, data } = useRegistration()
  const [uploading, setUploading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  const years = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => (2026 - i).toString())
  const admissionClasses = ["Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  const leavingClasses = ["KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  const sscBatches = Array.from({ length: 2026 - 2009 + 1 }, (_, i) => (2026 - i).toString())

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const { uploadToCloudinary } = await import("@/lib/cloudinary")
      const url = await uploadToCloudinary(file)
      updateData({ school_photo_url: url })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Photo upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8 md:p-16 bg-white rounded-[2.5rem] shadow-premium border border-gray-100">
      <div className="mb-14 text-center sm:text-left">
        <h2 className="text-3xl font-black text-primary mb-3 tracking-tighter">একাডেমিক তথ্য (Academic Information)</h2>
        <p className="text-muted text-lg font-medium italic">আপনার স্কুল জীবনের সঠিক তথ্য প্রদান করুন।</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {/* Admission info */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-primary uppercase tracking-widest">ভর্তি বছর (Admission Year) <span className="text-red-500">*</span></label>
            <select 
              required
              value={data.admission_year || ""}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              onChange={(e) => updateData({ admission_year: e.target.value })}
            >
              <option value="">বছর নির্বাচন করুন</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-black text-primary uppercase tracking-widest">কোন শ্রেণিতে ভর্তি হয়েছেন <span className="text-red-500">*</span></label>
            <select 
              required
              value={data.admission_class || ""}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              onChange={(e) => updateData({ admission_class: e.target.value })}
            >
              <option value="">শ্রেণি নির্বাচন করুন</option>
              {admissionClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Leaving info */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-primary uppercase tracking-widest">স্কুল ছাড়ার বছর (Leaving Year) <span className="text-red-500">*</span></label>
            <select 
              required
              value={data.leaving_year || ""}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              onChange={(e) => updateData({ leaving_year: e.target.value })}
            >
              <option value="">বছর নির্বাচন করুন</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-black text-primary uppercase tracking-widest">কোন শ্রেণীতে ছেড়েছেন <span className="text-red-500">*</span></label>
            <select 
              required
              value={data.leaving_class || ""}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              onChange={(e) => updateData({ leaving_class: e.target.value })}
            >
              <option value="">শ্রেণি নির্বাচন করুন</option>
              {leavingClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Certificate info */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-primary uppercase tracking-widest">সর্বশেষ সার্টিফিকেট <span className="text-red-500">*</span></label>
            <select 
              required
              value={data.certificate || ""}
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              onChange={(e) => updateData({ certificate: e.target.value as any })}
            >
              <option value="">সার্টিফিকেট নির্বাচন করুন</option>
              <option value="PESC">PESC (Class-5)</option>
              <option value="JSC">JSC (Class-8)</option>
              <option value="SSC">SSC</option>
            </select>
          </div>

          {/* Conditional SSC Batch */}
          {data.certificate === 'SSC' && (
            <div className="space-y-3">
              <label className="block text-sm font-black text-primary uppercase tracking-widest">SSC Batch <span className="text-red-500">*</span></label>
              <select 
                required
                value={data.ssc_batch || ""}
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                onChange={(e) => updateData({ ssc_batch: e.target.value })}
              >
                <option value="">ব্যাচ নির্বাচন করুন</option>
                {sscBatches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* School-time Photo Upload */}
        <div className="space-y-6 pt-6">
          <label className="block text-sm font-black text-primary uppercase tracking-widest">স্কুলে থাকাকালীন কোনো ছবি (ঐচ্ছিক)</label>
          <div className="group relative border-2 border-dashed border-gray-200 rounded-[2rem] p-12 transition-all hover:border-primary hover:bg-[#FAFAF7] flex flex-col items-center justify-center text-center cursor-pointer">
            {data.school_photo_url ? (
               <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img src={data.school_photo_url} alt="School life" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <p className="text-white text-xs font-bold">Change Photo</p>
                  </div>
               </div>
            ) : (
              <>
                <div className={`w-20 h-20 rounded-full ${uploading ? 'bg-gray-100' : 'bg-primary/5 text-primary'} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  {uploading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> : <ImageIcon size={36} />}
                </div>
                <h3 className="text-xl font-black text-primary mb-2">পুরানো স্মৃতি শেয়ার করুন</h3>
                <p className="text-muted font-bold text-sm">JPG বা PNG সর্বোচ্চ ৫ মেগাবাইট</p>
              </>
            )}
            <input 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-50">
          <button 
            type="button"
            onClick={prevStep}
            className="w-full sm:w-auto px-12 py-5 rounded-2xl border-2 border-primary/10 text-primary font-black hover:bg-primary/5 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={20} />
            পূর্ববর্তী ধাপ
          </button>
          <button 
            type="submit"
            className="w-full sm:w-auto px-16 py-5 rounded-2xl bg-primary text-white font-black hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
          >
            পরবর্তী ধাপ
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}
