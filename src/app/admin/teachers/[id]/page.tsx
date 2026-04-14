"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Award, Mail, Phone, MapPin, Link as LinkIcon, Briefcase, GraduationCap, Star, ClipboardList, Trash2, Plus, X, User } from "lucide-react"
import { adminUpdateTeacher, adminGetTeacherByIdForAdmin } from "@/app/actions/teacher-admin"
import { useNotification } from "@/lib/contexts/NotificationContext"
import { uploadToCloudinary } from "@/lib/cloudinary"

export default function AdminTeacherDetails() {
  const { id } = useParams()
  const router = useRouter()
  const { notify } = useNotification()
  
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const updateData = (updates: any) => {
    setData((prev: any) => (prev ? { ...prev, ...updates } : null))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !data) return
    try {
      setUploading(true)
      const url = await uploadToCloudinary(file)
      setData((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          photo_url: url as string
        };
      });
      notify("ছবি আপলোড হয়েছে", "success")
    } catch (err) {
      notify("ছবি আপলোড করতে ব্যর্থ হয়েছে", "error")
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const t = await adminGetTeacherByIdForAdmin(id as string)
        if (!t) throw new Error("Not found")
        setData(t)
      } catch (err: any) {
        console.error(err)
        notify("Failed to fetch teacher details", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchTeacher()
  }, [id, notify])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Filter out meta fields but include everything else
      const { id: _, created_at, updated_at, ...updatePayload } = data
      const success = await adminUpdateTeacher(id as string, updatePayload)
      if (success) {
        notify("Teacher details updated successfully", "success")
        router.push("/admin/teachers")
      } else {
        throw new Error("Update failed")
      }
    } catch (err: any) {
      notify(err.message || "Failed to update", "error")
    } finally {
      setSaving(false)
    }
  }

  const addEducation = () => {
    const education = [...(data.education || []), { level: "", institution: "", subject: "" }]
    setData({ ...data, education })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const education = [...(data.education || [])]
    education[index] = { ...education[index], [field]: value }
    setData({ ...data, education })
  }

  const removeEducation = (index: number) => {
    const education = [...(data.education || [])]
    education.splice(index, 1)
    setData({ ...data, education })
  }

  const toggleActivity = (activity: string) => {
    const activities = [...(data.activities || [])]
    if (activities.includes(activity)) {
      setData({ ...data, activities: activities.filter(a => a !== activity) })
    } else {
      setData({ ...data, activities: [...activities, activity] })
    }
  }

  const addCustomActivity = (val: string) => {
    if (!val.trim()) return
    const activities = [...(data.activities || [])]
    if (!activities.includes(val)) {
      setData({ ...data, activities: [...activities, val.trim()] })
    }
  }

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div>
  if (!data) return <div className="p-20 text-center text-rose-500 font-bold">Teacher not found.</div>

  const displayName = data.full_name_en || data.full_name_bn || data.full_name || ""

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <header className="bg-white border-b border-gray-100 py-6 px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/teachers" className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
              <ArrowLeft size={20} className="text-primary" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Edit Teacher</h1>
              <p className="text-xs font-bold text-muted mt-1 uppercase tracking-widest">{displayName}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Founder & Guide */}
          <div className="bg-gradient-to-r from-amber-50 to-[#CEB888]/10 p-8 rounded-3xl border border-[#CEB888]/20 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-black text-[#8A7A5A] uppercase tracking-widest mb-6 flex items-center gap-3">
                <Award size={20} /> Our Founder & Guide Module
              </h3>
              <div className="space-y-6">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={data.is_founder_guide || false} 
                    onChange={e => setData({...data, is_founder_guide: e.target.checked})}
                    className="w-6 h-6 text-[#CEB888] border-gray-300 rounded focus:ring-[#CEB888]" 
                  />
                  <div>
                    <span className="font-black text-primary text-lg">Mark as "Founder & Guide"</span>
                    <p className="text-xs font-bold text-muted mt-1">This pins the teacher at the top of the directory with a gold banner.</p>
                  </div>
                </label>
                
                {data.is_founder_guide && (
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8A7A5A]">Founder Note (Displayed on profile & card)</label>
                    <textarea 
                      rows={3} 
                      value={data.founder_guide_note || ""} 
                      onChange={e => setData({...data, founder_guide_note: e.target.value})}
                      className="w-full bg-white border border-[#CEB888]/30 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-[#CEB888]/20"
                      placeholder="e.g. He is the visionary architect who laid the foundation..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* General Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest col-span-full border-b border-gray-50 pb-4 flex items-center gap-3">
              <User size={18} /> General Details
            </h3>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Full Name (English)</label>
              <input value={data.full_name_en || ""} onChange={e => setData({...data, full_name_en: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">পূর্ণ নাম (বাংলায়)</label>
              <input value={data.full_name_bn || ""} onChange={e => setData({...data, full_name_bn: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Designation</label>
              <input value={data.designation || ""} onChange={e => setData({...data, designation: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Subject</label>
              <input value={data.subject || ""} onChange={e => setData({...data, subject: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Joining Date (DD/MM/YYYY)</label>
              <input value={data.joining_date || ""} onChange={e => setData({...data, joining_date: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary font-mono focus:ring-2 focus:ring-primary/5 outline-none" placeholder="e.g. 01/09/1995" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Leaving Year</label>
              <input value={data.leaving_year || ""} onChange={e => setData({...data, leaving_year: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Teacher ID</label>
              <input value={data.teacher_id || ""} onChange={e => setData({...data, teacher_id: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary font-mono focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">URL Slug</label>
              <input value={data.slug || ""} onChange={e => setData({...data, slug: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary font-mono text-sm focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3 col-span-full">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Status</label>
              <select value={data.status || ""} onChange={e => setData({...data, status: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none appearance-none">
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest col-span-full border-b border-gray-50 pb-4 flex items-center gap-3">
              <Phone size={18} /> Contact Information
            </h3>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Mobile Number (Login ID)</label>
              <input value={data.mobile || ""} onChange={e => setData({...data, mobile: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary font-mono focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Email Address</label>
              <input type="email" value={data.email || ""} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Facebook Profile URL</label>
              <input value={data.facebook_url || ""} onChange={e => setData({...data, facebook_url: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>

            <div className="space-y-3 col-span-full">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Present Address</label>
              <textarea rows={3} value={data.present_address || ""} onChange={e => setData({...data, present_address: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" />
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest col-span-full border-b border-gray-50 pb-4 flex items-center gap-3">
              <Briefcase size={18} /> Professional Information
            </h3>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Current Occupation</label>
              <input 
                required={!!(data.leaving_year && data.leaving_year !== "Present")} 
                value={data.current_occupation || ""} 
                onChange={e => updateData({ current_occupation: e.target.value })} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary tracking-wide focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
                placeholder="যেমন: অবসরপ্রাপ্ত / অন্য প্রতিষ্ঠানের শিক্ষক" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Current Institution</label>
              <input 
                required={!!(data.leaving_year && data.leaving_year !== "Present")} 
                value={data.current_institution || ""} 
                onChange={e => updateData({ current_institution: e.target.value })} 
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary tracking-wide focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
                placeholder="প্রতিষ্ঠানের নাম লিখুন" 
              />
            </div>

            <div className="space-y-3 col-span-full">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Memory / Short Note</label>
              <textarea rows={4} value={data.memory_note || ""} onChange={e => setData({...data, memory_note: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" placeholder="Memories of HCS..." />
            </div>

            <div className="space-y-3 col-span-full">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted">Willing to attend Silver Jubilee?</label>
              <select value={data.willing_to_attend || ""} onChange={e => setData({...data, willing_to_attend: e.target.value})} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none appearance-none">
                <option value="হ্যাঁ">হ্যাঁ (Yes)</option>
                <option value="না">না (No)</option>
                <option value="নিশ্চিত নই">নিশ্চিত নই (Not Sure)</option>
              </select>
            </div>
          </div>

          {/* Education History */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-3">
                <GraduationCap size={18} /> Education History
              </h3>
              <button type="button" onClick={addEducation} className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all">
                <Plus size={14} /> Add Degree
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {((data.education as any[]) || []).map((edu, idx) => (
                <div key={idx} className="p-6 bg-[#FAFAF7] rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => removeEducation(idx)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white rounded-lg shadow-sm">
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-1">Level</label>
                      <input value={edu.level} onChange={e => updateEducation(idx, 'level', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-1">Institution</label>
                      <input value={edu.institution} onChange={e => updateEducation(idx, 'institution', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-1">Subject</label>
                      <input value={edu.subject} onChange={e => updateEducation(idx, 'subject', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-gray-50 pb-4 flex items-center gap-3">
              <ClipboardList size={18} /> Activities & Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {['পাঠদান', 'প্রশাসন', 'গবেষণা', 'সাংস্কৃতিক কর্মকাণ্ড', 'খেলাধুলা', 'সমাজসেবা', 'ভ্রমন'].map(act => (
                <button
                  key={act}
                  type="button"
                  onClick={() => toggleActivity(act)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    (data.activities || []).includes(act)
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-[#FAFAF7] text-primary/40 hover:text-primary'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add custom activity..." 
                className="flex-grow bg-[#FAFAF7] border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomActivity((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
               {((data.activities as string[]) || []).filter(a => !['পাঠদান', 'প্রশাসন', 'গবেষণা', 'সাংস্কৃতিক কর্মকাণ্ড', 'খেলাধুলা', 'সমাজসেবা', 'ভ্রমন'].includes(a)).map(act => (
                 <span key={act} className="px-3 py-1.5 bg-gray-100 text-primary rounded-lg text-[10px] font-black uppercase flex items-center gap-2">
                   {act}
                   <button type="button" onClick={() => toggleActivity(act)}><X size={12} /></button>
                 </span>
               ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Link href="/admin/teachers" className="px-8 py-4 bg-white text-muted border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="px-10 py-4 bg-[#1F3D2B] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
