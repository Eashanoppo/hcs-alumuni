"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Mail, Phone, GraduationCap, Award, Search, Filter } from "lucide-react"
import { useState } from "react"

const teachers = [
  {
    name: "জনাব আব্দুল করিম",
    role: "সিনিয়র সহকারী শিক্ষক",
    dept: "Science",
    education: "BSc (Hons), MSc (DU)",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIvIRpcexNYlpXjRnv9eIItrtlJxj1HPPaR64jmbMwzfxXkaFCEwjTicxTp8_9FvkTMQEcT7aY6H5Mat2UaifI8x9LNJK2vHFMiGrAJQGksRlyo4KfS7LUeptMDXGvnIU7aj_qiyqSm5k4XGH-e3ZKSh8Qh3ZNy5fAIUHCgUqHFuCcLWooAJTkqjrKsRhMf_Ae6JrTVMN0yXLDb7jLV0P7twUbiwP6qkQVGUHn8vKDWeOGQhnSjbUU8U7y_Lb-U2fJPgs18Y8wJXQ"
  },
  {
    name: "ড. সুরাইয়া বেগম",
    role: "বিভাগীয় প্রধান, বাংলা",
    dept: "Humanities",
    education: "PhD in Literature",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoI-2RCDd4r9Ui2cuB77_xvb_r_yEDCRS1wIQwmsg7IzB-R783RAluiUNRa6dS7qP41wFWKg6g8xcCLPbMrjnDpI9K8rYzYtci8Q4KhzbqF26ssJrh9arll_FAgBcGNfG30Yu4iQ5bfwAHTAZmf19RE0Tr4cs12aqZHmzoqPgwkzYmhsC2Z-F9xBt-l32nlBnq9MbkgDJurd0-DSC3crigH_b36nCwnYpQyiL4H2ort88Fyo7CWu5hjU7QVpadrXWlboPlrSodLJg"
  },
  {
    name: "জনাব রাজিব আহমেদ",
    role: "সহকারী শিক্ষক (হিসাববিজ্ঞান)",
    dept: "Business",
    education: "MBA (Finance)",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0gFCq0QVqs-Oi8x1d1J_lD4Mmq5icEicPd-Mo6UJwf6_EcL9BSGKNLKB93Dyje1LwV2CrrV2IV18p70_neIs4cf7aLerRde3xaUzw2zKFRRLHiboejtMOb7t3EQUJnPEglpyKTVhladL3uabUIzK769Og7XylHbDSwX6aXuoqhVBPB5x8efdByMQoieaZZ9XArC8qV8SEob9iot4f2wHYYOQNbkooZKl9gDP2LPDmZdGJzHosmtWZGBEIuXO5rJy303A2W4OtRmo"
  },
  {
    name: "নাসরিন সুলতানা",
    role: "সহকারী শিক্ষক (গণিত)",
    dept: "Science",
    education: "BSc in Math",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs__z4rqYIoW6GxPaBiTAyRDQ2H6k3O-_gnprwSqTkYOqtrt7K6-xI_78hTkYESeOSyKkppgkt0wgoGhupEE6D9nXcWdqQxycj7wfmpu6R-MA7KOn-Cn9jyfV0ls-6cThuCnrAv0gHrj6b1eCJZ_l-Ov6CsdyoTaV7GEaFnwiWrmEfNXu36J3GDHRAXgMhbTdtkcMV-_oX_Yl7gQiSXEOIFvO7JmecB97CCUuH-29HTjNrHB4PZlQnk5r_sQOlK_HFcB_dLo4fbfY"
  }
]

export default function TeachersPage() {
  const [filter, setFilter] = useState('All')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <header className="max-w-7xl mx-auto px-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-12 bg-accent"></span>
            <span className="text-accent font-bold tracking-widest text-sm uppercase">Faculty of Excellence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-8 leading-tight">
            জ্ঞানের আলো ছড়াচ্ছেন যারা
          </h1>
          <p className="text-lg text-muted max-w-3xl leading-relaxed">
            পঁচিশ বছরের অভিজ্ঞতায় সমৃদ্ধ আমাদের শিক্ষকবৃন্দ কেবল পাঠ্যপুস্তক পড়ান না, তারা শিক্ষার্থীদের জীবন গড়ার কারিগর।
          </p>
        </header>

        {/* Filter Bar */}
        <section className="bg-white border-y border-gray-100 sticky top-20 z-40 mb-16">
          <div className="max-w-7xl mx-auto px-8 py-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex gap-4">
              {['All', 'Science', 'Humanities', 'Business'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-muted hover:bg-background'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" placeholder="শিক্ষক খুঁজুন..." className="pl-12 pr-4 py-3 bg-background border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all text-sm w-64" />
            </div>
          </div>
        </section>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.filter(t => filter === 'All' || t.dept === filter).map((t, i) => (
            <div key={i} className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all p-4">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-primary/5">
                <img src={t.photo} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
              </div>
              <div className="px-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 block">{t.dept} Faculty</span>
                <h3 className="text-xl font-bold text-primary mb-1">{t.name}</h3>
                <p className="text-muted text-xs font-medium mb-6">{t.role}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex gap-3">
                    <button className="p-2 bg-background rounded-full text-primary hover:bg-accent hover:text-white transition-all"><Mail size={14} /></button>
                    <button className="p-2 bg-background rounded-full text-primary hover:bg-accent hover:text-white transition-all"><Phone size={14} /></button>
                  </div>
                  <span className="text-[9px] font-bold text-muted/60 text-right max-w-[80px] leading-tight uppercase">{t.education}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legacy Guidance */}
        <section className="mt-32 bg-primary-dark p-12 md:p-20 rounded-[3rem] max-w-7xl mx-auto mx-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-accent/20 overflow-hidden flex-shrink-0">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArX9-oSd_daLlPdfGlzqagWMisJj7OeQXBtDrZhL98QxqY6bk1gfuk5rr-FVvZvBD_X5CpXnwnh23aMO9BKyXWGzpfCdIKnHrnoCWt2OvQgZJbv9eK5yt4< SAME >" className="w-full h-full object-cover grayscale" />
            </div>
            <div>
              <span className="text-accent font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Our Founder & Guide</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">মরহুম আলহাজ্ব নাসির উদ্দিন</h2>
              <p className="text-white/60 text-lg md:text-xl max-w-2xl">
                "শিক্ষাই হোক মুক্তির পথ — এই মূলমন্ত্র নিয়েই তিনি রোপণ করেছিলেন আজকের এই মহীরুহের চারাটি।"
              </p>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
