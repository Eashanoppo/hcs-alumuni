"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <header className="max-w-7xl mx-auto px-8 mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-12 bg-accent"></span>
            <span className="text-accent font-bold tracking-widest text-sm uppercase">Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-8 leading-tight">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            আপনার যেকোনো জিজ্ঞাসা বা পরামর্শের জন্য আমরা সবসময় প্রস্তুত। নিচের ফরমটি পূরণ করুন অথবা আমাদের সরাসরি কল করুন।
          </p>
        </header>

        <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Details */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: <MapPin />, label: "ঠিকানা", val: "পবিত্র ক্রিসেন্ট স্কুল ক্যাম্পাস, ঢাকা-চট্টগ্রাম রোড", color: "bg-blue-500" },
                { icon: <Phone />, label: "ফোন নম্বর", val: "+৮৮০ ১২৩৪ ৫৬৭৮৯০", color: "bg-emerald-500" },
                { icon: <Mail />, label: "ইমেইল", val: "info@holycrescent.edu", color: "bg-amber-500" },
                { icon: <Clock />, label: "অফিস আওয়ার", val: "শনিবার - বৃহস্পতিবার (সকাল ৮টা - বিকেল ৩টা)", color: "bg-primary" },
              ].map((c, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-start hover:shadow-xl transition-all h-full">
                   <div className={`${c.color} p-4 rounded-2xl text-white mb-6 shadow-lg`}>
                      {c.icon}
                   </div>
                   <h3 className="text-[10px] font-black tracking-widest uppercase text-muted mb-2">{c.label}</h3>
                   <p className="font-bold text-primary leading-relaxed">{c.val}</p>
                </div>
              ))}
            </div>

            <div className="bg-primary p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-6 text-accent">জরুরি সহায়তা</h3>
                  <p className="text-white/60 mb-8 leading-relaxed">অ্যালুমনাই রেজিস্ট্রেশন সংক্রান্ত যেকোনো জটিলতায় আমাদের হটলাইনে যোগাযগ করুন।</p>
                  <div className="flex items-center gap-4 text-2xl font-bold">
                    <Phone className="text-accent" size={32} />
                    ০১৭ ১২৩৪ ৫৬৭৮
                  </div>
               </div>
               <MessageSquare className="absolute -right-12 -bottom-12 opacity-5 text-accent rotate-12" size={240} />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-100">
             <h3 className="text-3xl font-black text-primary mb-10 tracking-tight">সরাসরি মেসেজ পাঠান</h3>
             <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-muted uppercase tracking-widest ml-2">আপনার নাম</label>
                      <input type="text" className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium" placeholder="আব্দুল করিম" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-muted uppercase tracking-widest ml-2">ইমেইল</label>
                      <input type="email" className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium" placeholder="mail@example.com" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-muted uppercase tracking-widest ml-2">বিষয়</label>
                   <input type="text" className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium" placeholder="রেজিস্ট্রেশন সংক্রান্ত জিজ্ঞাসা" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-muted uppercase tracking-widest ml-2">মেসেজ</label>
                   <textarea rows={5} className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium resize-none" placeholder="আপনার মেসেজটি এখানে লিখুন..."></textarea>
                </div>
                <button className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 text-lg">
                   মেসেজ পাঠান <Send size={20} />
                </button>
             </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
