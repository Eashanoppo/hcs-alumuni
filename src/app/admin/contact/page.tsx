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
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
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
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="p-3 hover:bg-[#FAFAF7] rounded-2xl transition-all border border-transparent hover:border-gray-100">
              <ArrowLeft size={20} className="text-primary" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Contact Settings</h1>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Manage public contact information</p>
            </div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="px-8 py-3.5 bg-[#1F3D2B] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Settings
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : (
            <>
              {/* Primary Contact Info */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-premium">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/5 text-primary rounded-2xl"><MapPin size={24} /></div>
                  <h2 className="text-xl font-black text-primary">Primary Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-2 block">Address</label>
                    <textarea 
                      rows={2}
                      value={contactInfo.address}
                      onChange={e => setContactInfo({...contactInfo, address: e.target.value})}
                      className="w-full px-5 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium resize-none shadow-inner"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-2 block">Primary Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input 
                        type="text"
                        value={contactInfo.phone_primary}
                        onChange={e => setContactInfo({...contactInfo, phone_primary: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-2 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input 
                        type="email"
                        value={contactInfo.email}
                        onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-2 block">Office Hours</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input 
                        type="text"
                        value={contactInfo.office_hours}
                        onChange={e => setContactInfo({...contactInfo, office_hours: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency / Support Info */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-premium">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><Phone size={24} /></div>
                  <h2 className="text-xl font-black text-primary">Emergency Support Line</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-2 block">Emergency Guidance Text</label>
                    <textarea 
                      rows={2}
                      value={contactInfo.emergency_guidance}
                      onChange={e => setContactInfo({...contactInfo, emergency_guidance: e.target.value})}
                      className="w-full px-5 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium resize-none shadow-inner"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-2 block">Emergency Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                      <input 
                        type="text"
                        value={contactInfo.emergency_phone}
                        onChange={e => setContactInfo({...contactInfo, emergency_phone: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all font-bold text-rose-600 shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
