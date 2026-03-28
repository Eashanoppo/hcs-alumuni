"use client"

import { useState, useEffect } from "react"
import { Video, Plus, Trash2, Loader2, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { adminCreateVideo, adminDeleteVideo } from "@/app/actions/admin"
import { supabase } from "@/lib/supabase"
import { useNotification } from "@/lib/contexts/NotificationContext"

export default function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: "", video_url: "", platform: "youtube" })
  const { notify, confirm } = useNotification()

  const loadVideos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error("Failed to load videos", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadVideos() }, [])

  const detectPlatform = (url: string) => {
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook'
    return 'youtube'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.video_url) {
      notify("Title and URL are required", 'error')
      return
    }

    try {
      setSubmitting(true)
      const platform = detectPlatform(form.video_url)
      
      await adminCreateVideo({
        title: form.title,
        video_url: form.video_url,
        platform
      })
      
      setForm({ title: "", video_url: "", platform: "youtube" })
      notify("Video added successfully!", 'success')
      await loadVideos()
    } catch (error: any) {
      notify(`Error: ${error.message}`, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Delete this video?")
    if (!isConfirmed) return
    try {
      await adminDeleteVideo(id)
      await loadVideos()
      notify("Video deleted successfully", 'success')
    } catch (error: any) {
      notify(`Delete failed: ${error.message}`, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12">
      <header className="flex items-center gap-6 mb-12">
        <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm">
          <ArrowLeft size={20} className="text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Video Gallery Management</h1>
          <p className="text-muted text-sm font-medium">Add YouTube and Facebook videos to the gallery.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100 sticky top-12">
            <h3 className="text-xl font-black text-primary mb-8 flex items-center gap-3">
              <Plus size={24} className="text-[#CEB888]" />
              Add Video
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Video Title</label>
                <input
                  type="text" required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-sm"
                  placeholder="e.g. Reunion 2026 Documentary"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Video URL</label>
                <input
                  type="url" required value={form.video_url}
                  onChange={e => setForm({ ...form, video_url: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                  placeholder="Enter YouTube or Facebook video link"
                />
                <p className="text-[10px] text-muted font-medium mt-2">
                  Works with standard YouTube watch links and Facebook post links.
                </p>
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Video size={18} /> Add Video</>}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-primary mb-8 px-2">Published Videos ({videos.length})</h3>

            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="animate-spin mx-auto text-primary/20" size={48} />
              </div>
            ) : videos.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                <Video size={48} className="mx-auto text-gray-100 mb-6" />
                <p className="text-muted font-bold tracking-tight">No videos added yet.</p>
              </div>
            ) : (
              videos.map((v) => (
                <div key={v.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#FAFAF7] border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#CEB888] mb-2">
                      {v.platform}
                    </span>
                    <h4 className="text-xl font-black text-primary mb-1 tracking-tight">{v.title}</h4>
                    <Link href={v.video_url} target="_blank" className="text-sm font-medium text-blue-500 hover:underline flex items-center gap-1">
                      {v.video_url} <ExternalLink size={14} />
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 shrink-0"
                    title="Delete Video"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
