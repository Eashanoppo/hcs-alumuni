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
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-6">
          <Link href="/admin/dashboard" className="p-3 hover:bg-[#FAFAF7] rounded-2xl transition-all border border-transparent hover:border-gray-100">
            <ArrowLeft size={20} className="text-primary" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-primary tracking-tight">Voice of Alumni</h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Manage Testimonials</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          
          <div className="order-2 lg:order-1 space-y-4">
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : testimonials.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-[2rem] border border-gray-100">
                <MessageSquare size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-muted font-bold">No testimonials added yet.</p>
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(testimonial)} className="p-2 bg-gray-50 text-gray-600 hover:text-primary rounded-xl transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={(e) => handleDelete(testimonial.id, e)} className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <MessageSquare size={24} className="text-accent/50" />
                    <p className="text-primary text-lg font-bold italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-primary">{testimonial.name}</h4>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted mt-1">{testimonial.batch}</p>
                      </div>
                      <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        Order: {testimonial.display_order}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-premium sticky top-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl"><MessageSquare size={24} /></div>
                <h2 className="text-xl font-black text-primary">{editId ? "Edit Voice" : "New Voice"}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Alumni Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-accent outline-none"
                    placeholder="e.g. Dr. Ahmed Sharif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">SSC Batch</label>
                  <input
                    type="text"
                    required
                    value={form.batch}
                    onChange={e => setForm({ ...form, batch: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-accent outline-none"
                    placeholder="e.g. SSC 2005"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Quote Component</label>
                  <textarea
                    required
                    value={form.quote}
                    onChange={e => setForm({ ...form, quote: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-5 py-4 text-primary placeholder:text-gray-400 focus:ring-2 focus:ring-accent outline-none min-h-[120px] resize-y"
                    placeholder="Enter short inspiring quote..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Display Order Option</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-accent outline-none"
                  />
                  <p className="text-[10px] text-muted italic mt-2">Lower numbers appear first on the page.</p>
                </div>

                <div className="pt-4 flex gap-3">
                  {editId && (
                    <button type="button" onClick={cancelEdit} className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 bg-[#1F3D2B] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    {editId ? "Save Changes" : "Create Card"}
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
