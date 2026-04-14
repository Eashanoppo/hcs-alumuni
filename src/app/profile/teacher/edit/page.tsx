"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Camera, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { TeacherRecord, updateTeacherProfile, getTeacherById } from "@/lib/teacher-db"
import { useNotification } from "@/lib/contexts/NotificationContext"
import { uploadToCloudinary } from "@/lib/cloudinary"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function TeacherEditPage() {
  const { notify } = useNotification()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<TeacherRecord | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        // In a real app, this would come from a secure session/cookie
        // For now, mirroring the logic in TeacherProfilePage
        const teacherId = document.cookie
          .split("; ")
          .find(row => row.startsWith("teacher_session="))
          ?.split("=")[1];

        if (!teacherId || teacherId === "undefined" || teacherId === "null") {
          router.push("/login/teachers")
          return
        }

        const t = await getTeacherById(teacherId)
        if (!t) {
          router.push("/login/teachers")
          return
        }
        
        // Ensure education is an array
        if (typeof t.education === 'string') {
          t.education = JSON.parse(t.education);
        }
        if (!t.education) t.education = [];

        setData(t)
      } catch (err) {
        console.error(err)
        notify("ডেটা লোড করতে ব্যর্থ হয়েছে", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchTeacher()
  }, [router, notify])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setSaving(true)
    try {
      // We allow editing most fields. 
      // Protect sensitive system fields if necessary, but user asked for "all"
      const { id, created_at, updated_at, status, ...updates } = data as any
      await updateTeacherProfile(data.id!, updates)
      notify("প্রোফাইল সফলভাবে আপডেট করা হয়েছে", "success")
      router.push("/profile/teacher")
    } catch (err: any) {
      notify("আপডেট করতে ব্যর্থ হয়েছে: " + err.message, "error")
    } finally {
      setSaving(false)
    }
  }

  const toggleActivity = (activity: string) => {
    if (!data) return
    const current = data.activities || []
    if (current.includes(activity)) {
      setData({ ...data, activities: current.filter(a => a !== activity) })
    } else {
      setData({ ...data, activities: [...current, activity] })
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !data) return
    try {
      setUploading(true)
      const url = await uploadToCloudinary(file)
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          photo_url: url as string
        } as TeacherRecord;
      });
      notify("ছবি আপলোড হয়েছে", "success")
    } catch (err) {
      notify("ছবি আপলোড করতে ব্যর্থ হয়েছে", "error")
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  )

  if (!data) return null

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-6 mb-10">
          <Link href="/profile/teacher" className="p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all shadow-sm">
            <ArrowLeft size={20} className="text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">এডিট প্রোফাইল</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#CEB888] mt-1">ব্যক্তিগত ও পেশাগত তথ্য আপডেট করুন</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Photo Section */}
          <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-100 flex flex-col items-center">
             <div className="relative w-40 h-40 mb-6">
               <div className="w-full h-full rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
                 {data.photo_url ? (
                   <img src={data.photo_url} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <Camera className="text-gray-300" size={48} />
                 )}
                 {uploading && (
                   <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                     <Loader2 className="animate-spin text-primary" size={32} />
                   </div>
                 )}
               </div>
               <label className="absolute -bottom-2 -right-2 p-4 bg-primary text-white rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-all border-4 border-white">
                 <Camera size={20} />
                 <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
               </label>
             </div>
             <h4 className="text-[10px] font-black uppercase text-muted tracking-widest">আপনার ছবি পরিবর্তন করুন</h4>
          </div>

          {/* Core Info */}
          <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest col-span-full border-b border-gray-50 pb-4">ব্যক্তিগত ও পেশাগত তথ্য (General Details)</h3>
            
            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">পূর্ণ নাম (বাংলায়)</label>
              <input 
                value={data.full_name_bn || ""} 
                onChange={e => setData({...data, full_name_bn: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">Full Name (English)</label>
              <input 
                value={data.full_name_en || ""} 
                onChange={e => setData({...data, full_name_en: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">Designation</label>
              <input 
                value={data.designation || ""} 
                onChange={e => setData({...data, designation: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">Subject</label>
              <input 
                value={data.subject || ""} 
                onChange={e => setData({...data, subject: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">স্কুলে যোগদানের তারিখ (Password)</label>
              <input 
                value={data.joining_date || ""} 
                onChange={e => setData({...data, joining_date: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none font-mono" 
                placeholder="DD/MM/YYYY"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">স্কুল ত্যাগের সাল (Leaving Year)</label>
              <input 
                value={data.leaving_year || ""} 
                onChange={e => setData({...data, leaving_year: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">মোবাইল নম্বর (Login ID)</label>
              <input 
                value={data.mobile || ""} 
                onChange={e => setData({...data, mobile: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none font-mono" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">Facebook URL</label>
              <input 
                value={data.facebook_url || ""} 
                onChange={e => setData({...data, facebook_url: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
                placeholder="https://facebook.com/your-profile"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">বর্তমান পেশা (Current Occupation)</label>
              <input 
                value={data.current_occupation || ""} 
                onChange={e => setData({...data, current_occupation: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">শিক্ষা প্রতিষ্ঠান / অফিস</label>
              <input 
                value={data.current_institution || ""} 
                onChange={e => setData({...data, current_institution: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">বর্তমান ঠিকানা (Present Address)</label>
              <textarea 
                rows={3} 
                value={data.present_address || ""} 
                onChange={e => setData({...data, present_address: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">ই-মেইল (Email)</label>
              <input 
                type="email" 
                value={data.email || ""} 
                onChange={e => setData({...data, email: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              />
            </div>
          </div>

          {/* Education History */}
          <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-100 space-y-8">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest">Education History (শিক্ষাগত যোগ্যতা)</h3>
              <button 
                type="button"
                onClick={() => setData({...data, education: [...(data.education || []), {level: "", institution: "", subject: ""}]})}
                className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
              >
                <Plus size={16} /> Add Degree
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {((data.education as any[]) || []).map((edu, idx) => (
                <div key={idx} className="p-8 bg-[#FAFAF7] border border-gray-100 rounded-3xl relative animate-fade-in group space-y-4">
                  <button 
                    type="button"
                    onClick={() => setData({...data, education: data.education.filter((_, i) => i !== idx)})}
                    className="absolute top-4 right-4 p-2 bg-white text-rose-500 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-rose-50 hover:bg-rose-50"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="block text-sm font-black uppercase tracking-widest text-muted ml-1">Degree Level (যেমন: বি.এস.সি)</label>
                       <input value={edu.level} onChange={e => {
                         const newEdu = [...data.education]; newEdu[idx].level = e.target.value; setData({...data, education: newEdu});
                       }} className="w-full bg-white border border-gray-100 rounded-xl p-4 text-base font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-sm font-black uppercase tracking-widest text-muted ml-1">Subject (বিষয়)</label>
                       <input value={edu.subject} onChange={e => {
                         const newEdu = [...data.education]; newEdu[idx].subject = e.target.value; setData({...data, education: newEdu});
                       }} className="w-full bg-white border border-gray-100 rounded-xl p-4 text-base font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-sm font-black uppercase tracking-widest text-muted ml-1">Institution (শিক্ষা প্রতিষ্ঠান)</label>
                       <input value={edu.institution} onChange={e => {
                         const newEdu = [...data.education]; newEdu[idx].institution = e.target.value; setData({...data, education: newEdu});
                       }} className="w-full bg-white border border-gray-100 rounded-xl p-4 text-base font-bold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!data.education || data.education.length === 0) && (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[2rem]">
                <p className="text-muted font-bold text-sm">কোন শিক্ষাগত তথ্য এখনো যোগ করা হয়নি।</p>
              </div>
            )}
          </div>

          {/* Additional Info: Activities, Note, Attendance */}
          <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-100 space-y-10">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-gray-50 pb-4">অতিরিক্ত তথ্য (Additional Info)</h3>
            
            <div className="space-y-5">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">আপনি কি রজত জয়ন্তী অনুষ্ঠানে উপস্থিত থাকতে ইচ্ছুক?</label>
              <div className="flex gap-10 ml-1">
                {['হ্যাঁ', 'না', 'সম্ভবত'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      value={opt} 
                      name="willing_to_attend" 
                      checked={data.willing_to_attend === opt} 
                      onChange={e => setData({...data, willing_to_attend: e.target.value})} 
                      className="w-6 h-6 text-primary border-gray-300 focus:ring-primary" 
                    />
                    <span className="font-bold text-lg text-primary group-hover:text-black transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">আপনি কি কি কার্যক্রমে অংশ নিতে ইচ্ছুক?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-1">
                {[
                  "প্রাক্তন শিক্ষক-শিক্ষিকাদের মিলনমেলা",
                  "স্মৃতিচারণ ও আড্ডা",
                  "সাংস্কৃতিক অনুষ্ঠান",
                  "মধ্যাহ্ন ভোজ",
                ].map((activity) => (
                  <label key={activity} className="flex items-center gap-4 cursor-pointer p-5 bg-[#FAFAF7] rounded-2xl border border-gray-100 hover:border-primary/30 transition-all">
                    <input 
                      type="checkbox" 
                      checked={(data.activities as string[] || []).includes(activity)}
                      onChange={() => toggleActivity(activity)}
                      className="w-6 h-6 rounded text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="font-bold text-base text-primary">{activity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-[0.2em] text-muted ml-1">স্মৃতিচারণ / বিশেষ বার্তা (Memory Note)</label>
              <textarea 
                rows={5} 
                value={data.memory_note || ""} 
                onChange={e => setData({...data, memory_note: e.target.value})} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-3xl p-6 font-bold text-lg leading-relaxed text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
                placeholder="স্কুল সম্পর্কে আপনার স্মৃতি বা কোনো বার্তা লিখুন..."
              />
            </div>
          </div>

          {/* Submission */}
          <div className="flex justify-end gap-4">
            <Link href="/profile/teacher" className="px-10 py-5 bg-white border border-gray-200 text-muted rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={saving}
              className="px-12 py-5 bg-[#1F3D2B] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Changes
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
