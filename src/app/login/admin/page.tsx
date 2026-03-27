"use client"

import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { loginAdmin } from "@/app/actions/admin"
import Navbar from "@/components/layout/Navbar"

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    try {
      const result = await loginAdmin(formData)
      if (result.success) {
        window.location.href = "/admin/dashboard"
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-24 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-lg">
          <div className="text-center mb-12">
            <div className="inline-flex p-5 rounded-[2rem] bg-primary text-white mb-8 shadow-2xl">
              <ShieldAlert size={44} />
            </div>
            <h1 className="text-4xl font-black text-primary mb-3 tracking-tighter">Administrative Access</h1>
            <p className="text-muted text-lg font-bold">Authorized Personnel Only • HCS Portal</p>
          </div>

          <div className="bg-white rounded-[3.5rem] shadow-premium border border-gray-100 p-10 md:p-14">
            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleAdminLogin} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">Admin Identity</label>
                <div className="relative group">
                  <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-[#FAFAF7] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-primary font-bold placeholder:text-muted/40" 
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">Access Passcode</label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-5 bg-[#FAFAF7] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-primary font-bold placeholder:text-muted/40" 
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-primary text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 text-lg group disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    Portals Entry
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <Link href="/" className="mt-10 text-center block text-sm font-black text-muted hover:text-primary transition-colors uppercase tracking-widest">
               Back to Campus
            </Link>
          </div>

          <p className="mt-12 text-center text-muted/40 text-[10px] font-black uppercase tracking-[0.4em]">
            Institutional Grade Security • HCS 2024
          </p>
        </div>
      </main>
    </div>
  )
}
