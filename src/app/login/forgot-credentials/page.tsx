"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Search, ArrowRight, User, ShieldCheck, HelpCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ForgotCredentials() {
  const [name, setName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [leavingYear, setLeavingYear] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      const { data, error } = await supabase
        .from('registrants')
        .select('alumni_number, mobile, dob, full_name_en')
        .ilike('full_name_en', `%${name}%`)
        .ilike('father_name', `%${fatherName}%`)
        .eq('leaving_year', leavingYear)
        .single()

      if (error || !data) throw new Error("আপনার তথ্যের সাথে মিল পাওয়া যায়নি। দয়া করে সঠিক তথ্য দিন।")
      
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-16 bg-[#FAFAF7]">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
          <div className="h-2 bg-[#CEB888] w-full"></div>
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#1F3D2B]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <HelpCircle size={32} />
              </div>
              <h1 className="text-3xl font-black text-primary mb-3 tracking-tight">তথ্য পুনরুদ্ধার</h1>
              <p className="text-muted text-sm font-bold uppercase tracking-widest text-[10px]">Credential Recovery Portal</p>
            </div>

            {!result ? (
              <form onSubmit={handleLookup} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">আপনার নাম (Full Name - English)</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold text-primary" 
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">পিতার নাম (Father's Name)</label>
                  <input 
                    type="text" 
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-6 py-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold text-primary" 
                    placeholder="Enter your father's name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">স্কুল ছাড়ার বছর (Leaving Year)</label>
                  <input 
                    type="number" 
                    required
                    value={leavingYear}
                    onChange={(e) => setLeavingYear(e.target.value)}
                    className="w-full px-6 py-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold text-primary" 
                    placeholder="e.g. 2012"
                  />
                </div>

                {error && <p className="text-rose-600 text-xs font-bold text-center bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 text-sm tracking-widest uppercase disabled:opacity-50"
                >
                  {loading ? "অনুসন্ধান করা হচ্ছে..." : "তথ্য চেক করুন"}
                  <Search size={20} />
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                   <ShieldCheck size={32} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-emerald-900 mb-2">অভিনন্দন! আপনার তথ্য পাওয়া গেছে।</h3>
                   <p className="text-emerald-700/70 text-sm font-medium">নিচের তথ্যগুলো ব্যবহার করে লগইন করুন।</p>
                </div>

                <div className="space-y-4 pt-4 text-left">
                   <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Mobile Number (Use for Login)</p>
                      <p className="text-xl font-black text-primary tracking-tighter">{result.mobile}</p>
                   </div>
                   <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Alumni Number</p>
                      <p className="text-xl font-black text-primary tracking-tighter uppercase">{result.alumni_number}</p>
                   </div>
                   <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Date of Birth</p>
                      <p className="text-xl font-black text-primary tracking-tighter">{result.dob}</p>
                   </div>
                </div>

                <Link 
                  href="/login/alumni"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-2xl transition-all"
                >
                  Return to Login
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

            <div className="mt-10 text-center">
              <Link href="/login/alumni" className="text-[10px] font-black uppercase tracking-widest text-[#CEB888] hover:text-primary transition-colors underline underline-offset-4">Back to Login</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
