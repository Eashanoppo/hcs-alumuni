"use client"

import { useTeacherRegistration } from "./TeacherRegistrationContext"
import { ArrowLeft, ArrowRight } from "lucide-react"
import TeacherStepper from "./TeacherStepper"

export default function TeacherStep2() {
  const { data, updateData, currentStep, setCurrentStep } = useTeacherRegistration()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Conditional Validation: If leaving_year is filled (and not "Present"), 
    // then Professional Info (Occupation & Institution) is mandatory.
    const isRetiredOrLeft = data.leaving_year && data.leaving_year !== "Present";
    if (isRetiredOrLeft) {
      if (!data.current_occupation || !data.current_institution) {
        alert("যেহেতু আপনি স্কুলে বর্তমানে কর্মরত নন, তাই আপনার বর্তমান পেশা এবং প্রতিষ্ঠানের নাম প্রদান করা বাধ্যতামূলক।");
        return;
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-fade-in">
      <TeacherStepper />
      <div className="space-y-6">
        <h3 className="text-sm font-black text-primary tracking-widest uppercase pb-4 border-b border-gray-50">খ. যোগাযোগের তথ্য</h3>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">৬. বর্তমান ঠিকানা <span className="text-red-500">*</span></label>
            <textarea required rows={4} value={data.present_address || ""} onChange={e => updateData({ present_address: e.target.value })} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg tracking-wide text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" placeholder="Enter your full address" />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">৭. মোবাইল নম্বর (লগইনের জন্য ব্যবহৃত হবে) <span className="text-red-500">*</span></label>
            <input required type="tel" value={data.mobile || ""} onChange={e => updateData({ mobile: e.target.value })} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-xl text-primary tracking-widest focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" placeholder="017XXXXXXXX" />
            <p className="text-xs text-muted font-bold ml-1">সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন। এটি আপনার লগইন আইডি হিসেবে কাজ করবে।</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">৮. ই-মেইল (যদি থাকে)</label>
            <input type="email" value={data.email || ""} onChange={e => updateData({ email: e.target.value })} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary tracking-wider focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" placeholder="teacher@example.com" />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">ফেইসবুক প্রোফাইল লিংক (Facebook Profile URL)</label>
            <input type="url" value={data.facebook_url || ""} onChange={e => updateData({ facebook_url: e.target.value })} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" placeholder="https://facebook.com/yourprofile" />
          </div>
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-gray-100 space-y-6">
        <h3 className="text-sm font-black text-primary tracking-widest uppercase">গ. পেশাগত তথ্য (বর্তমান)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">
              ৯. বর্তমান পেশা {data.leaving_year && data.leaving_year !== "Present" && <span className="text-red-500">*</span>}
            </label>
            <input 
              required={typeof data.leaving_year === 'string' && data.leaving_year !== "" && data.leaving_year !== "Present"} 
              value={data.current_occupation || ""} 
              onChange={e => updateData({ current_occupation: e.target.value })} 
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary tracking-wide focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              placeholder="যেমন: অবসরপ্রাপ্ত / অন্য প্রতিষ্ঠানের শিক্ষক" 
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">
              বর্তমান শিক্ষা প্রতিষ্ঠান / অফিস {data.leaving_year && data.leaving_year !== "Present" && <span className="text-red-500">*</span>}
            </label>
            <input 
              required={typeof data.leaving_year === 'string' && data.leaving_year !== "" && data.leaving_year !== "Present"} 
              value={data.current_institution || ""} 
              onChange={e => updateData({ current_institution: e.target.value })} 
              className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg text-primary tracking-wide focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" 
              placeholder="প্রতিষ্ঠানের নাম লিখুন" 
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <button type="button" onClick={handlePrev} className="px-10 py-5 bg-[#FAFAF7] text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200 flex items-center justify-center gap-3">
          <ArrowLeft size={20} /> Back
        </button>
        <button type="submit" className="px-10 py-5 bg-[#1F3D2B] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
          Next Step <ArrowRight size={20} />
        </button>
      </div>
    </form>
  )
}
