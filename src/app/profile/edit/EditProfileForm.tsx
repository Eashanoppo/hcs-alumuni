"use client"

import { useState } from "react"
import { Camera, Loader2, Save, ArrowLeft, Image as ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { useNotification } from "@/lib/contexts/NotificationContext"
import { updateAlumniProfile } from "@/app/actions/profile"

export default function EditProfileForm({ profile }: { profile: any }) {
  const router = useRouter()
  const { notify } = useNotification()
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [data, setData] = useState({
    full_name_en: profile.full_name_en || "",
    full_name_bn: profile.full_name_bn || "",
    father_name: profile.father_name || "",
    mother_name: profile.mother_name || "",
    present_address: profile.present_address || "",
    permanent_address: profile.permanent_address || "",
    occupation: profile.occupation || "",
    workplace: profile.workplace || "",
    current_institution: profile.current_institution || "",
    attending: profile.attending || "yes",
    volunteer_status: profile.volunteer_status || false,
    tshirt_size: profile.tshirt_size || "M",
    email: profile.email || "",
    photo_url: profile.photo_url || ""
  })

  const [oldPhotoUrl] = useState(profile.photo_url)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadToCloudinary(file)
      setData(prev => ({ ...prev, photo_url: url }))
      notify("Photo uploaded! Remember to save changes.", "success")
    } catch (err: any) {
      notify(`Photo upload failed: ${err.message}`, "error")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await updateAlumniProfile(profile.alumni_number, data, oldPhotoUrl)
      notify("Profile updated successfully", "success")
      router.push("/profile")
      router.refresh()
    } catch (err: any) {
      notify(`Failed to update profile: ${err.message}`, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-6 mb-12">
        <Link href="/profile" className="p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all shadow-sm border border-gray-100">
          <ArrowLeft size={20} className="text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Edit Profile</h1>
          <p className="text-muted text-sm font-bold uppercase tracking-widest mt-1">Update your public details</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-50">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4">Profile Photo</label>
            <div className="relative group cursor-pointer w-32 h-32">
              <label className="block w-full h-full cursor-pointer">
                <div className="w-full h-full rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group-hover:border-primary transition-all overflow-hidden relative shadow-sm">
                  {data.photo_url ? (
                    <img src={data.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-primary font-black text-3xl">
                       {data.full_name_en.charAt(0)}
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="animate-spin text-primary" size={24} />
                    </div>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading || loading} />
              </label>
              <div className="absolute -bottom-2 -right-2 bg-primary p-2.5 rounded-xl text-white shadow-xl group-hover:scale-110 transition-transform pointer-events-none">
                <Camera size={14} />
              </div>
            </div>
            <p className="text-xs text-muted mt-4 font-medium">Click image to change. Old photo will be automatically deleted on save.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Full Name (English) <span className="text-red-500">*</span></label>
              <input required value={data.full_name_en} onChange={e => setData({...data, full_name_en: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary" />
            </div>
            <div className="space-y-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Full Name (Bangla)</label>
              <input value={data.full_name_bn} onChange={e => setData({...data, full_name_bn: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary" />
            </div>

            <div className="space-y-2 md:col-span-2 mt-4 pt-6 border-t border-gray-50">
              <h4 className="text-primary font-black uppercase tracking-widest text-xs mb-4">Contact & Location</h4>
            </div>
            
            <div className="space-y-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Email <span className="text-red-500">*</span></label>
              <input required type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary" />
            </div>
            <div className="space-y-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Mobile</label>
              <input readOnly disabled value={profile.mobile} className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 font-bold text-gray-500 cursor-not-allowed opacity-70" title="Contact numbers cannot be modified" />
            </div>

            <div className="space-y-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Present Address <span className="text-red-500">*</span></label>
              <textarea required rows={3} value={data.present_address} onChange={e => setData({...data, present_address: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary" />
            </div>
            <div className="space-y-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Permanent Address <span className="text-red-500">*</span></label>
              <textarea required rows={3} value={data.permanent_address} onChange={e => setData({...data, permanent_address: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Occupation <span className="text-red-500">*</span></label>
              <input required value={data.occupation} onChange={e => setData({...data, occupation: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary" />
            </div>
            <div className="space-y-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Workplace</label>
              <input value={data.workplace} onChange={e => setData({...data, workplace: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="block text[10px] font-black uppercase tracking-widest text-primary ml-1">Current Institution</label>
              <input value={data.current_institution} onChange={e => setData({...data, current_institution: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary" />
            </div>

            <div className="pt-6 border-t border-gray-50 mt-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1">Event Attendance <span className="text-red-500">*</span></label>
                <div className="flex flex-col gap-3 ml-1">
                  {[{label: "Yes", val: "yes"}, {label: "No", val: "no"}, {label: "Probably", val: "probably"}].map(opt => (
                    <label key={opt.val} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" value={opt.val} checked={data.attending === opt.val} onChange={e => setData({...data, attending: e.target.value})} className="w-5 h-5 text-primary border-gray-300 focus:ring-primary" />
                      <span className="font-bold text-sm text-primary">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1">Volunteer Status <span className="text-red-500">*</span></label>
                <div className="flex gap-6 ml-1">
                  {[{label: "Yes", val: true}, {label: "No", val: false}].map(opt => (
                    <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={data.volunteer_status === opt.val} onChange={() => setData({...data, volunteer_status: opt.val})} className="w-5 h-5 text-primary border-gray-300 focus:ring-primary" />
                      <span className="font-bold text-sm text-primary">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col items-end">
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">* Contact numbers, email, and DOB are locked.</p>
            <button type="submit" disabled={loading || uploading} className="px-12 py-5 bg-[#1F3D2B] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
