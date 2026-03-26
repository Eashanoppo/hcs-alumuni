"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { ArrowRight, Trophy, Users, Calendar, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Ivory Academic Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAF7] pt-20">
          <div className="absolute inset-0 z-0 opacity-40">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
          </div>
          
          <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                }
              }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <span className="inline-block px-8 py-2.5 bg-primary/5 border border-primary/10 rounded-full text-primary font-black tracking-[0.4em] uppercase text-[10px] mb-10">
                  Established 1999 • Celebrating 25 Years
                </span>
              </motion.div>
              
              <motion.h1 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-primary"
              >
                Holy Crescent <br />
                <span className="text-accent italic font-serif serif-style">School Alumni</span>
              </motion.h1>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-muted text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                আড়াই দশকের জ্ঞান ও নৈতিকতার এক অনন্য যাত্রা। আমাদের প্রাক্তন শিক্ষার্থীদের এই বিশাল পরিবারে আপনাকে স্বাগতম।
              </motion.p>
              
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col sm:flex-row items-center justify-center gap-8"
              >
                <Link 
                  href="/registration" 
                  className="w-full sm:w-auto px-14 py-6 bg-primary text-white rounded-2xl font-black text-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden shadow-lg"
                >
                  রেজিস্ট্রেশন করুন
                  <ArrowRight size={24} />
                </Link>
                <Link 
                  href="/about" 
                  className="w-full sm:w-auto px-14 py-6 bg-white border-2 border-primary/10 text-primary rounded-2xl font-black text-xl hover:bg-primary/5 transition-all"
                >
                  আমাদের সম্পর্কে
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-20 py-8 px-16 border-t border-primary/5 group">
             {[
               { label: "স্মৃতিময় বছর", val: "২৫+" },
               { label: "প্রাক্তন শিক্ষার্থী", val: "৫০০০+" },
               { label: "সাফল্যের হার", val: "১০০%" }
             ].map((s, i) => (
               <div key={i} className="text-center group/item hover:-translate-y-1 transition-transform">
                  <p className="text-4xl font-black text-primary leading-none mb-2">{s.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{s.label}</p>
               </div>
             ))}
          </div>
        </section>

        {/* Mission & Values: Educational Focus */}
        <section className="py-40 bg-white">
           <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <motion.div 
                   initial={{ opacity: 0, x: -30 }} 
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="relative"
                 >
                    <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-premium relative">
                       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO4oRkDNLaFpDU2m5xwsP2nelcqJyRcEei2u2eAU1VNvcp8MIIOm_siZKvxBtHzxSG6BTlF7mifHQFdPmn7dgcKBE8AP2MxG9PyOEYLm5RO9Hp1OH6WbFQ_vSjDGyq2mb9RSw9WwPikNHr7HpacXpfpTYkJfDq-bYZuqdnV6dU9_RAOe6H1D075Kp6JwALnr0uUuGk4PSPa2NDwip7ataTQrYjg-0MX7l3SKFx_W57Ba4sIuLLYBwd0GVUJdATieaTLe0ctmH7J6Y" alt="School Mascot/Heritage" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                    </div>
                    <div className="absolute -bottom-16 -right-16 bg-accent p-12 rounded-[3rem] text-primary shadow-2xl max-w-sm border-8 border-white">
                       <h3 className="text-2xl font-black mb-4 leading-tight text-white">জ্ঞানের পথে এক অনবদ্য যাত্রা</h3>
                       <p className="text-white/80 font-bold leading-relaxed">১৯৯৯ সাল থেকে আজ পর্যন্ত আমরা শিক্ষার গুণগত মান ধরে রাখতে নিরলসভাবে কাজ করে যাচ্ছি।</p>
                    </div>
                 </motion.div>

                 <div className="space-y-16">
                    <div>
                       <div className="h-1.5 w-24 bg-accent mb-10"></div>
                       <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-8 italic">আমাদের লক্ষ্য ও আদর্শ</h2>
                       <p className="text-muted text-xl font-medium leading-loose">
                          পবিত্র ক্রিসেন্ট স্কুলে আমরা বিশ্বাস করি প্রতিটি শিক্ষার্থীই অনন্য। আমাদের লক্ষ্য হলো তাদের মেধা ও চিন্তার বিকাশ ঘটিয়ে ভবিষ্যতের যোগ্য নাগরিক হিসেবে গড়ে তোলা।
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       {[
                         { title: "নৈতিক শিক্ষা", desc: "মূল্যবোধ ও চারিত্রিক গঠনের গুরুত্ব।" },
                         { title: "সৃজনশীলতা", desc: "নতুন কিছু করার উৎসাহ ও উদ্দীপনা।" },
                         { title: "নেতৃত্ব", desc: "আগামীদিনের দায়িত্ব নিতে শেখানো।" },
                         { title: "ঐতিহ্য", desc: "স্কুলের গৌরবময় ইতিহাস ধারণ করা।" }
                       ].map((v, i) => (
                         <div key={i} className="group p-8 border border-gray-100 rounded-3xl hover:border-accent transition-all hover:shadow-premium">
                            <h4 className="text-lg font-black text-primary mb-3 group-hover:text-accent transition-colors">{v.title}</h4>
                            <p className="text-muted font-bold text-sm leading-relaxed">{v.desc}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Voice of Alumni: Testimonials */}
        <section className="py-40 bg-white">
           <div className="max-w-7xl mx-auto px-8">
              <div className="text-center mb-24">
                 <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-6 uppercase italic">Voice of Alumni</h2>
                 <p className="text-muted text-xl font-black tracking-[0.3em] uppercase text-[10px]">What our graduates say about their journey</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                 {[
                   { name: "Dr. Ahmed Sharif", batch: "SSC 2005", quote: "পবিত্র ক্রিসেন্ট স্কুল আমার জীবনের ভিত্তিপ্রস্তর স্থাপন করেছে। এখানকার শৃঙ্খলা ও শিক্ষা আমাকে আজকের এই অবস্থানে নিয়ে এসেছে।" },
                   { name: "Sultana Razia", batch: "SSC 2012", quote: "স্কুলের দিনগুলো আজও খুব মনে পড়ে। বন্ধুদের সাথে আড্ডা আর শিক্ষকদের শাসন দুটোই ছিল আশীর্বাদস্বরূপ।" },
                   { name: "Tanvir Hasan", batch: "SSC 2018", quote: "শিক্ষার পাশাপাশি সৃজনশীল সব কাজে অংশ নেওয়ার সুযোগ আমার আত্মবিশ্বাস বাড়িয়ে দিয়েছিল বহুগুণ।" }
                 ].map((t, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="p-12 bg-[#FAFAF7] rounded-[3rem] border border-gray-100 flex flex-col justify-between group hover:bg-primary transition-all duration-500"
                   >
                      <div className="mb-10 text-accent group-hover:text-white transition-colors">
                         <ImageIcon size={32} />
                      </div>
                      <p className="text-primary text-xl font-bold leading-relaxed mb-10 italic group-hover:text-white/90 transition-colors">"{t.quote}"</p>
                      <div>
                         <h4 className="font-black text-primary group-hover:text-[#CEB888] transition-colors">{t.name}</h4>
                         <p className="text-[10px] uppercase font-black tracking-widest text-muted group-hover:text-white/50 transition-colors">{t.batch}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Gallery Preview: Memory Lane */}
        <section className="py-40 bg-primary relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
           <div className="max-w-7xl mx-auto px-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                 <div>
                    <h2 className="text-5xl md:text-7xl font-black text-[#CEB888] tracking-tighter mb-6 underline decoration-white/10 underline-offset-12">Memory Lane</h2>
                    <p className="text-white/60 text-xl font-bold italic">Capturing moments that define us</p>
                 </div>
                 <Link href="/gallery" className="group flex items-center gap-6 text-[#CEB888] font-black text-xs uppercase tracking-[0.3em]">
                    শৈশবের স্মৃতিগুলো <div className="p-4 bg-white text-primary rounded-2xl group-hover:bg-accent transition-all shadow-lg"><ArrowRight size={20} /></div>
                 </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[1, 2, 3, 4].map((n) => (
                   <motion.div 
                     key={n}
                     whileHover={{ scale: 1.05, rotate: n % 2 === 0 ? 2 : -2 }}
                     className="aspect-square rounded-[2rem] overflow-hidden border-4 border-white/10 group shadow-2xl"
                   >
                      <img src={`https://picsum.photos/800/800?random=${n+10}`} alt="Gallery Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Home page: Existing updates section */}
        <section className="py-40 bg-[#FAFAF7] relative overflow-hidden border-t border-primary/5">
           <div className="max-w-7xl mx-auto px-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                 <div>
                    <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-6 underline decoration-accent/20 underline-offset-12">গুরত্বপূর্ণ আপডেট</h2>
                    <p className="text-muted text-xl font-bold">এক নজরে সবশেষ প্রাতিষ্ঠানিক সংবাদসমূহ</p>
                 </div>
                 <Link href="/notices" className="group flex items-center gap-6 text-primary font-black text-xs uppercase tracking-[0.3em]">
                    সবগুলো দেখুন <div className="p-4 bg-primary text-white rounded-2xl group-hover:bg-black transition-all shadow-lg"><ArrowRight size={20} /></div>
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[
                   { title: "রজত জয়ন্তী রেজিস্ট্রেশনের সময়সীমা বর্ধিত", date: "১২ জুন, ২০২৪", cat: "অ্যালুমনাই" },
                   { title: "বার্ষিক ক্রীড়া প্রতিযোগিতার ফলাফল প্রকাশ", date: "১০ জুন, ২০২৪", cat: "অ্যাকাডেমিক" },
                   { title: "নতুন সেশনে ভর্তির জন্য আবেদন আহ্বান", date: "০৫ জুন, ২০২৪", cat: "ভর্তি" }
                 ].map((notice, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ y: -8 }}
                     className="bg-white p-12 rounded-[3.5rem] shadow-premium hover:shadow-[0_40px_80px_rgba(31,61,43,0.08)] transition-all flex flex-col justify-between border border-gray-100 h-full"
                   >
                      <div>
                        <div className="flex justify-between items-center mb-10">
                           <span className="px-6 py-2.5 bg-background text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/5 leading-none">{notice.cat}</span>
                           <span className="text-muted font-black text-[10px] uppercase tracking-widest">{notice.date}</span>
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-8 leading-[1.2] group-hover:text-accent transition-colors">{notice.title}</h3>
                      </div>
                      <Link href="/notices/1" className="text-accent font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 group/link pt-8 border-t border-gray-50">
                         বিস্তারিত পড়ুন <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
