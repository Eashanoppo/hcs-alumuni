"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Shield,
  Database,
  Lock,
  Eye,
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";

const LAST_UPDATED = "২৯ মার্চ ২০২৬";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <main className="grow pt-32 pb-24">
        {/* Page Header */}
        <header className="max-w-3xl mx-auto px-6 md:px-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-0.5 w-12 bg-accent" />
            <span className="text-accent font-bold tracking-widest text-sm uppercase">
              Legal
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-6 leading-tight">
            গোপনীয়তা নীতি
          </h1>
          <p className="text-lg text-muted leading-relaxed font-medium">
            আপনার তথ্য কীভাবে ব্যবহার করা হয় তার সংক্ষিপ্ত বিবরণ।
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
            <Shield size={16} className="text-accent" />
            <span className="text-xs font-black text-muted uppercase tracking-widest">
              সর্বশেষ আপডেট: {LAST_UPDATED}
            </span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 md:px-8 space-y-6">

          {/* What we collect */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="flex items-center gap-4 mb-7">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0">
                <Database size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
                আমরা কী তথ্য সংগ্রহ করি
              </h2>
            </div>
            <p className="text-muted leading-relaxed mb-6">
              নিবন্ধন প্রক্রিয়ায় নিম্নলিখিত তথ্যগুলি সংগ্রহ করা হয়:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "পুরো নাম (বাংলা ও ইংরেজি)",
                "পিতার নাম ও মাতার নাম",
                "জন্মতারিখ",
                "বর্তমান ও স্থায়ী ঠিকানা",
                "পেশা ও কর্মস্থল",
                "ভর্তি ও ছাড়ার বছর এবং শ্রেণি",
                "মোবাইল নম্বর ও ইমেইল",
                "প্রোফাইল ছবি",
                "পেমেন্টের তথ্য (ট্রানজেকশন আইডি)",
                "Facebook / Instagram লিংক (ঐচ্ছিক)",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-[#FAFAF7] rounded-xl px-4 py-3 border border-gray-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How data is used */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="flex items-center gap-4 mb-7">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0">
                <Lock size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
                তথ্য কীভাবে ব্যবহার হয়
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "রেজিস্ট্রেশন ও পরিচয় যাচাই",
                  desc: "আপনার নাম, জন্মতারিখ ও মোবাইল নম্বর ব্যবহার করে আপনার পরিচয় নিশ্চিত করা হয় এবং অ্যালুমনাই নম্বর তৈরি করা হয়।",
                },
                {
                  title: "লগইন ও প্রমাণীকরণ",
                  desc: "মোবাইল নম্বর ও জন্মতারিখ একসাথে ব্যবহার করে আপনার অ্যাকাউন্টে প্রবেশ নিয়ন্ত্রণ করা হয়। জন্মতারিখ এখানে পাসওয়ার্ড হিসেবে কাজ করে।",
                  warning: true,
                },
                {
                  title: "ইভেন্ট পরিকল্পনা",
                  desc: "উপস্থিতি, টি-শার্ট সাইজ এবং অতিথির সংখ্যা রজত জয়ন্তী উৎসবের আয়োজনে সহায়তার জন্য ব্যবহার করা হয়।",
                },
                {
                  title: "পেমেন্ট যাচাই",
                  desc: "ট্রানজেকশন আইডি ও প্রেরকের মোবাইল নম্বর ব্যবহার করে অ্যাডমিন পেমেন্টের সত্যতা যাচাই করেন।",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl p-5 border ${item.warning ? "bg-amber-50 border-amber-200" : "bg-[#FAFAF7] border-gray-100"}`}
                >
                  <p className={`font-black text-sm mb-1 ${item.warning ? "text-amber-800" : "text-primary"}`}>
                    {item.title}
                    {item.warning && " ⚠️"}
                  </p>
                  <p className={`text-sm leading-relaxed ${item.warning ? "text-amber-700" : "text-muted"}`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Data visibility */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="flex items-center gap-4 mb-7">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0">
                <Eye size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
                কোন তথ্য প্রকাশ্য
              </h2>
            </div>
            <p className="text-muted leading-relaxed mb-6">
              অ্যাডমিন অনুমোদনের পরে আপনার প্রোফাইল অ্যালুমনাই ডাইরেক্টরিতে দৃশ্যমান হবে।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-4">
                  সর্বসাধারণ দেখতে পাবেন
                </h4>
                <ul className="space-y-2">
                  {["নাম", "প্রোফাইল ছবি", "ব্যাচ", "পেশা ও কর্মস্থল", "শিক্ষা প্রতিষ্ঠান"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-700 mb-4">
                  শুধু অ্যাডমিন দেখতে পাবেন
                </h4>
                <ul className="space-y-2">
                  {["জন্মতারিখ", "মোবাইল নম্বর", "ইমেইল", "ঠিকানা", "পেমেন্ট তথ্য", "পিতা ও মাতার নাম"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-red-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Your rights */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="flex items-center gap-4 mb-7">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0">
                <UserCheck size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
                আপনার অধিকার
              </h2>
            </div>
            <div className="space-y-3">
              {[
                { title: "তথ্য দেখা", desc: "লগইনের পর /profile পেজে আপনার সকল তথ্য দেখতে পারবেন।" },
                { title: "তথ্য আপডেট", desc: "নাম, ঠিকানা, পেশা, ইমেইল ও ছবি /profile/edit পেজে আপডেট করা যাবে।" },
                { title: "তথ্য মুছে ফেলা", desc: "আপনার তথ্য সরিয়ে দিতে চাইলে নিচের যোগাযোগ মাধ্যমে অনুরোধ পাঠান।" },
              ].map((right) => (
                <div key={right.title} className="flex gap-4 bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100">
                  <span className="mt-0.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                  <div>
                    <p className="font-black text-sm text-primary mb-0.5">{right.title}</p>
                    <p className="text-sm text-muted leading-relaxed">{right.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="flex items-center gap-4 mb-7">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0">
                <Mail size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
                যোগাযোগ
              </h2>
            </div>
            <p className="text-muted leading-relaxed mb-6">
              গোপনীয়তা সম্পর্কিত যেকোনো প্রশ্নের জন্য:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-black transition-all"
              >
                <Mail size={18} />
                যোগাযোগ পেজ
              </Link>
              <div className="flex items-center gap-3 px-8 py-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl text-primary font-bold">
                <Phone size={18} className="text-accent" />
                <span className="text-sm">হটলাইন: ০১৯১২-৫৯১৪৯২</span>
              </div>
            </div>
          </section>

          {/* ToS Banner */}
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">
                সংশ্লিষ্ট দলিল
              </p>
              <h3 className="text-2xl font-black">ব্যবহারের শর্তাবলীও পড়ুন</h3>
              <p className="text-white/60 text-sm mt-1">
                প্ল্যাটফর্ম ব্যবহারের নিয়ম ও যোগ্যতা সম্পর্কে জানুন।
              </p>
            </div>
            <Link
              href="/terms-of-service"
              className="shrink-0 px-8 py-4 bg-accent text-primary font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg"
            >
              Terms of Service →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
