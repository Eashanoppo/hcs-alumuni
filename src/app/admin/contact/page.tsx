"use client"

import { useState, useEffect } from "react"
import { MapPin, Phone, Mail, Clock, Save, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { adminUpdateSiteSettings } from "@/app/actions/admin"
import { supabase } from "@/lib/supabase"
import { useNotification } from "@/lib/contexts/NotificationContext"

export default function AdminContactSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contactInfo, setContactInfo] = useState({
    address: "হলি ক্রিসেন্ট স্কুল ক্যাম্পাস, ঢাকা-চট্টগ্রাম রোড",
    phone_primary: "+৮৮০ ১২৩৪ ৫৬৭৮৯০",
    email: "info@holycrescent.edu",
    office_hours: "শনিবার - বৃহস্পতিবার (সকাল ৮টা - বিকেল ৩টা)",
    emergency_guidance: "অ্যালুমনাই রেজিস্ট্রেশন সংক্রান্ত যেকোনো জটিলতায় আমাদের হটলাইনে যোগাযগ করুন।",
    emergency_phone: "০১৭ ১২৩৪ ৫৬৭৮"
  })

  const { notify } = useNotification()

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'contact_info')
        .single()
        
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      if (data && data.value) {
        setContactInfo({ ...contactInfo, ...data.value })
      }
    } catch (error) {
      console.error("Failed to load contact info", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSettings() }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await adminUpdateSiteSettings([
        { id: 'contact_info', value: contactInfo }
      ])
      notify("Contact details updated successfully", "success")
    } catch (error: any) {
      notify(`Error updating contact details: ${error.message}`, "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm md:shadow-none hover:shadow-premium">
            <ArrowLeft size={20} className="text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Contact Settings</h1>
            <p className="text-muted text-sm font-medium">Manage institutional contact details and support lines</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={saving || loading}
          className="flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Apply Changes
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-premium">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-[10px] font-black tracking-widest uppercase text-muted">Fetching Records...</p>
          </div>
        ) : (
          <>
            {/* Primary Contact Info */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-premium overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl"><MapPin size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-primary tracking-tight">Main Address & Info</h2>
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest mt-1">Primary details shown on footer and contact page</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 block px-1">Institutional Address</label>
                  <textarea 
                    rows={3}
                    value={contactInfo.address}
                    onChange={e => setContactInfo({...contactInfo, address: e.target.value})}
                    placeholder="Enter physical address..."
                    className="w-full px-6 py-5 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary resize-none leading-relaxed"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 block px-1">Official Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input 
                      type="text"
                      value={contactInfo.phone_primary}
                      onChange={e => setContactInfo({...contactInfo, phone_primary: e.target.value})}
                      placeholder="+880..."
                      className="w-full pl-14 pr-6 py-5 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 block px-1">Institutional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input 
                      type="email"
                      value={contactInfo.email}
                      onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                      placeholder="info@school.edu"
                      className="w-full pl-14 pr-6 py-5 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 block px-1">Operating Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input 
                      type="text"
                      value={contactInfo.office_hours}
                      onChange={e => setContactInfo({...contactInfo, office_hours: e.target.value})}
                      placeholder="Saturday - Thursday (8 AM - 3 PM)"
                      className="w-full pl-14 pr-6 py-5 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Support Info */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-premium overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><Phone size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-primary tracking-tight">Support Hotline</h2>
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest mt-1">Emergency contact for registration issues</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 block px-1">Guidance Text</label>
                  <textarea 
                    rows={2}
                    value={contactInfo.emergency_guidance}
                    onChange={e => setContactInfo({...contactInfo, emergency_guidance: e.target.value})}
                    placeholder="Brief instructions for support..."
                    className="w-full px-6 py-5 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-rose-500/10 transition-all font-bold text-primary resize-none leading-relaxed"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 block px-1">Hotline Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                    <input 
                      type="text"
                      value={contactInfo.emergency_phone}
                      onChange={e => setContactInfo({...contactInfo, emergency_phone: e.target.value})}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-14 pr-6 py-5 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-rose-500/10 transition-all font-black text-rose-600 text-lg tracking-tight"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
