"use client"

import { useTeacherRegistration } from "./TeacherRegistrationContext"
import { ArrowLeft, ArrowRight } from "lucide-react"
import TeacherStepper from "./TeacherStepper"

export default function TeacherStep3() {
  const { data, updateData, currentStep, setCurrentStep } = useTeacherRegistration()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.consent) {
      alert("অনুগ্রহ করে সম্মতি প্রদান করুন।")
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const toggleActivity = (activity: string) => {
    const current = data.activities || []
    if (current.includes(activity)) {
      updateData({ activities: current.filter(a => a !== activity) })
    } else {
      updateData({ activities: [...current, activity] })
    }
  }

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-fade-in">
      <TeacherStepper />
      <div className="space-y-6">
        <h3 className="text-sm font-black text-primary tracking-widest uppercase">ঘ. রজত জয়ন্তী অনুষ্ঠানে অংশগ্রহণ</h3>
        
        <div className="space-y-5">
          <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">১০. আপনি কি রজত জয়ন্তী অনুষ্ঠানে উপস্থিত থাকতে ইচ্ছুক? <span className="text-red-500">*</span></label>
          <div className="flex gap-8 ml-1">
            {['হ্যাঁ', 'না', 'সম্ভবত'].map(opt => (
              <label key={opt} className="flex items-center gap-4 cursor-pointer">
                <input required type="radio" value={opt} name="willing_to_attend" checked={data.willing_to_attend === opt} onChange={e => updateData({ willing_to_attend: e.target.value })} className="w-6 h-6 text-primary border-gray-300 focus:ring-primary" />
                <span className="font-bold text-lg text-primary">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">১১. আপনি কোন কোন কার্যক্রমে অংশ নিতে আগ্রহী?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-1">
            {[
              "প্রাক্তন শিক্ষক-শিক্ষিকাদের মিলনমেলা",
              "স্মৃতিচারণ ও আড্ডা",
              "সাংস্কৃতিক অনুষ্ঠান",
              "মধ্যাহ্ন ভোজ",
            ].map((activity) => (
              <label key={activity} className="flex items-center gap-4 cursor-pointer p-5 bg-[#FAFAF7] rounded-xl border border-gray-100 hover:border-[#1F3D2B]/30 transition-all">
                <input 
                  type="checkbox" 
                  checked={(data.activities || []).includes(activity)}
                  onChange={() => toggleActivity(activity)}
                  className="w-6 h-6 rounded text-[#1F3D2B] border-gray-300 focus:ring-[#1F3D2B]"
                />
                <span className="font-bold text-lg text-primary">{activity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-gray-100 space-y-6">
        <h3 className="text-sm font-black text-primary tracking-widest uppercase">ঙ. স্মৃতিচারণ (ঐচ্ছিক)</h3>
        
        <div className="space-y-3">
          <label className="block text-sm font-black uppercase tracking-[0.2em] text-primary ml-1">১২. হলি ক্রিসেন্ট স্কুল সম্পর্কে আপনার স্মৃতি / অনুভূতি / বার্তা</label>
          <textarea rows={5} value={data.memory_note || ""} onChange={e => updateData({ memory_note: e.target.value })} className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-6 font-bold text-lg tracking-wide text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none" placeholder="সংক্ষেপে আপনার স্মৃতি বা অনুভুতি লিখুন..." />
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-gray-100 space-y-6">
        <h3 className="text-sm font-black text-primary tracking-widest uppercase">চ. সম্মতি</h3>
        
        <label className="flex items-start gap-5 cursor-pointer p-8 bg-amber-50/50 rounded-3xl border border-amber-100 hover:bg-amber-50 transition-all">
          <input required type="checkbox" checked={data.consent || false} onChange={e => updateData({ consent: e.target.checked })} className="mt-1 w-6 h-6 rounded text-[#1F3D2B] border-gray-300 focus:ring-[#1F3D2B]" />
          <p className="font-bold text-lg text-primary leading-relaxed">
            আমি ঘোষণা করছি যে উপরের প্রদত্ত তথ্য আমার সর্বোচ্চ জ্ঞানে সত্য। রজত জয়ন্তী অনুষ্ঠান ও স্মরণিকা সংশ্লিষ্ট প্রয়োজনে এই তথ্য ব্যবহারে আমার সম্মতি রয়েছে।
          </p>
        </label>
      </div>

      <div className="pt-6 flex justify-between">
        <button type="button" onClick={handlePrev} className="px-10 py-5 bg-[#FAFAF7] text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200 flex items-center justify-center gap-3">
          <ArrowLeft size={20} /> Back
        </button>
        <button type="submit" className="px-10 py-5 bg-[#1F3D2B] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
          Review Application <ArrowRight size={20} />
        </button>
      </div>
    </form>
  )
}
