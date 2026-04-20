"use client"

import { useState, useEffect } from "react"
import {
  Star, Plus, Trash2, Loader2, ArrowLeft, Edit2, Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import { adminAddVision, adminDeleteVision, adminUpdateVision, adminUpdateSiteSettings } from "@/app/actions/admin"
import { supabase } from "@/lib/supabase"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { useNotification } from "@/lib/contexts/NotificationContext"
import ImageCropperModal from "@/components/ui/ImageCropperModal"

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
  
  const [coverImage, setCoverImage] = useState("")
  const [uploadingCover, setUploadingCover] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  
  const { notify, confirm } = useNotification()

  const loadVisions = async () => {
    try {
      setLoading(true)
      const [visionsData, coverData] = await Promise.all([
        supabase
          .from('visions')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('site_settings')
          .select('value')
          .eq('id', 'vision_main')
          .single()
      ])
      
      if (visionsData.error) throw visionsData.error
      setVisions(visionsData.data || [])
      
      if (coverData.data && coverData.data.value && coverData.data.value.image_url) {
        setCoverImage(coverData.data.value.image_url)
      }
    } catch (error) {
      console.error("Failed to load visions", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadVisions() }, [])

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = () => {
      setImageToCrop(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = async (croppedFile: File) => {
    setImageToCrop(null)
    try {
      setUploadingCover(true)
      const url = await uploadToCloudinary(croppedFile)
      setCoverImage(url)
      
      await adminUpdateSiteSettings([
        { id: 'vision_main', value: { image_url: url } }
      ])
      
      notify("Vision section cover image updated successfully!", "success")
    } catch (err: any) {
      notify(`Upload failed: ${err.message}`, 'error')
    } finally {
      setUploadingCover(false)
    }
  }

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
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12 relative">
      {imageToCrop && (
        <ImageCropperModal 
          image={imageToCrop}
          onClose={() => setImageToCrop(null)}
          onCropComplete={onCropComplete}
          aspect={16 / 9}
        />
      )}

      <header className="flex items-center gap-6 mb-12">
        <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm md:shadow-none hover:shadow-premium">
          <ArrowLeft size={20} className="text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Visions & Core Values</h1>
          <p className="text-muted text-sm font-medium">Manage institutional target cards and values</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-12">
            {/* Cover Image Setup */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-premium relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl"><ImageIcon size={24} /></div>
                <div>
                  <h3 className="text-xl font-black text-primary">Vision Section Cover</h3>
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">Main Image for "আমাদের লক্ষ্য ও আদর্শ"</p>
                </div>
              </div>
              
              <label className="block w-full h-64 md:h-80 rounded-[2rem] border-2 border-dashed border-gray-100 bg-[#FAFAF7] flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-white transition-all overflow-hidden relative group">
                {coverImage ? (
                  <>
                    <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover group-hover:opacity-30 transition-all duration-500" />
                    <div className="relative z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all text-primary">
                       <div className="p-4 bg-white rounded-2xl shadow-xl mb-3"><ImageIcon size={32} /></div>
                       <span className="font-black text-[10px] uppercase tracking-widest">Update Cover Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-muted group-hover:text-primary transition-colors">
                    {uploadingCover ? <Loader2 size={32} className="animate-spin mb-4" /> : <ImageIcon size={32} className="mb-4" />}
                    <span className="font-black text-[10px] uppercase tracking-widest">{uploadingCover ? "Uploading..." : "Click to Upload Cover"}</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleCoverImageUpload} disabled={uploadingCover} />
              </label>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-premium">
                  <Loader2 className="animate-spin text-primary mb-4" size={40} />
                  <p className="text-[10px] font-black tracking-widest uppercase text-muted">Loading Visions...</p>
                </div>
              ) : visions.length === 0 ? (
                <div className="p-24 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-premium">
                  <Star size={48} className="mx-auto text-gray-200 mb-6" />
                  <p className="text-muted font-black text-[10px] uppercase tracking-widest">No visions found.</p>
                </div>
              ) : (
                visions.map((vision) => (
                  <div key={vision.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium hover:shadow-[0_40px_80px_rgba(31,61,43,0.06)] transition-all group relative overflow-hidden">
                    <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => handleEdit(vision)} className="p-3 bg-[#FAFAF7] text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={(e) => handleDelete(vision.id, e)} className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex gap-8">
                      <div className="h-16 w-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-primary/10 font-black text-xl">
                        {vision.display_order}
                      </div>
                      <div className="pr-16">
                        <h3 className="text-2xl font-black text-primary mb-3 leading-tight">{vision.title}</h3>
                        <p className="text-muted text-sm font-medium leading-relaxed max-w-xl">{vision.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-premium sticky top-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl"><Plus size={24} /></div>
                <h2 className="text-xl font-black text-primary tracking-tight">{editId ? "Update Vision" : "Create Vision"}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3">Vision Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-6 py-5 text-primary font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="e.g. নৈতিক শিক্ষা"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3">Detailed Description</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-6 py-5 text-primary font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 transition-all min-h-[160px] resize-none leading-relaxed"
                    placeholder="Enter the core message..."
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3">Display Priority</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FAFAF7] border-0 rounded-2xl px-6 py-5 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    placeholder="0"
                  />
                  <p className="text-[9px] text-muted font-bold italic mt-3 tracking-wide">Lower numbers appear first in the portal.</p>
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
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <Star size={16} />}
                    {editId ? "Update Values" : "Add to List"}
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
