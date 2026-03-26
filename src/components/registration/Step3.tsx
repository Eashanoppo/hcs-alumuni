"use client"

import { useRegistration } from "./RegistrationContext"
import { ArrowRight, ArrowLeft, Phone, Mail, MessageSquare } from "lucide-react"

export default function Step3() {
  const { nextStep, prevStep, updateData, data } = useRegistration()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-primary mb-2">যোগাযোগের তথ্য (Contact Information)</h2>
        <p className="text-muted text-sm italic">অনুগ্রহ করে আপনার যোগাযোগের নম্বরটি সচল রাখুন।</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary">মোবাইল ফোন নম্বর <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                required
                type="tel" 
                className="w-full bg-background border-none rounded-xl p-3 pl-12 focus:ring-2 focus:ring-accent transition-all"
                placeholder="01712xxxxxx"
                onChange={(e) => updateData({ mobile: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary">ইমেইল এড্রেস <span className="text-red-500">*</span></label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                required
                type="email" 
                className="w-full bg-background border-none rounded-xl p-3 pl-12 focus:ring-2 focus:ring-accent transition-all"
                placeholder="email@example.com"
                onChange={(e) => updateData({ email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary">হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)</label>
            <div className="relative">
              <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="tel" 
                className="w-full bg-background border-none rounded-xl p-3 pl-12 focus:ring-2 focus:ring-accent transition-all"
                placeholder="01712xxxxxx"
                value={data.whatsapp || ''}
                onChange={(e) => updateData({ whatsapp: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary">ফেসবুক প্রোফাইল লিংক (ঐচ্ছিক)</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="url" 
                className="w-full bg-background border-none rounded-xl p-3 pl-12 focus:ring-2 focus:ring-accent transition-all"
                placeholder="https://facebook.com/profile"
                value={data.facebook_url || ''}
                onChange={(e) => updateData({ facebook_url: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary">ইনস্টাগ্রাম প্রোফাইল লিংক (ঐচ্ছিক)</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="url" 
                className="w-full bg-background border-none rounded-xl p-3 pl-12 focus:ring-2 focus:ring-accent transition-all"
                placeholder="https://instagram.com/profile"
                value={data.instagram_url || ''}
                onChange={(e) => updateData({ instagram_url: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
          <button 
            type="button"
            onClick={prevStep}
            className="w-full sm:w-auto px-10 py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            পূর্ববর্তী ধাপ (Back)
          </button>
          <button 
            type="submit"
            className="w-full sm:w-auto px-12 py-4 rounded-xl bg-primary text-white font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            পরবর্তী ধাপ (Next)
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}
