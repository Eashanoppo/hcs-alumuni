"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Shield,
  Database,
  Image,
  Lock,
  Globe,
  Cookie,
  Eye,
  UserCheck,
  AlertTriangle,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

const LAST_UPDATED = "২৯ মার্চ ২০২৬";

interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "intro",
    icon: <Shield size={22} />,
    title: "ভূমিকা (Introduction)",
    content: (
      <p className="text-muted leading-relaxed">
        এই গোপনীয়তা নীতি হলি ক্রিসেন্ট স্কুল (HCS) অ্যালুমনাই পোর্টালের
        ক্ষেত্রে প্রযোজ্য। এই প্ল্যাটফর্মটি{" "}
        <strong className="text-primary">রজত জয়ন্তী উৎসব ২০২৬</strong> উপলক্ষে
        প্রাক্তন শিক্ষার্থীদের নিবন্ধন এবং যোগাযোগের সুবিধার জন্য তৈরি। আপনি
        এই প্ল্যাটফর্ম ব্যবহার করলে, নিচে বর্ণিত শর্তাবলীতে সম্মত হলে বলে গণ্য
        হবে। আমরা আপনার ব্যক্তিগত তথ্যের সুরক্ষাকে সর্বোচ্চ গুরুত্ব দিই।
      </p>
    ),
  },
  {
    id: "data-collected",
    icon: <Database size={22} />,
    title: "আমরা কী তথ্য সংগ্রহ করি",
    content: (
      <div className="space-y-6">
        <p className="text-muted leading-relaxed">
          নিবন্ধন প্রক্রিয়ায় আপনার কাছ থেকে নিম্নলিখিত তথ্যগুলি সংগ্রহ করা হয়:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              cat: "ব্যক্তিগত পরিচয়",
              items: [
                "পুরো নাম (বাংলা ও ইংরেজি)",
                "পিতার নাম ও মাতার নাম",
                "জন্মতারিখ (লগইনের পাসওয়ার্ড হিসেবে ব্যবহৃত)",
                "বর্তমান ও স্থায়ী ঠিকানা",
                "পেশা ও কর্মস্থল",
                "প্রোফাইল ছবি",
              ],
            },
            {
              cat: "একাডেমিক তথ্য",
              items: [
                "ভর্তির বছর ও শ্রেণি",
                "স্কুল ছাড়ার বছর ও শ্রেণি",
                "সর্বশেষ সার্টিফিকেট (PESC / JSC / SSC)",
                "SSC ব্যাচ (প্রযোজ্য ক্ষেত্রে)",
                "স্কুল-জীবনের ছবি (ঐচ্ছিক)",
              ],
            },
            {
              cat: "যোগাযোগ তথ্য",
              items: [
                "মোবাইল ফোন নম্বর (প্রাথমিক শনাক্তকারী)",
                "ইমেইল ঠিকানা",
                "হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)",
                "ফেসবুক প্রোফাইল লিংক (ঐচ্ছিক)",
                "ইনস্টাগ্রাম প্রোফাইল লিংক (ঐচ্ছিক)",
              ],
            },
            {
              cat: "অংশগ্রহণ ও পেমেন্ট",
              items: [
                "অনুষ্ঠানে উপস্থিতির পরিকল্পনা",
                "স্ত্রী/স্বামী এবং সন্তানসহ অংশগ্রহণ",
                "টি-শার্ট সাইজ",
                "পেমেন্ট পদ্ধতি ও ট্রানজেকশন আইডি",
                "পেমেন্টকারীর মোবাইল নম্বর",
              ],
            },
          ].map((group) => (
            <div
              key={group.cat}
              className="bg-[#FAFAF7] rounded-2xl p-6 border border-gray-100"
            >
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                {group.cat}
              </h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "dob-password",
    icon: <Lock size={22} />,
    title: "জন্মতারিখ পাসওয়ার্ড হিসেবে ব্যবহার",
    content: (
      <div className="space-y-4">
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <AlertTriangle
            size={20}
            className="text-amber-600 shrink-0 mt-0.5"
          />
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            গুরুত্বপূর্ণ: এই প্ল্যাটফর্মে আপনার{" "}
            <strong>জন্মতারিখ একটি প্রমাণীকরণ উপাদান</strong> হিসেবে ব্যবহৃত
            হয়। মোবাইল নম্বর ও জন্মতারিখ একসাথে ব্যবহার করে আপনার অ্যাকাউন্টে
            প্রবেশ করা যায়।
          </p>
        </div>
        <p className="text-muted leading-relaxed">
          নিরাপত্তার স্বার্থে আপনার জন্মতারিখ কখনো অন্যের সাথে শেয়ার করবেন না।
          রেজিস্ট্রেশনের পরে জন্মতারিখ পরিবর্তন করার কোনো সুবিধা নেই।
        </p>
      </div>
    ),
  },
  {
    id: "image-storage",
    icon: <Image size={22} />,
    title: "ছবি সংরক্ষণ — Cloudinary",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          আপনার আপলোড করা প্রোফাইল ছবি ও স্কুল-জীবনের ছবি{" "}
          <strong className="text-primary">Cloudinary</strong> (একটি তৃতীয় পক্ষের
          CDN পরিষেবা) তে সরাসরি আপলোড হয়। Cloudinary একটি বৈশ্বিক ছবি হোস্টিং
          প্ল্যাটফর্ম যা মার্কিন যুক্তরাষ্ট্রে অবস্থিত।
        </p>
        <ul className="space-y-3">
          {[
            "ছবির URL পাবলিক CDN লিংক হিসেবে উন্মুক্ত থাকে",
            "আপনি প্রোফাইল ছবি পরিবর্তন করলে পুরনো ছবি স্বয়ংক্রিয়ভাবে মুছে যায়",
            "ছবি অবশ্যই সর্বোচ্চ ৫ মেগাবাইট এবং JPG/PNG ফরম্যাটে হতে হবে",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-muted">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "third-parties",
    icon: <Globe size={22} />,
    title: "তৃতীয় পক্ষের পরিষেবা",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          এই প্ল্যাটফর্মটি নিম্নলিখিত তৃতীয় পক্ষের পরিষেবা ব্যবহার করে:
        </p>
        <div className="space-y-3">
          {[
            {
              name: "Supabase",
              desc: "ডেটাবেস হোস্টিং — আপনার সকল কাঠামোগত তথ্য (নাম, ঠিকানা, পেমেন্ট ইত্যাদি) এখানে সংরক্ষিত হয়।",
              color: "bg-emerald-50 border-emerald-200 text-emerald-700",
            },
            {
              name: "Cloudinary",
              desc: "ছবি হোস্টিং — আপলোড করা সকল ছবি এখানে থাকে এবং পাবলিক URL দিয়ে অ্যাক্সেসযোগ্য।",
              color: "bg-blue-50 border-blue-200 text-blue-700",
            },
            {
              name: "bKash / Nagad",
              desc: "মোবাইল পেমেন্ট গেটওয়ে — পেমেন্ট লেনদেন এই প্ল্যাটফর্মের বাইরে সম্পন্ন হয়। শুধুমাত্র ট্রানজেকশন আইডি আমাদের ডেটাবেসে সংরক্ষিত হয়।",
              color: "bg-pink-50 border-pink-200 text-pink-700",
            },
            {
              name: "Vercel",
              desc: "অ্যাপ্লিকেশন হোস্টিং — ওয়েব সার্ভার লগ এবং পরিবেশ পরিবর্তনশীল এখানে পরিচালিত হয়।",
              color: "bg-gray-50 border-gray-200 text-gray-700",
            },
          ].map((service) => (
            <div
              key={service.name}
              className={`flex gap-4 p-5 rounded-2xl border ${service.color}`}
            >
              <span className="font-black text-sm shrink-0 min-w-20">
                {service.name}
              </span>
              <p className="text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "cookies",
    icon: <Cookie size={22} />,
    title: "কুকি ও সেশন ব্যবস্থাপনা",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          লগইনের পরে আপনার ব্রাউজারে একটি{" "}
          <strong className="text-primary">সেশন কুকি</strong> সেট করা হয় যা ২৪
          ঘণ্টা কার্যকর থাকে। এই কুকি ব্যবহার করে আপনার প্রোফাইলে প্রবেশ নিয়ন্ত্রণ
          করা হয়।
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Alumni সেশন কুকি",
              val: "alumni_session",
              note: "২৪ ঘণ্টা",
            },
            {
              label: "Admin সেশন কুকি",
              val: "hcs_admin_session",
              note: "২৪ ঘণ্টা — HTTP-only (নিরাপদ)",
            },
          ].map((c) => (
            <div
              key={c.val}
              className="bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                {c.label}
              </p>
              <code className="text-sm font-bold text-primary block mb-1">
                {c.val}
              </code>
              <p className="text-xs text-muted">{c.note}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">
          ব্রাউজার বন্ধ করলে বা ২৪ ঘণ্টা পরে সেশন স্বয়ংক্রিয়ভাবে শেষ হয়ে যাবে।
          কোনো স্বয়ংক্রিয় পুনর্নবীকরণ ব্যবস্থা নেই।
        </p>
      </div>
    ),
  },
  {
    id: "data-visibility",
    icon: <Eye size={22} />,
    title: "তথ্যের দৃশ্যমানতা",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          অ্যাডমিন অনুমোদনের পরে আপনার প্রোফাইল পাবলিক অ্যালুমনাই ডাইরেক্টরিতে
          দৃশ্যমান হবে। নিচে উল্লেখ করা হলো কোন তথ্যগুলি প্রকাশ্য:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-4">
              সর্বসাধারণের জন্য দৃশ্যমান
            </h4>
            <ul className="space-y-2">
              {[
                "নাম (বাংলা ও ইংরেজি)",
                "প্রোফাইল ছবি",
                "ব্যাচ / SSC ব্যাচ",
                "পেশা ও কর্মস্থল",
                "বর্তমান শিক্ষা প্রতিষ্ঠান",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-emerald-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-red-700 mb-4">
              অ-প্রকাশ্য (Admin মাত্র)
            </h4>
            <ul className="space-y-2">
              {[
                "জন্মতারিখ",
                "মোবাইল নম্বর",
                "ইমেইল ঠিকানা",
                "ঠিকানা (বর্তমান ও স্থায়ী)",
                "পেমেন্ট তথ্য",
                "পিতা ও মাতার নাম",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-red-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "rights",
    icon: <UserCheck size={22} />,
    title: "আপনার অধিকার",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          এই প্ল্যাটফর্মে নিবন্ধিত প্রতিটি সদস্য নিম্নলিখিত অধিকার ভোগ করেন:
        </p>
        <div className="space-y-3">
          {[
            {
              title: "তথ্য দেখার অধিকার",
              desc: "লগইনের পর আপনি আপনার সমস্ত সংরক্ষিত তথ্য /profile পেজে দেখতে পারবেন।",
            },
            {
              title: "তথ্য সংশোধনের অধিকার",
              desc: "নাম, ঠিকানা, পেশা, ইমেইল, ছবি সহ বেশিরভাগ তথ্য /profile/edit পেজে আপডেট করা যাবে।",
            },
            {
              title: "তথ্য সংশোধনের সীমাবদ্ধতা",
              desc: "মোবাইল নম্বর, জন্মতারিখ এবং অ্যালুমনাই নম্বর নিরাপত্তার কারণে পরিবর্তন করা যায় না।",
            },
            {
              title: "তথ্য মুছে ফেলার অনুরোধ",
              desc: "আপনার রেজিস্ট্রেশন তথ্য সম্পূর্ণ মুছে ফেলার জন্য নিচের Contact তথ্য ব্যবহার করে আমাদের সাথে যোগাযোগ করুন।",
            },
          ].map((right) => (
            <div
              key={right.title}
              className="bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100"
            >
              <p className="font-black text-sm text-primary mb-1">
                {right.title}
              </p>
              <p className="text-sm text-muted leading-relaxed">{right.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "contact",
    icon: <Mail size={22} />,
    title: "যোগাযোগ",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          এই গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন বা উদ্বেগ থাকলে আমাদের সাথে
          যোগাযোগ করুন:
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-black transition-all hover:shadow-2xl"
          >
            <Mail size={18} />
            যোগাযোগ পেজ
          </Link>
          <div className="flex items-center gap-3 px-8 py-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl text-primary font-bold">
            <Phone size={18} className="text-accent" />
            <span className="text-sm">হটলাইন: ০১৯১২-৫৯১৪৯২</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <main className="grow pt-32 pb-24">
        {/* Page Header */}
        <header className="max-w-7xl mx-auto px-6 md:px-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-0.5 w-12 bg-accent" />
            <span className="text-accent font-bold tracking-widest text-sm uppercase">
              Legal
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-6 leading-tight">
            গোপনীয়তা নীতি
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed font-medium">
            HCS অ্যালুমনাই পোর্টাল আপনার তথ্য কীভাবে সংগ্রহ করে, সংরক্ষণ করে
            এবং ব্যবহার করে তার সম্পূর্ণ বিবরণ।
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
            <Shield size={16} className="text-accent" />
            <span className="text-xs font-black text-muted uppercase tracking-widest">
              সর্বশেষ আপডেট: {LAST_UPDATED}
            </span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky Table of Contents */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28 bg-white rounded-4xl border border-gray-100 shadow-premium p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-5">
                বিষয়সূচি
              </p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-primary hover:bg-[#FAFAF7] transition-all group"
                  >
                    <span className="text-accent group-hover:scale-110 transition-transform shrink-0">
                      {s.icon}
                    </span>
                    <span className="leading-tight">{s.title.split("(")[0].trim()}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10 scroll-mt-28"
              >
                <div className="flex items-center gap-4 mb-7">
                  <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div>{section.content}</div>
              </section>
            ))}

            {/* ToS Link Banner */}
            <div className="bg-primary rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">
                  সংশ্লিষ্ট দলিল
                </p>
                <h3 className="text-2xl font-black">
                  ব্যবহারের শর্তাবলীও পড়ুন
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  এই প্ল্যাটফর্ম ব্যবহারের নিয়ম ও যোগ্যতা সম্পর্কে জানুন।
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
