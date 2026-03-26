"use client"

import { useState, useEffect } from "react"
import { Megaphone, Plus, Trash2, Calendar, LayoutDashboard, Loader2, Star, StarOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { adminCreateNotice, adminDeleteNotice } from "@/app/actions/admin"
import { supabase } from "@/lib/supabase"

export default function AdminNotices() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: "",
    title_bn: "",
    body: "",
    category: "General",
    is_featured: false
  })

  const loadNotices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setNotices(data || [])
    } catch (error) {
      console.error("Failed to load notices", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return alert("Title is required")
    
    try {
      setSubmitting(true)
      await adminCreateNotice(form)
      setForm({ title: "", title_bn: "", body: "", category: "General", is_featured: false })
      alert("Notice published successfully!")
      await loadNotices()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return
    try {
      await adminDeleteNotice(id)
      await loadNotices()
    } catch (error: any) {
      alert(`Delete failed: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12">
      <header className="flex items-center gap-6 mb-12">
        <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm">
          <ArrowLeft size={20} className="text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Notice Board Management</h1>
          <p className="text-muted text-sm font-medium">Publish news and announcements for the alumni community.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Creation Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100 sticky top-12">
            <h3 className="text-xl font-black text-primary mb-8 flex items-center gap-3">
              <Plus size={24} className="text-[#CEB888]" />
              New Notice
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Notice Title (EN)</label>
                <input 
                  type="text" 
                  required
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-6 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold"
                  placeholder="e.g. Silver Jubilee Registration Open"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Title (Bengali - Optional)</label>
                <input 
                  type="text" 
                  value={form.title_bn}
                  onChange={e => setForm({...form, title_bn: e.target.value})}
                  className="w-full px-6 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold"
                  placeholder="বিজ্ঞপ্তির শিরোনাম..."
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Category</label>
                <select 
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full px-6 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                  <option value="General">General News</option>
                  <option value="Academic">Academic</option>
                  <option value="Events">Events</option>
                  <option value="Urgent">Urgent Alert</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Content / Description</label>
                <textarea 
                  rows={4}
                  value={form.body}
                  onChange={e => setForm({...form, body: e.target.value})}
                  className="w-full px-6 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                  placeholder="Enter the full content or important highlights..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#FAFAF7] rounded-2xl">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={form.is_featured}
                  onChange={e => setForm({...form, is_featured: e.target.checked})}
                  className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary"
                />
                <label htmlFor="featured" className="text-xs font-black text-primary uppercase tracking-widest cursor-pointer">Mark as Featured Banner</label>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Megaphone size={18} /> Publish Notice</>}
              </button>
            </form>
          </div>
        </div>

        {/* Notices List */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-primary mb-8 px-2">Published Notices ({notices.length})</h3>
            
            {loading ? (
              <div className="py-20 text-center">
                 <Loader2 className="animate-spin mx-auto text-primary/20" size={48} />
              </div>
            ) : notices.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                 <Megaphone size={48} className="mx-auto text-gray-100 mb-6" />
                 <p className="text-muted font-bold tracking-tight">No notices published yet.</p>
              </div>
            ) : (
              notices.map((n) => (
                <div key={n.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8 items-start justify-between">
                   <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-[#FAFAF7] border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#CEB888]">
                          {n.category}
                        </span>
                        {n.is_featured && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                            <Star size={12} fill="currentColor" /> Featured
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-muted uppercase tracking-widest">
                          <Calendar size={12} /> {new Date(n.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-primary mb-2 tracking-tight">{n.title}</h4>
                      {n.title_bn && <p className="text-primary/70 font-bold text-sm mb-4">{n.title_bn}</p>}
                      <p className="text-muted text-sm leading-relaxed line-clamp-2">{n.body}</p>
                   </div>
                   <div className="flex shrink-0 gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleDelete(n.id)}
                        className="flex-grow md:flex-none p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                        title="Delete Notice"
                      >
                         <Trash2 size={20} />
                      </button>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
