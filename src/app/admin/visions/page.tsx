"use client"

import { useState, useEffect } from "react"
import {
  Star, Plus, Trash2, Loader2, ArrowLeft, Edit2
} from "lucide-react"
import Link from "next/link"
import { adminAddVision, adminDeleteVision, adminUpdateVision } from "@/app/actions/admin"
import { supabase } from "@/lib/supabase"
import { useNotification } from "@/lib/contexts/NotificationContext"

const defaultForm = {
  title: "",
  description: "",
  display_order: 0,
}

export default function AdminVisions() {
  const [visions, setVisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState<string | null>(null)
  
  // Minimal notification mock since context might differ 
  // Wait, I am using useNotification which is in the codebase!
  const { notify, confirm } = useNotification()

  const loadVisions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('visions')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      setVisions(data || [])
    } catch (error) {
      console.error("Failed to load visions", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadVisions() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description) {
      notify("Title and Description are required", 'error')
      return
    }
    
    try {
      setSubmitting(true)
      if (editId) {
        await adminUpdateVision(editId, form)
        notify("Vision updated successfully", 'success')
      } else {
        await adminAddVision(form)
        notify("Vision created successfully", 'success')
      }
      setForm(defaultForm)
      setEditId(null)
      await loadVisions()
    } catch (err: any) {
      notify(`Submission failed: ${err.message}`, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const ok = await confirm("Are you sure you want to delete this vision?")
    if (!ok) return
    try {
      await adminDeleteVision(id)
      notify("Vision deleted", 'success')
      await loadVisions()
    } catch (err: any) {
      notify(`Deletion failed: ${err.message}`, 'error')
    }
  }

  const handleEdit = (vision: any) => {
    setEditId(vision.id)
    setForm({
      title: vision.title,
      description: vision.description,
      display_order: vision.display_order || 0
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
            <h1 className="text-2xl font-black text-primary tracking-tight">Visions & Core Values</h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Manage "আমাদের লক্ষ্য ও আদর্শ"</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          
          <div className="order-2 lg:order-1 space-y-4">
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : visions.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-[2rem] border border-gray-100">
                <Star size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-muted font-bold">No visions added yet.</p>
              </div>
            ) : (
              visions.map((vision) => (
                <div key={vision.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(vision)} className="p-2 bg-gray-50 text-gray-600 hover:text-primary rounded-xl transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={(e) => handleDelete(vision.id, e)} className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0">
                      <Star size={20} />
                    </div>
                    <div className="pr-20">
                      <h3 className="text-lg font-black text-primary mb-2 line-clamp-2">{vision.title}</h3>
                      <p className="text-muted text-sm line-clamp-3 leading-relaxed">{vision.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          Order: {vision.display_order}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-premium sticky top-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl"><Star size={24} /></div>
                <h2 className="text-xl font-black text-primary">{editId ? "Edit Vision" : "New Vision"}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Title (e.g. নৈতিক শিক্ষা)</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-accent outline-none"
                    placeholder="Enter feature title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Description</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-5 py-4 text-primary placeholder:text-gray-400 focus:ring-2 focus:ring-accent outline-none min-h-[120px] resize-y"
                    placeholder="Enter short description"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Display Order Option</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-accent outline-none"
                    placeholder="1"
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
