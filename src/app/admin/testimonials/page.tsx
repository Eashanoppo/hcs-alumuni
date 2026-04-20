"use client"

import { useState, useEffect } from "react"
import {
  MessageSquare, Plus, Trash2, Loader2, ArrowLeft, Edit2
} from "lucide-react"
import Link from "next/link"
import { adminAddTestimonial, adminDeleteTestimonial, adminUpdateTestimonial } from "@/app/actions/admin"
import { supabase } from "@/lib/supabase"
import { useNotification } from "@/lib/contexts/NotificationContext"

const defaultForm = {
  name: "",
  batch: "",
  quote: "",
  display_order: 0,
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState<string | null>(null)
  
  const { notify, confirm } = useNotification()

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error("Failed to load testimonials", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTestimonials() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.batch || !form.quote) {
      notify("Name, Batch, and Quote are required", 'error')
      return
    }
    
    try {
      setSubmitting(true)
      if (editId) {
        await adminUpdateTestimonial(editId, form)
        notify("Testimonial updated successfully", 'success')
      } else {
        await adminAddTestimonial(form)
        notify("Testimonial created successfully", 'success')
      }
      setForm(defaultForm)
      setEditId(null)
      await loadTestimonials()
    } catch (err: any) {
      notify(`Submission failed: ${err.message}`, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const ok = await confirm("Are you sure you want to delete this testimonial?")
    if (!ok) return
    try {
      await adminDeleteTestimonial(id)
      notify("Testimonial deleted", 'success')
      await loadTestimonials()
    } catch (err: any) {
      notify(`Deletion failed: ${err.message}`, 'error')
    }
  }

  const handleEdit = (testimonial: any) => {
    setEditId(testimonial.id)
    setForm({
      name: testimonial.name,
      batch: testimonial.batch,
      quote: testimonial.quote,
      display_order: testimonial.display_order || 0
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditId(null)
    setForm(defaultForm)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12 relative">
      <header className="flex items-center gap-6 mb-12">
        <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm md:shadow-none hover:shadow-premium">
          <ArrowLeft size={20} className="text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Voice of Alumni</h1>
          <p className="text-muted text-sm font-medium">Manage and display student/alumni testimonials</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-premium">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-[10px] font-black tracking-widest uppercase text-muted">Fetching Feedback...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="p-24 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-premium">
                <MessageSquare size={48} className="mx-auto text-gray-200 mb-6" />
                <p className="text-muted font-black text-[10px] uppercase tracking-widest">No testimonials found.</p>
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-premium hover:shadow-[0_40px_80px_rgba(31,61,43,0.06)] transition-all group relative overflow-hidden">
                  <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button onClick={() => handleEdit(testimonial)} className="p-3 bg-[#FAFAF7] text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={(e) => handleDelete(testimonial.id, e)} className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-primary/5 text-primary rounded-2xl shadow-sm border border-primary/10">
                        <MessageSquare size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-primary leading-tight">{testimonial.name}</h4>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted mt-1">{testimonial.batch}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute -top-4 -left-2 text-6xl font-serif text-primary/5 select-none opacity-50">"</span>
                      <p className="text-primary text-lg font-medium italic leading-relaxed relative z-10 pl-4">
                        {testimonial.quote}
                      </p>
                    </div>

                    <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
                       <span className="px-5 py-2 bg-[#FAFAF7] text-muted rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100">
                        Display Priority: {testimonial.display_order}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-premium sticky top-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl"><Plus size={24} /></div>
                <h2 className="text-xl font-black text-primary tracking-tight">{editId ? "Update Voice" : "Add New Voice"}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3">Alumni Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-6 py-5 text-primary font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="e.g. Dr. Ahmed Sharif"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3">SSC Batch</label>
                  <input
                    type="text"
                    required
                    value={form.batch}
                    onChange={e => setForm({ ...form, batch: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-6 py-5 text-primary font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="e.g. SSC 2005"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3">Testimonial Quote</label>
                  <textarea
                    required
                    value={form.quote}
                    onChange={e => setForm({ ...form, quote: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-6 py-5 text-primary font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 transition-all min-h-[160px] resize-none leading-relaxed"
                    placeholder="Enter short inspiring quote..."
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3">Display Priority</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-6 py-5 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                  />
                  <p className="text-[9px] text-muted font-bold italic mt-3 tracking-wide">Lower numbers appear first on the page.</p>
                </div>

                <div className="pt-6 flex gap-3">
                  {editId && (
                    <button type="button" onClick={cancelEdit} className="flex-1 py-5 bg-[#FAFAF7] text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex justify-center items-center gap-3 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    {editId ? "Update Entry" : "Post Testimony"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
