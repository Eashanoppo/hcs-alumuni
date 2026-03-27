"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Calendar,
  Tag,
  ChevronLeft,
  Share2,
  Printer,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NoticeDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-8 max-w-5xl mx-auto w-full">
        <Link
          href="/notices"
          className="inline-flex items-center gap-2 text-muted font-bold hover:text-accent mb-12 transition-colors group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          নোটিশ বোর্ডে ফিরে যান
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3.5rem] p-10 md:p-20 shadow-premium border border-gray-100"
        >
          <div className="flex flex-wrap items-center gap-6 mb-10 pb-10 border-b border-gray-100">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest">
              <Calendar size={14} className="text-accent" />
              ১২ জুন, ২০২৪
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-black text-xs uppercase tracking-widest">
              <Tag size={14} className="text-primary/40" />
              অ্যাকাডেমিক
            </div>
            <div className="ml-auto flex gap-4">
              <button className="p-3 bg-background rounded-xl text-muted hover:text-accent transition-colors">
                <Share2 size={18} />
              </button>
              <button className="p-3 bg-background rounded-xl text-muted hover:text-accent transition-colors">
                <Printer size={18} />
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-primary leading-tight mb-12 tracking-tighter">
            রজত জয়ন্তী রেজিস্ট্রেশনের শেষ তারিখ এবং বিশেষ নির্দেশনাবলী
          </h1>

          <div className="prose prose-lg max-w-none text-muted leading-relaxed font-medium space-y-8">
            <p className="text-xl text-primary/80 font-bold leading-relaxed">
              হলি ক্রিসেন্ট স্কুলের সকল প্রাক্তন শিক্ষার্থীদের সদয় অবগতির জন্য
              জানানো যাচ্ছে যে, আমাদের প্রতিষ্ঠানের ২৫ বছর পূর্তি উপলক্ষে আয়োজিত
              রজত জয়ন্তী উৎসবের রেজিস্ট্রেশনের সময়সীমা বর্ধিত করা হয়েছে।
            </p>
            <p>
              আগামী ৩০ জুন, ২০২৪ তারিখ পর্যন্ত আপনারা অনলাইনে রেজিস্ট্রেশন
              সম্পন্ন করতে পারবেন। এই উৎসবের মূল লক্ষ্য হলো আমাদের দীর্ঘ দিনের
              এই পথচলায় যারা সঙ্গী ছিলেন, তাদের সকলকে এক ছাদের নিচে নিয়ে আসা।
            </p>
            <div className="bg-background p-8 rounded-3xl border-l-8 border-accent">
              <h4 className="text-primary font-black mb-4">
                রেজিস্ট্রেশনের জন্য প্রয়োজনীয় তথ্য:
              </h4>
              <ul className="list-disc ml-6 space-y-3 font-bold">
                <li>সঠিক মোবাইল নম্বর এবং ইমেইল।</li>
                <li>টি-শার্ট সাইজ (S, M, L, XL, XXL)।</li>
                <li>
                  প্রাক্তন শিক্ষার্থীর ছবি এবং প্রযোজ্য ক্ষেত্রে এসএসসি পাসের
                  প্রমাণক।
                </li>
              </ul>
            </div>
            <p>
              রেজিস্ট্রেশন পরবর্তী যেকোনো সহযোগিতার জন্য আমাদের হেল্পলাইন
              নম্বরে যোগাযোগ করুন অথবা সরাসরি স্কুল অফিসে যোগাযোগ করতে পারেন।
            </p>
          </div>

          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 p-6 bg-background rounded-2xl w-full md:w-auto">
              <div className="p-4 bg-primary text-white rounded-xl shadow-lg">
                <Download size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-muted tracking-widest mb-1">
                  Attached Document
                </p>
                <p className="font-bold text-primary">
                  notice_june_2024.pdf (2.4 MB)
                </p>
              </div>
            </div>
            <Link
              href="/registration"
              className="w-full md:w-auto px-10 py-5 bg-accent text-primary font-black rounded-2xl shadow-xl hover:shadow-accent/30 hover:-translate-y-1 transition-all text-center"
            >
              রেজিস্ট্রেশন করুন
            </Link>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}
