"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Image as LucideImage, Calendar, Camera, Filter, X, Loader2, Play } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function GalleryPage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    async function fetchPhotos() {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setPhotos(data)
      }
      setLoading(false)
    }
    fetchPhotos()
  }, [])

  const categories = ["All", ...Array.from(new Set(photos.map(p => p.tag)))]
  const filteredPhotos = activeFilter === "All" 
    ? photos 
    : photos.filter(p => p.tag === activeFilter)

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-8 max-w-7xl mx-auto w-full">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 bg-[#CEB888] w-12 rounded-full"></div>
            <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight">স্মৃতিসুধা: ফটো গ্যালারি</h1>
            <div className="h-1 bg-[#CEB888] w-12 rounded-full"></div>
          </div>
          <p className="text-muted leading-relaxed font-medium">
            পবিত্র ক্রিসেন্ট স্কুলের সোনালী দিনগুলো এবং পুনর্মিলনী অনুষ্ঠানের বিশেষ মুহূর্তগুলো এখানে সংরক্ষিত রয়েছে।
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <div className="flex items-center gap-2 mr-4 text-primary opacity-40">
            <Filter size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1F3D2B]">Filter Memories</span>
          </div>
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === cat 
                  ? "bg-primary text-white shadow-xl -translate-y-1" 
                  : "bg-white text-muted hover:text-primary hover:bg-white border border-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin mx-auto text-primary/10" size={64} />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-12">
             <div className="w-20 h-20 bg-[#FAFAF7] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <LucideImage size={32} className="text-gray-200" />
             </div>
             <p className="text-muted font-bold tracking-tight">কোনো ছবি পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedPhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-white shadow-sm hover:shadow-premium transition-all duration-500 border border-gray-100"
              >
                <div className="aspect-[4/3] overflow-hidden">
                   <img 
                    src={photo.image_url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                   <span className="text-[9px] font-black text-[#CEB888] uppercase tracking-[0.3em] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                     {photo.tag}
                   </span>
                   <h3 className="text-xl font-black text-white tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                     {photo.title}
                   </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Static Video Section for aesthetic completeness */}
        <section className="mt-32 bg-primary/5 p-12 md:p-20 rounded-[4rem] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[10rem] -z-0"></div>
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-2 h-12 bg-[#CEB888] rounded-full"></div>
                  <div>
                    <h2 className="text-3xl font-black text-primary italic">ভিডিও গ্যালারি</h2>
                    <p className="text-muted text-sm font-bold uppercase tracking-widest">Documentaries & Highlights</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="group cursor-pointer">
                     <div className="aspect-video bg-white rounded-[2.5rem] border border-gray-100 p-2 overflow-hidden shadow-sm relative group-hover:shadow-xl transition-all h-full flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                           <div className="w-16 h-16 bg-[#CEB888] text-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                              <Play size={24} fill="currentColor" />
                           </div>
                        </div>
                        <div className="w-full h-full bg-primary/5 rounded-[1.8rem]"></div>
                     </div>
                     <h4 className="mt-4 font-black text-primary group-hover:text-[#CEB888] transition-colors leading-tight">সিলভার জুবিলি ডকুমেন্টারি ২০২৪</h4>
                  </div>
               </div>
            </div>
        </section>
      </main>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-primary/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-8 right-8 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all z-50 group"
          >
            <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          <div className="max-w-6xl w-full h-full flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-grow w-full h-[60vh] md:h-full relative overflow-hidden rounded-[3rem] shadow-2xl bg-black">
              <img 
                src={selectedPhoto.image_url} 
                alt={selectedPhoto.title} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="md:w-[400px] shrink-0 text-white select-none">
              <span className="inline-block px-4 py-1.5 bg-[#CEB888] text-primary text-[10px] font-black rounded-lg mb-6 tracking-widest uppercase">
                {selectedPhoto.tag} MEMORY
              </span>
              <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight italic">{selectedPhoto.title}</h2>
              <div className="space-y-6 text-white/60">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#CEB888]">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Uploaded On</p>
                    <p className="text-xl font-black text-white">{new Date(selectedPhoto.created_at).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#CEB888]">
                    <Camera size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Captured By</p>
                    <p className="text-xl font-black text-white">HCS Alumni Media</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                <p className="text-sm font-medium leading-relaxed italic text-white/80">
                  "Memories are the treasures that we keep in our hearts forever. This capture represents a beautiful chapter of our HCS journey."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
