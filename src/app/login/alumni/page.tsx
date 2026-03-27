"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import { Lock, ArrowRight, ShieldCheck, User, Calendar } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useNotification } from "@/lib/contexts/NotificationContext"

export default function AlumniLogin() {
  const [alumniNumber, setAlumniNumber] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const { notify } = useNotification()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('registrants')
        .select('*')
        .or(`alumni_number.eq.${alumniNumber},mobile.eq.${alumniNumber}`)
        .eq('dob', dob)
        .single()

      if (error || !data) throw new Error("অবৈধ অ্যালুমনাই নম্বর বা জন্মতারিখ।")
      
      // Set a session cookie
      document.cookie = `alumni_session=${data.alumni_number}; path=/; max-age=86400`
      window.location.href = `/profile`
    } catch (error: any) {
      notify(error.message || "লগইন ব্যর্থ হয়েছে।", 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-16 bg-[#FAFAF7] relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1F3D2B] rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CEB888] rounded-full filter blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <Image 
                  src="/images/logo.png" 
                  alt="HCS Logo" 
                  width={80} 
                  height={80} 
                  className="w-20 h-20 object-contain drop-shadow-sm"
                />
              </div>
              <h1 className="text-3xl font-black text-primary mb-3 tracking-tight">অ্যালুমনাই লগইন</h1>
              <p className="text-muted text-sm font-bold uppercase tracking-widest text-[10px]">Access Your Formal Profile</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">মোবাইল নম্বর (Mobile Number)</label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CEB888]" />
                  <input 
                    type="text" 
                    required
                    value={alumniNumber}
                    onChange={(e) => setAlumniNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all placeholder:text-muted/50 outline-none text-primary font-bold tracking-widest uppercase" 
                    placeholder="017XXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary">জন্মতারিখ (Birthday)</label>
                  <Link href="/login/forgot-credentials" className="text-[10px] text-muted hover:text-primary transition-colors font-bold uppercase tracking-widest underline decoration-[#CEB888] underline-offset-4 pointer-events-auto relative z-20 block">পাসওয়ার্ড ভুলে গেছেন?</Link>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                   <select 
                    required
                    className="bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold text-primary text-xs outline-none"
                    onChange={(e) => {
                      const parts = dob.split('-')
                      setDob(`${e.target.value}-${parts[1] || ''}-${parts[2] || ''}`)
                    }}
                   >
                     <option value="">Day</option>
                     {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(d => <option key={d} value={d}>{d}</option>)}
                   </select>

                   <select 
                    required
                    className="bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold text-primary text-xs outline-none"
                    onChange={(e) => {
                      const parts = dob.split('-')
                      setDob(`${parts[0] || ''}-${e.target.value}-${parts[2] || ''}`)
                    }}
                   >
                     <option value="">Month</option>
                     {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m} value={m}>{m}</option>)}
                   </select>

                   <select 
                    required
                    className="bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold text-primary text-xs outline-none"
                    onChange={(e) => {
                      const parts = dob.split('-')
                      setDob(`${parts[0] || ''}-${parts[1] || ''}-${e.target.value}`)
                    }}
                   >
                     <option value="">Year</option>
                     {Array.from({ length: 2026 - 1940 + 1 }, (_, i) => (2026 - i).toString()).map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#1F3D2B] text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 text-sm tracking-widest uppercase disabled:opacity-50"
              >
                {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center space-y-4">
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest">
                আপনার কি এখনো একাউন্ট নেই? 
                <Link href="/registration" className="text-primary hover:text-[#CEB888] transition-colors ml-2 inline-flex items-center gap-1">
                  Registration
                  <ArrowRight size={14} />
                </Link>
              </p>
              
              <Link href="/login/admin" className="block text-[10px] font-bold uppercase tracking-widest text-[#CEB888] hover:text-[#1F3D2B] transition-colors underline underline-offset-4">
                Institutional Admin Access
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-[10px] font-black tracking-widest text-primary uppercase">SSL Secured Connection</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
