"use client"

import { useRegistration } from "./RegistrationContext"
import { ArrowLeft, CheckCircle2, Edit3, User, School, Phone, Users, Camera, FileText, Loader2, Image as ImageIcon } from "lucide-react"
import { useState } from "react"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { submitRegistration } from "@/lib/db"

export default function Step5() {
  const { prevStep, data, setStep, updateData } = useRegistration()

  const [uploading, setUploading] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [sscCert, setSscCert] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let photo_url = data.photo_url
      let ssc_cert_url = data.certificate_url

      if (photo) {
        photo_url = await uploadToCloudinary(photo)
      }
      
      if (sscCert) {
        ssc_cert_url = await uploadToCloudinary(sscCert)
      }

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const yearStr = data.ssc_batch || data.leaving_year || new Date().getFullYear().toString();
      const alumni_number = `HCS-${yearStr}-${randomDigits}`;

      const finalData = { 
        ...data, 
        photo_url,
        certificate_url: ssc_cert_url,
        alumni_number
      }

      const result = await submitRegistration(finalData)
      updateData({ id: result.id })
      
      alert("আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে! পেমেন্ট পেজে রিডাইরেক্ট করা হচ্ছে...")
      window.location.href = "/registration/payment"
    } catch (error) {
      console.error('Submission failed:', error)
      alert('রেজিস্ট্রেশন ব্যর্থ হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।')
    } finally {
      setUploading(false)
    }
  }

  const ReviewSection = ({ title, icon, step, children }: { title: string, icon: React.ReactNode, step: number, children: React.ReactNode }) => (
    <div className="bg-white rounded-3xl p-8 relative group border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <button 
        onClick={() => setStep(step)}
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-muted hover:text-primary transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
      >
        <Edit3 size={14} />
        Edit
      </button>
      <div className="flex items-center gap-4 mb-6 text-primary">
        <div className="p-3 rounded-2xl bg-primary/5">
          {icon}
        </div>
        <h3 className="text-xl font-black tracking-tight italic">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  )

  const InfoItem = ({ label, value }: { label: string, value?: string | number | boolean }) => (
    <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-gray-100/50">
      <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="font-bold text-primary break-words">{value?.toString() || '—'}</p>
    </div>
  )

  return (
    <div className="p-8 md:p-16 bg-white rounded-[2.5rem] shadow-premium border border-gray-100">
      <div className="mb-14 text-center sm:text-left">
        <h2 className="text-3xl font-black text-primary mb-3 tracking-tighter">তথ্য যাচাই (Review & Submit)</h2>
        <p className="text-muted text-lg font-medium italic">রেজিস্ট্রেশন চূড়ান্ত করার আগে আপনার তথ্যগুলো পুনরায় যাচাই করে নিন।</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <ReviewSection title="ব্যক্তিগত তথ্য" icon={<User size={22} />} step={1}>
          <InfoItem label="নাম (বাংলা)" value={data.full_name_bn} />
          <InfoItem label="Name (English)" value={data.full_name_en} />
          <InfoItem label="পিতার নাম" value={data.father_name} />
          <InfoItem label="মাতার নাম" value={data.mother_name} />
          <InfoItem label="পেশা" value={data.occupation} />
          <InfoItem label="কর্মস্থল" value={data.workplace} />
          <InfoItem label="শিক্ষা প্রতিষ্ঠান" value={data.current_institution} />
        </ReviewSection>

        <ReviewSection title="একাডেমিক তথ্য" icon={<School size={22} />} step={2}>
          <InfoItem label="ভর্তি বছর ও শ্রেণি" value={`${data.admission_year || '—'} (Class: ${data.admission_class || '—'})`} />
          <InfoItem label="ছাড়ার বছর ও শ্রেণি" value={`${data.leaving_year || '—'} (Class: ${data.leaving_class || '—'})`} />
          <InfoItem label="সার্টিফিকেট" value={data.certificate} />
          {data.certificate === 'SSC' && <InfoItem label="SSC Batch" value={data.ssc_batch} />}
          <InfoItem label="হাউস" value={data.house} />
        </ReviewSection>

        <ReviewSection title="যোগাযোগ" icon={<Phone size={22} />} step={3}>
          <InfoItem label="মোবাইল" value={data.mobile} />
          <InfoItem label="ইমেইল" value={data.email} />
          <InfoItem label="হোয়াটসঅ্যাপ" value={data.whatsapp} />
          <InfoItem label="ফেসবুক" value={data.facebook_url} />
          <InfoItem label="ইনস্টাগ্রাম" value={data.instagram_url} />
        </ReviewSection>

        <ReviewSection title="অংশগ্রহণ ও অন্যান্য" icon={<Users size={22} />} step={4}>
          <InfoItem label="উপস্থিত থাকবেন?" value={data.attending ? 'হ্যাঁ' : 'না'} />
          <InfoItem label="টি-শার্ট সাইজ" value={data.tshirt_size} />
          <InfoItem label="গেস্ট সংখ্যা" value={data.guests_count} />
          <InfoItem label="শিশুর সংখ্যা" value={data.children_count} />
        </ReviewSection>

        {/* Media Previews */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
          <div className="space-y-4">
             <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-2">প্রোফাইল ফটো (Update)</label>
             <div className="relative border-2 border-dashed border-gray-100 rounded-[2rem] p-4 text-center hover:border-primary transition-all cursor-pointer bg-[#FAFAF7] group h-[180px] flex items-center justify-center overflow-hidden">
                <input type="file" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" />
                {photo ? (
                  <img src={URL.createObjectURL(photo)} alt="New" className="absolute inset-0 w-full h-full object-cover z-10" />
                ) : data.photo_url ? (
                  <img src={data.photo_url} alt="Existing" className="absolute inset-0 w-full h-full object-cover z-10 shadow-inner" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                     <Camera className="text-muted group-hover:text-primary" size={28} />
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest">Add Photo</span>
                  </div>
                )}
                {(photo || data.photo_url) && (
                  <div className="absolute top-2 right-2 z-30 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle2 size={16} />
                  </div>
                )}
             </div>
          </div>
          
          <div className="space-y-4">
             <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-2">সার্টিফিকেট (Update)</label>
             <div className="relative border-2 border-dashed border-gray-100 rounded-[2rem] p-4 text-center hover:border-primary transition-all cursor-pointer bg-[#FAFAF7] group h-[180px] flex items-center justify-center overflow-hidden">
                <input type="file" onChange={(e) => setSscCert(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept=".pdf,image/*" />
                {sscCert ? (
                  <div className="absolute inset-0 w-full h-full bg-emerald-50 flex items-center justify-center z-10">
                     <FileText className="text-emerald-500" size={48} />
                     <p className="absolute bottom-4 text-[10px] font-black uppercase text-emerald-600 px-4 line-clamp-1">{sscCert.name}</p>
                  </div>
                ) : data.certificate_url ? (
                  <img src={data.certificate_url} alt="Cert" className="absolute inset-0 w-full h-full object-cover z-10 opacity-50" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                     <FileText className="text-muted group-hover:text-primary" size={28} />
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest">Add Certificate</span>
                  </div>
                )}
                {(sscCert || data.certificate_url) && (
                  <div className="absolute top-2 right-2 z-30 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle2 size={16} />
                  </div>
                )}
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-2">স্কুল-লাইফ ফটো (Preview)</label>
             <div className="h-[180px] border-2 border-solid border-gray-100 rounded-[2rem] p-2 bg-white flex items-center justify-center overflow-hidden relative">
                {data.school_photo_url ? (
                  <img src={data.school_photo_url} alt="Pre-uploaded" className="h-full w-full object-cover rounded-[1.5rem]" />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-20">
                     <ImageIcon size={48} />
                     <span className="text-[10px] font-bold text-muted italic">No memory shared</span>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-100">
        <button 
          onClick={prevStep}
          className="w-full sm:w-auto px-12 py-5 rounded-2xl border-2 border-primary/10 text-primary font-black hover:bg-primary/5 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={20} />
          পূর্ববর্তী ধাপ
        </button>
        <button 
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full sm:w-auto px-16 py-5 rounded-2xl bg-primary text-white font-black hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? <Loader2 className="animate-spin" /> : (
            <>
              চূড়ান্ত জমা দিন
              <CheckCircle2 size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
