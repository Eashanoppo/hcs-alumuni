"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Lightbulb, Eye, GraduationCap, Users, Trophy, School, ArrowRight, Loader2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function AboutPage() {
  const [milestones, setMilestones] = useState<any[]>([])
  const [content, setContent] = useState<any>({
    mission: { title: "আমাদের লক্ষ্য", content: "আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে সুশিক্ষায় শিক্ষিত করে তোলা এবং তাদের সৃজনশীল প্রতিভার বিকাশ ঘটানো।" },
    vision: { title: "আমাদের উদ্দেশ্য", content: "আধুনিক শিক্ষার সাথে নৈতিক মূল্যবোধের সমন্বয় ঘটিয়ে এমন একটি প্রজন্ম গড়ে তোলা যারা আগামীর নেতৃত্ব দিবে।" },
    headmaster: { title: "শিক্ষাই আলো, শিক্ষার আলো ছড়িয়ে পড়ুক সবার মাঝে।", content: "২৫ বছরের এই পথচলায় আপনারা যেভাবে আমাদের পাশে ছিলেন, আশা করি আগামীদিনেও সেভাবেই আপনাদের সমর্থন অব্যাহত থাকবে। আমরা প্রতিটি শিক্ষার্থীর নৈতিক উন্নয়ন ও চারিত্রিক গঠনের ওপর গুরুত্বারোপ করি।", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzEFrzIQWCFK0kOzG3IKGGiIqLSBL4YS5DRiEKJewRBgKd5v9xdDh0VK3Bqio7uXImz6XH4bkL8AG9LjP2L8u5SAPjnBZDS3KR48LckE0MXjYGgHZ_ZnGDhsT53IOnJDQMpmBG7F_oZJ9-8XfUZlZEn-VyU68GRHoKgeeSQm-_koUIzS0piDPjwNuPp5mX1I2d5RtunwaYgo1xfqE3XITaXohUCMYTAqfOGWfVaL0416SBUH0ESCt1eDnuTHX8LUE91Hn6w1EKeAc" }
  })
  const [headmasterName, setHeadmasterName] = useState("প্রফেসর ড. মাহফুজুর রহমান")
  const [headmasterPost, setHeadmasterPost] = useState("প্রধান শিক্ষক, হলি ক্রিসেন্ট স্কুল")
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const [mRes, cRes, sRes] = await Promise.all([
        supabase.from('milestones').select('*').order('year', { ascending: true }),
        supabase.from('about_content').select('*'),
        supabase.from('site_settings').select('*').in('id', ['headmaster_name', 'headmaster_post'])
      ])
      
      if (mRes.data && mRes.data.length > 0) setMilestones(mRes.data);
      if (cRes.data) {
        const newContent = { ...content }
        cRes.data.forEach(item => {
          if (newContent[item.section as keyof typeof newContent]) {
            newContent[item.section as keyof typeof newContent] = {
               title: item.title || newContent[item.section as keyof typeof newContent].title,
               content: item.content || newContent[item.section as keyof typeof newContent].content,
               image_url: item.image_url || newContent[item.section as keyof typeof newContent]?.image_url
            }
          }
        })
        setContent(newContent)
      }
      
      if (sRes.data) {
        sRes.data.forEach(item => {
          if (item.id === 'headmaster_name' && item.value?.text) setHeadmasterName(item.value.text);
          if (item.id === 'headmaster_post' && item.value?.text) setHeadmasterPost(item.value.text);
        });
      }
      
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-accent transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 z-[101]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-[#FAFAF7]">
        {/* Minimalist Hero */}
        <header className="max-w-7xl mx-auto px-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-0.5 w-12 bg-accent"></span>
              <span className="text-accent font-bold tracking-widest text-sm uppercase">
                Legacy of 25 Years
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-8 leading-tight">
              ২৫ বছরের গৌরবময় পথচলা
            </h1>
            <p className="text-xl text-muted max-w-2xl leading-relaxed font-medium">
              জ্ঞান ও নৈতিকতার পথে আড়াই দশকের এক অনন্য যাত্রা।
            </p>
          </motion.div>
        </header>

        {/* Mission Vision */}
        <section className="max-w-7xl mx-auto py-24 px-8">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary/20" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-12 rounded-3xl shadow-sm group hover:shadow-xl transition-all">
                <Lightbulb className="text-accent mb-8 w-12 h-12 group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl font-bold text-primary mb-6">{content.mission.title}</h2>
                <p className="text-muted leading-loose text-lg">
                  {content.mission.content}
                </p>
              </div>
              <div className="bg-primary p-12 rounded-3xl text-white shadow-xl flex flex-col justify-center">
                <Eye className="text-accent mb-8 w-12 h-12" />
                <h2 className="text-3xl font-bold mb-6 text-accent">{content.vision.title}</h2>
                <p className="text-white/80 leading-loose text-lg">
                  {content.vision.content}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Timeline */}
        <section className="bg-primary-dark/5 py-32 px-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent"></div>
          
          <div className="max-w-4xl mx-auto text-center mb-24 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-black text-primary mb-6 tracking-tighter"
            >
              ইতিহাসের <span className="text-accent underline decoration-accent/20 underline-offset-8">মাইলফলক</span>
            </motion.h2>
            <p className="text-muted font-bold text-lg">হলি ক্রিসেন্ট স্কুলের ২৫ বছরের স্বর্ণালী মুহূর্তসমূহ</p>
          </div>
          
          <div className="max-w-5xl mx-auto relative px-4">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-accent/20 -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-24">
              {milestones.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-block px-6 py-2 bg-accent text-primary rounded-full font-black text-xl mb-6 shadow-lg ${i % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                      {m.year}
                    </div>
                    <h3 className="text-3xl font-black text-primary mb-4 tracking-tight group-hover:text-accent transition-colors">{m.title}</h3>
                    <p className="text-muted text-lg font-medium leading-relaxed">{m.desc || m.description}</p>
                  </div>
                  
                  <div className="relative z-10 hidden md:block">
                    <div className="w-8 h-8 rounded-full bg-white border-4 border-accent shadow-xl ring-8 ring-accent/5"></div>
                  </div>
                  
                  <div className="md:w-1/2 w-full">
                    <div 
                      className="aspect-[16/10] bg-white rounded-[2.5rem] shadow-premium p-3 group hover:scale-105 transition-transform duration-500 overflow-hidden border border-gray-100 cursor-pointer"
                      onClick={() => m.image_url && setSelectedImage(m.image_url)}
                    >
                      {m.image_url ? (
                        <div className="w-full h-full rounded-[2rem] overflow-hidden bg-gray-50">
                           <img src={m.image_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary/10 group-hover:bg-accent/5 transition-colors">
                          <School size={64} className="group-hover:text-accent/20 transition-colors" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        {/* Headmaster Message */}
        <section className="max-w-7xl mx-auto py-32 px-8">
          {!loading && (
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/3">
                <div 
                  className="aspect-[3/4] rounded-[3rem] bg-accent/10 overflow-hidden shadow-2xl skew-y-3 cursor-pointer group"
                  onClick={() => content.headmaster.image_url && setSelectedImage(content.headmaster.image_url)}
                >
                  <img src={content.headmaster.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
              </div>
              <div className="lg:w-2/3">
                <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
                  "{content.headmaster.title}"
                </h2>
                <p className="text-muted text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                  {content.headmaster.content}
                </p>
                <div className="border-l-4 border-accent pl-6">
                  <p className="text-xl font-bold text-primary">{headmasterName}</p>
                  <p className="text-accent font-bold uppercase tracking-widest text-xs">{headmasterPost}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
