"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Loader2, ArrowRight, KeyRound, Phone } from "lucide-react"
import { getTeacherByCredentials } from "@/lib/teacher-db"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

export default function TeacherLogin() {
  const router = useRouter()
  const [mobile, setMobile] = useState("")
  const [joinDay, setJoinDay] = useState("")
  const [joinMonth, setJoinMonth] = useState("")
  const [joinYear, setJoinYear] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const joinDate = joinDay && joinMonth && joinYear
    ? `${joinDay.padStart(2,'0')}/${joinMonth.padStart(2,'0')}/${joinYear}`
    : ""

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!joinDate) {
      setError("অনুগ্রহ করে যোগদানের সম্পূর্ণ তারিখ নির্বাচন করুন।")
      return
    }

    setLoading(true)
    try {
      const teacher = await getTeacherByCredentials(mobile, joinDate)
      if (teacher) {
        document.cookie = `teacher_session=${teacher.id}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        window.dispatchEvent(new Event('auth-change'))
        router.push("/profile/teacher")
      } else {
        setError("মোবাইল নম্বর বা যোগদানের তারিখ সঠিক নয়।")
      }
    } catch (err: any) {
      console.error(err)
      setError("লগইন করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[3rem] shadow-premium p-10 md:p-12 relative overflow-hidden border border-gray-100">
          
          {/* Decorative bg */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#1F3D2B]/3 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#CEB888]/5 rounded-full pointer-events-none" />

          <div className="flex justify-center mb-8">
            <Image src="/images/logo.png" alt="HCS Logo" width={80} height={80} className="w-20 h-20 object-contain drop-shadow-sm" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-primary tracking-tight">শিক্ষক লগইন</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CEB888] mt-2">Teacher Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Mobile */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">
                <Phone size={12} /> মোবাইল নম্বর (Mobile Number)
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none transition-all text-center tracking-widest text-lg placeholder:text-gray-300"
              />
            </div>

            {/* Joining Date */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">
                <KeyRound size={12} /> যোগদানের তারিখ — পাসওয়ার্ড (DD/MM/YYYY)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Day */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted text-center">দিন</p>
                  <select
                    required
                    value={joinDay}
                    onChange={e => setJoinDay(e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-100 rounded-xl p-3 font-bold text-primary text-center appearance-none cursor-pointer focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none text-sm"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(d => (
                      <option key={d} value={d.padStart(2,'0')}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted text-center">মাস</p>
                  <select
                    required
                    value={joinMonth}
                    onChange={e => setJoinMonth(e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-100 rounded-xl p-3 font-bold text-primary text-center appearance-none cursor-pointer focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none text-sm"
                  >
                    <option value="">Mo</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={(i+1).toString().padStart(2,'0')}>{m.slice(0,3)}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted text-center">সাল</p>
                  <select
                    required
                    value={joinYear}
                    onChange={e => setJoinYear(e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-100 rounded-xl p-3 font-bold text-primary text-center appearance-none cursor-pointer focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none text-sm"
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 2026 - 1960 + 1 }, (_, i) => (2026 - i).toString()).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {joinDate && (
                <p className="text-[10px] font-black text-[#1F3D2B] ml-1 mt-1">
                  ✓ তারিখ: <span className="font-mono">{joinDate}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-center text-xs font-bold tracking-wide">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !joinDate}
              className="w-full bg-[#1F3D2B] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:bg-black transition-all flex justify-center items-center gap-3 disabled:opacity-40 mt-8"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "লগইন করুন"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-50 pt-8 space-y-3">
            <p className="text-[10px] font-black tracking-widest text-muted uppercase">
              Not registered yet?{" "}
              <Link href="/registration/teachers" className="text-primary hover:text-[#CEB888] underline underline-offset-4 transition-colors ml-1">
                Register Here
              </Link>
            </p>
            <Link href="/login/admin" className="text-[10px] uppercase font-black tracking-widest text-rose-500 hover:text-rose-600 transition-colors underline underline-offset-4 block">
              Institution Admin Access — Login as Admin
            </Link>
            <Link href="/login/alumni" className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] hover:text-[#1F3D2B] transition-colors underline underline-offset-4 block">
              &larr; Back to Alumni Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
