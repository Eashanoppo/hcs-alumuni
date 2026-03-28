"use client"

import { useState, useEffect } from "react"
import { School, Plus, Trash2, Edit2, Loader2, ArrowLeft, Image as ImageIcon, Save } from "lucide-react"
import Link from "next/link"
import { 
  adminUpdateAboutContent,
  adminCreateMilestone,
  adminUpdateMilestone,
  adminDeleteMilestone
} from "@/app/actions/admin"
import { supabase } from "@/lib/supabase"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { useNotification } from "@/lib/contexts/NotificationContext"

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState<'content'|'milestones'>('content')
  
  // Content Tab States
  const [mission, setMission] = useState({ title: "", content: "" })
  const [vision, setVision] = useState({ title: "", content: "" })
  const [headmaster, setHeadmaster] = useState({ title: "", content: "", image_url: "" })
  const [contentLoading, setContentLoading] = useState(true)
  const [savingContent, setSavingContent] = useState(false)
  
  // Milestones Tab States
  const [milestones, setMilestones] = useState<any[]>([])
  const [milestonesLoading, setMilestonesLoading] = useState(true)
  const [milestoneForm, setMilestoneForm] = useState({ year: "", title: "", description: "", image_url: "" })
  const [milestoneEditId, setMilestoneEditId] = useState<string|null>(null)
  const [milestoneSubmitting, setMilestoneSubmitting] = useState(false)
  
  const { notify, confirm } = useNotification()

  const loadData = async () => {
    try {
      setContentLoading(true)
      setMilestonesLoading(true)
      
      const [contentRes, milestonesRes] = await Promise.all([
        supabase.from('about_content').select('*'),
        supabase.from('milestones').select('*').order('year', { ascending: true })
      ])
      
      if (contentRes.data) {
        contentRes.data.forEach(item => {
          if (item.section === 'mission') setMission({ title: item.title || "", content: item.content || "" })
          if (item.section === 'vision') setVision({ title: item.title || "", content: item.content || "" })
          if (item.section === 'headmaster') setHeadmaster({ title: item.title || "", content: item.content || "", image_url: item.image_url || "" })
        })
      }
      
      if (milestonesRes.data) {
        setMilestones(milestonesRes.data)
      }
      
    } catch (error) {
       console.error(error)
    } finally {
      setContentLoading(false)
      setMilestonesLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // CONTENT HANDLERS
  const handleSaveContent = async () => {
    try {
      setSavingContent(true)
      await Promise.all([
        adminUpdateAboutContent('mission', mission),
        adminUpdateAboutContent('vision', vision),
        adminUpdateAboutContent('headmaster', headmaster)
      ])
      notify("Content updated successfully", "success")
    } catch (error: any) {
      notify(`Error updating content: ${error.message}`, "error")
    } finally {
      setSavingContent(false)
    }
  }

  const handleHeadmasterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setSavingContent(true)
      const url = await uploadToCloudinary(file)
      setHeadmaster(prev => ({ ...prev, image_url: url }))
      notify("Image uploaded successfully! Remember to save changes.", "success")
    } catch (err: any) {
      notify(`Upload failed: ${err.message}`, 'error')
    } finally {
      setSavingContent(false)
    }
  }

  // MILESTONE HANDLERS
  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setMilestoneSubmitting(true)
      if (milestoneEditId) {
        await adminUpdateMilestone(milestoneEditId, milestoneForm)
        notify("Milestone updated", "success")
      } else {
        await adminCreateMilestone(milestoneForm)
        notify("Milestone added", "success")
      }
      setMilestoneEditId(null)
      setMilestoneForm({ year: "", title: "", description: "", image_url: "" })
      loadData()
    } catch (error: any) {
      notify(`Error: ${error.message}`, "error")
    } finally {
      setMilestoneSubmitting(false)
    }
  }

  const handleDeleteMilestone = async (id: string) => {
    if (!await confirm("Delete this milestone?")) return
    try {
      await adminDeleteMilestone(id)
      notify("Milestone deleted", "success")
      loadData()
    } catch(err: any) {
      notify(`Error: ${err.message}`, "error")
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm">
            <ArrowLeft size={20} className="text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">About Page Management</h1>
            <p className="text-muted text-sm font-medium">Manage organization history, mission, and leadership info.</p>
          </div>
        </div>
        
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-[#1F3D2B] text-white shadow-md' : 'text-muted hover:text-primary hover:bg-[#FAFAF7]'}`}
          >
            Core Content
          </button>
          <button 
            onClick={() => setActiveTab('milestones')}
            className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'milestones' ? 'bg-[#1F3D2B] text-white shadow-md' : 'text-muted hover:text-primary hover:bg-[#FAFAF7]'}`}
          >
            Milestones
          </button>
        </div>
      </header>

      {activeTab === 'content' ? (
        <div className="space-y-8 max-w-4xl mx-auto">
          {contentLoading ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary/20" size={48} /></div>
          ) : (
            <>
              {/* Mission */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100">
                <h3 className="text-xl font-black text-primary mb-6">Mission (আমাদের লক্ষ্য)</h3>
                <div className="space-y-4">
                  <input type="text" value={mission.title} onChange={e => setMission({...mission, title: e.target.value})} placeholder="Title" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-bold" />
                  <textarea rows={3} value={mission.content} onChange={e => setMission({...mission, content: e.target.value})} placeholder="Content" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-medium" />
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100">
                <h3 className="text-xl font-black text-primary mb-6">Vision (আমাদের উদ্দেশ্য)</h3>
                <div className="space-y-4">
                  <input type="text" value={vision.title} onChange={e => setVision({...vision, title: e.target.value})} placeholder="Title" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-bold" />
                  <textarea rows={3} value={vision.content} onChange={e => setVision({...vision, content: e.target.value})} placeholder="Content" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-medium" />
                </div>
              </div>

              {/* Headmaster */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100">
                <h3 className="text-xl font-black text-primary mb-6">Headmaster Message</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <input type="text" value={headmaster.title} onChange={e => setHeadmaster({...headmaster, title: e.target.value})} placeholder="Quote / Title" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-bold" />
                    <textarea rows={6} value={headmaster.content} onChange={e => setHeadmaster({...headmaster, content: e.target.value})} placeholder="Message" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Headmaster Image</label>
                    <label className="flex flex-col items-center justify-center p-6 bg-[#FAFAF7] rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary/30 transition-all h-48 relative overflow-hidden group">
                      {headmaster.image_url ? (
                        <>
                          <img src={headmaster.image_url} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                          <div className="relative z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 text-primary font-bold transition-opacity">
                            <ImageIcon size={32} className="mb-2" />
                            <span>Change Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-muted">
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-sm font-bold">Upload Image</span>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleHeadmasterImageUpload} disabled={savingContent} />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 pb-20">
                <button 
                  onClick={handleSaveContent} disabled={savingContent}
                  className="px-10 py-5 bg-[#CEB888] text-[#1F3D2B] rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {savingContent ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save All Changes
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Milestone Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100 sticky top-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-primary flex items-center gap-3">
                  {milestoneEditId ? <Edit2 size={24} className="text-[#CEB888]"/> : <Plus size={24} className="text-[#CEB888]"/>}
                  {milestoneEditId ? "Edit Milestone" : "Add Milestone"}
                </h3>
                {milestoneEditId && (
                  <button onClick={() => {setMilestoneEditId(null); setMilestoneForm({year:"", title:"", description:"", image_url: ""})}} className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg">Cancel</button>
                )}
              </div>
              
              <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                <input type="text" required value={milestoneForm.year} onChange={e=>setMilestoneForm({...milestoneForm, year: e.target.value})} placeholder="Year (e.g. ১৯৯৯)" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-bold" />
                <input type="text" required value={milestoneForm.title} onChange={e=>setMilestoneForm({...milestoneForm, title: e.target.value})} placeholder="Title" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-bold" />
                <textarea required rows={4} value={milestoneForm.description} onChange={e=>setMilestoneForm({...milestoneForm, description: e.target.value})} placeholder="Description" className="w-full px-5 py-3.5 bg-[#FAFAF7] rounded-2xl font-medium" />
                
                <div>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2 mt-4">Milestone Image (Optional)</label>
                  <label className="flex flex-col items-center justify-center p-4 bg-[#FAFAF7] rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary/30 transition-all h-32 relative overflow-hidden group">
                    {milestoneForm.image_url ? (
                      <>
                        <img src={milestoneForm.image_url} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 text-primary font-bold transition-opacity">
                          <ImageIcon size={24} className="mb-1" />
                          <span className="text-xs">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-muted">
                        <ImageIcon size={24} className="mb-1" />
                        <span className="text-xs font-bold">Upload Image</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" disabled={milestoneSubmitting} onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      try {
                        setMilestoneSubmitting(true)
                        const url = await uploadToCloudinary(file)
                        setMilestoneForm(prev => ({ ...prev, image_url: url }))
                        notify("Image uploaded successfully!", "success")
                      } catch (err: any) {
                        notify(`Upload failed: ${err.message}`, 'error')
                      } finally {
                        setMilestoneSubmitting(false)
                      }
                    }} />
                  </label>
                </div>
                
                <button type="submit" disabled={milestoneSubmitting} className="w-full py-4 bg-[#1F3D2B] text-white rounded-2xl font-black uppercase tracking-widest mt-4">
                  {milestoneSubmitting ? 'Saving...' : 'Save Milestone'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Milestones List */}
          <div className="lg:col-span-2">
            {milestonesLoading ? (
              <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary/20" size={48} /></div>
            ) : milestones.length === 0 ? (
               <div className="text-center bg-white p-12 rounded-[2.5rem]">No milestones added yet.</div>
            ) : (
              <div className="space-y-6">
                {milestones.map(m => (
                  <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-6">
                      <div className="bg-primary/5 text-primary font-black px-4 py-2 rounded-xl text-lg min-w-20 text-center">
                        {m.year}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary text-lg">{m.title}</h4>
                        <p className="text-sm text-muted mt-1">{m.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>{setMilestoneEditId(m.id); setMilestoneForm({year: m.year, title: m.title, description: m.description, image_url: m.image_url || ""}); window.scrollTo(0,0)}} className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100"><Edit2 size={18}/></button>
                      <button onClick={()=>handleDeleteMilestone(m.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
