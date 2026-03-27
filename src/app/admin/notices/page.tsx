"use client"

import { useState, useEffect } from "react"
import {
  Megaphone, Plus, Trash2, Calendar, Loader2, Star, ArrowLeft,
  FileText, Link2, ExternalLink, PlusCircle, XCircle, Upload
} from "lucide-react"
import Link from "next/link"
import { adminCreateNotice, adminDeleteNotice } from "@/app/actions/admin"
import { supabase } from "@/lib/supabase"
import { uploadToCloudinary } from "@/lib/cloudinary"

const CATEGORIES = [
  { value: "General", label: "General News" },
  { value: "Academic", label: "Academic" },
  { value: "Events", label: "Events & Programs" },
  { value: "Registration", label: "Registration" },
  { value: "Reunion", label: "Reunion" },
  { value: "Urgent", label: "Urgent Alert" },
  { value: "Congratulations", label: "Congratulations" },
]

const defaultForm = {
  title: "",
  title_bn: "",
  body: "",
  body_bn: "",
  category: "General",
  is_featured: false,
  highlights: [] as string[],
  attachment_url: "",
  attachment_name: "",
  action_label: "",
  action_url: "",
}

export default function AdminNotices() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [newHighlight, setNewHighlight] = useState("")
  const [fileLabel, setFileLabel] = useState("")

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

  useEffect(() => { loadNotices() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadToCloudinary(file)
      setForm(f => ({ ...f, attachment_url: url, attachment_name: file.name }))
      setFileLabel(file.name)
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const addHighlight = () => {
    const trimmed = newHighlight.trim()
    if (!trimmed) return
    setForm(f => ({ ...f, highlights: [...f.highlights, trimmed] }))
    setNewHighlight("")
  }

  const removeHighlight = (i: number) => {
    setForm(f => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return alert("Title is required")
    try {
      setSubmitting(true)
      await adminCreateNotice({
        ...form,
        highlights: form.highlights.length > 0 ? form.highlights : null,
        attachment_url: form.attachment_url || null,
        attachment_name: form.attachment_name || null,
        action_label: form.action_label || null,
        action_url: form.action_url || null,
        body_bn: form.body_bn || null,
        title_bn: form.title_bn || null,
      })
      setForm(defaultForm)
      setFileLabel("")
      setNewHighlight("")
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
          <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100 sticky top-12 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <h3 className="text-xl font-black text-primary mb-8 flex items-center gap-3">
              <Plus size={24} className="text-[#CEB888]" />
              New Notice
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title EN */}
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Notice Title (EN) *</label>
                <input
                  type="text" required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-sm"
                  placeholder="e.g. Silver Jubilee Registration Open"
                />
              </div>

              {/* Title BN */}
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Title (Bengali - Optional)</label>
                <input
                  type="text" value={form.title_bn}
                  onChange={e => setForm({ ...form, title_bn: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-sm"
                  placeholder="বিজ্ঞপ্তির শিরোনাম..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Body EN */}
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Content / Description (EN)</label>
                <textarea
                  rows={4} value={form.body}
                  onChange={e => setForm({ ...form, body: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                  placeholder="Enter the full content or important highlights..."
                />
              </div>

              {/* Body BN */}
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Content (Bengali - Optional)</label>
                <textarea
                  rows={4} value={form.body_bn}
                  onChange={e => setForm({ ...form, body_bn: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                  placeholder="বাংলায় বিস্তারিত বিষয়বস্তু..."
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Key Highlights / Bullet Points</label>
                <div className="space-y-2 mb-3">
                  {form.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-[#FAFAF7] rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CEB888] shrink-0" />
                      <span className="text-sm font-medium text-primary flex-grow">{h}</span>
                      <button type="button" onClick={() => removeHighlight(i)} className="text-rose-400 hover:text-rose-600 transition-colors shrink-0">
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={newHighlight}
                    onChange={e => setNewHighlight(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHighlight() } }}
                    className="flex-grow px-4 py-3 bg-[#FAFAF7] border-none rounded-xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                    placeholder="Add a bullet point..."
                  />
                  <button
                    type="button" onClick={addHighlight}
                    className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
              </div>

              {/* Attachment Upload */}
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Attach Document (PDF, etc.)</label>
                <label className="flex items-center gap-4 p-4 bg-[#FAFAF7] rounded-2xl cursor-pointer hover:bg-primary/5 transition-all border-2 border-dashed border-gray-100 hover:border-primary/20">
                  <div className={`p-3 rounded-xl ${form.attachment_url ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">
                      {uploading ? "Uploading..." : form.attachment_url ? "File Attached" : "Click to Upload"}
                    </p>
                    <p className="text-[10px] text-muted font-medium truncate">{fileLabel || "PDF, DOC up to 10MB"}</p>
                  </div>
                  {form.attachment_url && (
                    <button type="button" onClick={() => { setForm(f => ({...f, attachment_url: "", attachment_name: ""})); setFileLabel("") }} className="text-rose-400 hover:text-rose-600">
                      <XCircle size={18} />
                    </button>
                  )}
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg" disabled={uploading} />
                </label>
              </div>

              {/* Action CTA */}
              <div className="p-4 bg-[#FAFAF7] rounded-2xl space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block">Action Button (Optional)</label>
                <input
                  type="text" value={form.action_label}
                  onChange={e => setForm({ ...form, action_label: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-sm"
                  placeholder="Button label, e.g. রেজিস্ট্রেশন করুন"
                />
                <input
                  type="url" value={form.action_url}
                  onChange={e => setForm({ ...form, action_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                  placeholder="https://... or /registration"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3 p-4 bg-[#FAFAF7] rounded-2xl">
                <input
                  type="checkbox" id="featured"
                  checked={form.is_featured}
                  onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary"
                />
                <label htmlFor="featured" className="text-xs font-black text-primary uppercase tracking-widest cursor-pointer">Mark as Featured Banner</label>
              </div>

              <button
                type="submit" disabled={submitting || uploading}
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
                <div key={n.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-primary/20 transition-all">
                  <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[#FAFAF7] border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#CEB888]">
                          {n.category}
                        </span>
                        {n.is_featured && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                            <Star size={12} fill="currentColor" /> Featured
                          </span>
                        )}
                        {n.attachment_url && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            <FileText size={12} /> Attachment
                          </span>
                        )}
                        {n.action_url && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">
                            <Link2 size={12} /> CTA
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-muted uppercase tracking-widest ml-auto">
                          <Calendar size={12} /> {new Date(n.created_at).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-primary mb-1 tracking-tight">{n.title}</h4>
                      {n.title_bn && <p className="text-primary/70 font-bold text-sm mb-3">{n.title_bn}</p>}
                      <p className="text-muted text-sm leading-relaxed line-clamp-2">{n.body || n.body_bn}</p>
                      {n.highlights && n.highlights.length > 0 && (
                        <p className="text-[10px] text-muted font-black uppercase tracking-widest mt-3">
                          + {n.highlights.length} highlight{n.highlights.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2 flex-wrap">
                      <Link
                        href={`/notices/${n.id}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-3 bg-primary/5 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-transparent"
                        title="View Public Page"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                        title="Delete Notice"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
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
