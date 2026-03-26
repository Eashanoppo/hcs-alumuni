"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Download, Calendar, Users, Megaphone, FileText, Search, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchNotices() {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setNotices(data)
      }
      setLoading(false)
    }
    fetchNotices()
  }, [])

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (n.body && n.body.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const featuredNotice = notices.find(n => n.is_featured)
  const otherNotices = filteredNotices.filter(n => n.id !== featuredNotice?.id)

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-8 max-w-7xl mx-auto w-full">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-1.5 bg-[#CEB888] rounded-full"></div>
            <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight">সবশেষ সংবাদ ও নোটিশ</h1>
          </div>
          <p className="text-muted max-w-2xl leading-relaxed font-medium">
            পবিত্র ক্রিসেন্ট স্কুলের একাডেমিক এবং প্রশাসনিক সকল গুরুত্বপূর্ণ তথ্যের নির্ভরযোগ্য সূত্র।
          </p>
        </header>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin mx-auto text-primary/10" size={64} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
              {featuredNotice && (
                <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 md:p-14 text-white shadow-premium border-b-8 border-[#CEB888]">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Megaphone size={120} />
                  </div>
                  <div className="relative z-10">
                      <span className="inline-block px-4 py-1.5 bg-[#CEB888] text-primary text-[10px] font-black rounded-full mb-8 tracking-widest uppercase">জরুরি ঘোষণা</span>
                      <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">{featuredNotice.title}</h2>
                      <div className="flex flex-wrap items-center gap-8 text-white/60 mb-10">
                        <div className="flex items-center gap-2">
                           <Calendar size={16} className="text-[#CEB888]" />
                           <span className="text-xs font-bold uppercase tracking-widest">
                             {new Date(featuredNotice.created_at).toLocaleDateString('bn-BD')}
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Users size={16} className="text-[#CEB888]" />
                           <span className="text-xs font-bold uppercase tracking-widest">{featuredNotice.category}</span>
                        </div>
                      </div>
                      <div className="prose prose-invert max-w-none mb-10 text-white/80 font-medium">
                        <p>{featuredNotice.body}</p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                         <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black hover:bg-[#CEB888] transition-all flex items-center gap-2 shadow-lg hover:-translate-y-1">
                            বিস্তারিত দেখুন
                         </button>
                      </div>
                  </div>
                </section>
              )}

              <div className="space-y-6">
                <h3 className="text-2xl font-black text-primary mb-8 px-2">সাম্প্রতিক নোটিশসমূহ</h3>
                {otherNotices.length > 0 ? otherNotices.map((n, i) => (
                  <div key={i} className="group bg-white p-8 rounded-[2rem] flex items-center justify-between gap-8 border border-gray-100 hover:shadow-premium hover:border-[#1F3D2B]/20 transition-all">
                      <div className="flex items-start gap-8">
                        <div className="bg-[#FAFAF7] p-5 rounded-2xl text-center min-w-[100px] border border-gray-50 group-hover:bg-primary transition-colors group-hover:border-primary">
                            <span className="block text-2xl font-black text-primary group-hover:text-white leading-none mb-1">
                              {new Date(n.created_at).getDate()}
                            </span>
                            <span className="block text-[9px] font-black text-muted group-hover:text-white/60 uppercase tracking-wider">
                              {new Date(n.created_at).toLocaleString('default', { month: 'short' })}
                            </span>
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg mb-3 uppercase tracking-widest">{n.category}</span>
                            <h4 className="text-xl font-bold text-primary group-hover:text-[#CEB888] transition-colors leading-snug">{n.title}</h4>
                            <p className="text-muted text-sm mt-2 line-clamp-2">{n.body}</p>
                        </div>
                      </div>
                      <button className="flex items-center justify-center w-14 h-14 bg-[#FAFAF7] border border-gray-100 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                        <FileText size={24} />
                      </button>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <Megaphone size={48} className="mx-auto text-gray-100 mb-4" />
                    <p className="text-muted font-bold">কোনো সাধারণ নোটিশ পাওয়া যায়নি।</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-10">
               <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-premium">
                  <h3 className="text-xl font-black text-primary mb-8 flex items-center gap-3">
                     <Search size={22} className="text-[#CEB888]" />
                     নোটিশ খুঁজুন
                  </h3>
                  <input 
                    type="text" 
                    placeholder="কীওয়ার্ড দিয়ে খুঁজুন..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-[#CEB888]/20 transition-all font-medium mb-4 shadow-inner"
                  />
               </div>

               <div className="bg-primary p-10 rounded-[2.5rem] text-white shadow-premium relative overflow-hidden group">
                  <div className="relative z-10">
                     <h3 className="text-2xl font-black mb-4">এসএসসি ২০২৪ রেজাল্ট</h3>
                     <p className="font-bold text-white/70 mb-8">আমাদের অসাধারণ সাফল্যের ফলাফল দেখতে ক্লিক করুন।</p>
                     <button className="bg-[#CEB888] text-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 group-hover:-translate-y-1 transition-transform">
                        ফলাফল দেখুন <FileText size={18} />
                     </button>
                  </div>
                  <FileText className="absolute -right-8 -bottom-8 opacity-10 text-white rotate-12 transition-transform group-hover:scale-110" size={160} />
               </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
