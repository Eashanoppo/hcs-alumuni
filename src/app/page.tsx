"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [visions, setVisions] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const backgroundImages = [
    "/images/pic-4.webp",
    "/images/pic-2.webp",
    "/images/pic-1.webp",
  ];

  useEffect(() => {
    async function fetchData() {
      // Fetch latest 4 gallery images
      const { data: galleryData } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      // Fetch latest 3 notices
      const { data: noticeData } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch visions
      const { data: visionsData } = await supabase
        .from("visions")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(4);

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(3);

      if (galleryData) setGalleryImages(galleryData);
      if (noticeData) setNotices(noticeData);
      if (visionsData) setVisions(visionsData);
      if (testimonialsData) setTestimonials(testimonialsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans overflow-x-hidden">
      <Navbar />
      <main>
        {/* Cinematic Hero */}
        <section className="relative min-h-screen lg:h-screen bg-primary-dark">
          {/* Background Carousel */}
          <div className="absolute inset-0 z-0" ref={emblaRef}>
            <div className="flex h-full">
              {backgroundImages.map((src, index) => (
                <div key={index} className="relative flex-[0_0_100%] h-full">
                  <img
                    src={src}
                    alt={`Hero Background ${index + 1}`}
                    className="w-full h-full object-cover opacity-60"
                  />
                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark/90 via-primary-dark/40 to-transparent lg:from-primary-dark/80 lg:via-primary-dark/20"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-8 flex flex-col justify-center items-start pt-32 pb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 },
                },
              }}
              className="w-full max-w-3xl"
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] text-white text-left"
              >
                Holy Crescent School <br />
                <span className="text-accent font-serif font-medium">
                  Alumni Portal
                </span>
              </motion.h1>

              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="mb-7 lg:mb-8 text-left"
              >
                <span className="inline-block px-6 py-4 bg-accent/20 border border-accent/30 rounded-full text-accent font-black tracking-[0.2em] uppercase text-[14px] backdrop-blur-sm">
                  Established 2001 • Celebrating 25 Years
                </span>
              </motion.div>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-white/90 text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl leading-relaxed font-normal text-left"
              >
                আড়াই দশকের জ্ঞান ও নৈতিকতার এক অনন্য যাত্রা। আমাদের প্রাক্তন
                শিক্ষার্থীদের এই বিশাল পরিবারে আপনাকে স্বাগতম।
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col sm:flex-row items-center justify-start gap-5 mb-12"
              >
                <Link
                  href="/registration"
                  className="w-full sm:w-auto px-10 py-5 bg-accent text-primary-dark rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  রেজিস্ট্রেশন করুন
                  <ArrowRight size={22} />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all text-center"
                >
                  আমাদের সম্পর্কে
                </Link>
              </motion.div>

              {/* Integrated Stats */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-wrap items-center justify-start gap-10 lg:gap-16 py-6 border-t border-white/10"
              >
                {[
                  { label: "স্মৃতিময় বছর", val: "২৫+" },
                  { label: "প্রাক্তন শিক্ষার্থী", val: "৫০০০+" },
                  { label: "সাফল্যের হার", val: "১০০%" },
                ].map((s, i) => (
                  <div key={i} className="text-left group/item">
                    <p className="text-3xl font-bold text-white leading-none mb-1">
                      {s.val}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
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
                  <img
                    src="/images/pic-3.webp"
                    alt="School Mascot/Heritage"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                </div>
                <div className="absolute -bottom-16 -right-8 bg-accent p-12 rounded-[3rem] text-primary shadow-2xl max-w-sm border-8 border-white">
                  <h3 className="text-2xl font-black mb-4 leading-tight text-white">
                    জ্ঞানের পথে এক অনবদ্য যাত্রা
                  </h3>
                  <p className="text-white/80 font-bold leading-relaxed">
                    ২০০১ সাল থেকে আজ পর্যন্ত আমরা শিক্ষার গুণগত মান ধরে রাখতে
                    নিরলসভাবে কাজ করে যাচ্ছি।
                  </p>
                </div>
              </motion.div>

              <div className="space-y-16">
                <div>
                  <div className="h-1.5 w-24 bg-accent mb-10"></div>
                  <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-8">
                    আমাদের লক্ষ্য ও আদর্শ
                  </h2>
                  <p className="text-muted text-xl font-medium leading-loose">
                    হলি ক্রিসেন্ট স্কুলে আমরা বিশ্বাস করি প্রতিটি শিক্ষার্থীই
                    অনন্য। আমাদের লক্ষ্য হলো তাদের মেধা ও চিন্তার বিকাশ ঘটিয়ে
                    ভবিষ্যতের যোগ্য নাগরিক হিসেবে গড়ে তোলা।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {loading ? (
                    [1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-32 bg-gray-50 rounded-3xl animate-pulse"
                      />
                    ))
                  ) : visions.length > 0 ? (
                    visions.map((v, i) => (
                      <div
                        key={v.id || i}
                        className="group p-8 border border-gray-100 rounded-3xl hover:border-accent transition-all hover:shadow-premium bg-[#FAFAF7] md:bg-white"
                      >
                        <h4 className="text-lg font-black text-primary mb-3 group-hover:text-accent transition-colors">
                          {v.title}
                        </h4>
                        <p className="text-muted font-bold text-sm leading-relaxed">
                          {v.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    null
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voice of Alumni: Testimonials */}
        <section className="py-40 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-6 uppercase">
                Voice of Alumni
              </h2>
              <p className="text-muted text-xl font-black tracking-[0.3em] uppercase text-[10px]">
                What our graduates say about their journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-64 bg-[#FAFAF7] rounded-[3rem] animate-pulse"
                  />
                ))
              ) : testimonials.length > 0 ? (
                testimonials.map((t, i) => (
                  <motion.div
                    key={t.id || i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-12 bg-[#FAFAF7] rounded-[3rem] border border-gray-100 flex flex-col justify-between group hover:bg-primary transition-all duration-500 shadow-sm"
                  >
                    <div className="mb-10 text-accent group-hover:text-white transition-colors">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-primary text-xl font-bold leading-relaxed mb-10 group-hover:text-white/90 transition-colors italic">
                      "{t.quote}"
                    </p>
                    <div>
                      <h4 className="font-black text-primary group-hover:text-[#CEB888] transition-colors">
                        {t.name}
                      </h4>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted group-hover:text-white/50 transition-colors">
                        {t.batch}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-muted">
                  No testimonials found.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Preview: Memory Lane */}
        <section className="py-24 md:py-40 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
              <div>
                <h2 className="text-4xl md:text-7xl font-black text-[#CEB888] tracking-tighter mb-4 md:mb-6 underline decoration-white/10 underline-offset-12">
                  Memory Lane
                </h2>
                <p className="text-white/60 text-lg md:text-xl font-bold">
                  Capturing moments that define us
                </p>
              </div>
              <Link
                href="/gallery"
                className="group flex items-center gap-6 text-[#CEB888] font-black text-xs uppercase tracking-[0.3em]"
              >
                শৈশবের স্মৃতিগুলো{" "}
                <div className="p-4 bg-white text-primary rounded-2xl group-hover:bg-accent transition-all shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {loading ? (
                [1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="aspect-square rounded-[2rem] bg-white/5 animate-pulse"
                  />
                ))
              ) : galleryImages.length > 0 ? (
                galleryImages.map((photo, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                    className="aspect-square rounded-4xl overflow-hidden border-4 border-white/10 group shadow-2xl"
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-white/40">
                  কোনো স্মৃতি পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Home page: Existing updates section */}
        <section className="py-24 md:py-40 bg-[#FAFAF7] relative overflow-hidden border-t border-primary/5">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
              <div>
                <h2 className="text-4xl md:text-7xl font-black text-primary tracking-tighter mb-4 md:mb-6 underline decoration-accent/20 underline-offset-12">
                  গুরত্বপূর্ণ আপডেট
                </h2>
                <p className="text-muted text-lg md:text-xl font-bold">
                  এক নজরে সবশেষ প্রাতিষ্ঠানিক সংবাদসমূহ
                </p>
              </div>
              <Link
                href="/notices"
                className="group flex items-center gap-6 text-primary font-black text-xs uppercase tracking-[0.3em] self-start md:self-auto"
              >
                সবগুলো দেখুন{" "}
                <div className="p-4 bg-primary text-white rounded-2xl group-hover:bg-black transition-all shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white p-12 rounded-[3.5rem] h-64 animate-pulse flex items-center justify-center"
                  >
                    <Loader2
                      className="animate-spin text-primary/5"
                      size={40}
                    />
                  </div>
                ))
              ) : notices.length > 0 ? (
                notices.map((notice, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8 }}
                    className="bg-white p-12 rounded-[3rem] shadow-premium hover:shadow-[0_40px_80px_rgba(31,61,43,0.08)] transition-all flex flex-col justify-between border border-gray-100 h-full"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-10">
                        <span className="px-6 py-2.5 bg-background text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/5 leading-none">
                          {notice.category}
                        </span>
                        <span className="text-muted font-black text-[10px] uppercase tracking-widest">
                          {new Date(notice.created_at).toLocaleDateString(
                            "bn-BD",
                          )}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-primary mb-8 leading-[1.2] group-hover:text-accent transition-colors">
                        {notice.title}
                      </h3>
                    </div>
                    <Link
                      href={`/notices/${notice.id}`}
                      className="text-accent font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 group/link pt-8 border-t border-gray-50"
                    >
                      বিস্তারিত পড়ুন{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover/link:translate-x-1 transition-transform"
                      />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-muted">
                  কোনো নোটিশ পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
