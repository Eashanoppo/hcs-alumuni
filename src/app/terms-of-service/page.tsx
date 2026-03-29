"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ScrollText,
  UserCheck,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  Users,
  Trash2,
  Phone,
  RefreshCw,
  Lock,
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
    id: "acceptance",
    icon: <ScrollText size={22} />,
    title: "শর্তাবলী গ্রহণ (Acceptance of Terms)",
    content: (
      <p className="text-muted leading-relaxed">
        এই প্ল্যাটফর্মে নিবন্ধন করা বা ব্যবহার করার মাধ্যমে আপনি নিচে বর্ণিত
        সকল শর্ত মেনে নিচ্ছেন বলে গণ্য হবে। আপনি যদি এই শর্তাবলীর সাথে একমত না
        হন, তাহলে অনুগ্রহ করে প্ল্যাটফর্মটি ব্যবহার করবেন না।{" "}
        <strong className="text-primary">
          হলি ক্রিসেন্ট স্কুল কর্তৃপক্ষ
        </strong>{" "}
        যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করে।
      </p>
    ),
  },
  {
    id: "eligibility",
    icon: <UserCheck size={22} />,
    title: "যোগ্যতা (Eligibility)",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          শুধুমাত্র নিম্নলিখিত ব্যক্তিরা এই প্ল্যাটফর্মে নিবন্ধন করতে পারবেন:
        </p>
        <div className="space-y-3">
          {[
            {
              rule: "হলি ক্রিসেন্ট স্কুলের প্রাক্তন শিক্ষার্থী",
              detail:
                "যারা যেকোনো সময়ে এই বিদ্যালয়ে পড়েছেন (যেকোনো শ্রেণিতে)।",
            },
            {
              rule: "সঠিক তথ্য প্রদানে সক্ষম ব্যক্তি",
              detail:
                "ভর্তি বছর, ছাড়ার বছর, এবং শ্রেণি সম্পর্কিত সঠিক তথ্য দিতে হবে।",
            },
            {
              rule: "একটি সক্রিয় মোবাইল নম্বরের মালিক",
              detail:
                "প্রতিটি মোবাইল নম্বর দিয়ে শুধুমাত্র একটি অ্যাকাউন্ট তৈরি করা যাবে।",
            },
          ].map((item) => (
            <div
              key={item.rule}
              className="flex gap-4 bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100"
            >
              <span className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
              <div>
                <p className="font-black text-sm text-primary mb-0.5">
                  {item.rule}
                </p>
                <p className="text-sm text-muted">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-2">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            মিথ্যা বা বিভ্রান্তিকর তথ্য প্রদান করলে রেজিস্ট্রেশন বাতিল করার
            অধিকার কর্তৃপক্ষের আছে।
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "registration",
    icon: <Users size={22} />,
    title: "নিবন্ধন প্রক্রিয়া ও তথ্যের সত্যতা",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          নিবন্ধন ফর্মে প্রদত্ত তথ্যের দায়িত্ব সম্পূর্ণভাবে ব্যবহারকারীর নিজের।
          নিম্নলিখিত বিষয়গুলি অবশ্যই মেনে চলতে হবে:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              no: "01",
              title: "একক নিবন্ধন",
              desc: "প্রতিটি মোবাইল নম্বরে শুধুমাত্র একটি নিবন্ধন অনুমোদিত। ডুপ্লিকেট এন্ট্রি স্বয়ংক্রিয়ভাবে প্রত্যাখ্যান করা হবে।",
            },
            {
              no: "02",
              title: "সঠিক তথ্য প্রদান",
              desc: "নাম, পিতা/মাতার নাম, ঠিকানা সহ সকল বাধ্যতামূলক তথ্য সঠিকভাবে পূরণ করতে হবে।",
            },
            {
              no: "03",
              title: "অনুমোদনের প্রয়োজন",
              desc: "নিবন্ধন সম্পন্ন হওয়ার পরেও অ্যাডমিন অনুমোদন না হওয়া পর্যন্ত ডাইরেক্টরিতে প্রদর্শিত হবে না।",
            },
            {
              no: "04",
              title: "উপযুক্ত ছবি আপলোড",
              desc: "আপলোড করা ছবি অবশ্যই প্রকৃত ব্যক্তির, স্পষ্ট, এবং শালীন হতে হবে। আপত্তিকর ছবি গ্রহণযোগ্য নয়।",
            },
          ].map((item) => (
            <div
              key={item.no}
              className="bg-[#FAFAF7] rounded-2xl p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-black text-primary/10">
                  {item.no}
                </span>
                <h4 className="font-black text-sm text-primary">{item.title}</h4>
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "payment",
    icon: <CreditCard size={22} />,
    title: "পেমেন্ট নীতি",
    content: (
      <div className="space-y-5">
        <div className="bg-primary rounded-3xl p-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Alumni ফি", amount: "৭০০ BDT" },
              { label: "Spouse ফি", amount: "৩০০ BDT" },
              { label: "অতিরিক্ত সন্তান", amount: "২০০ BDT/জন" },
            ].map((fee) => (
              <div key={fee.label}>
                <p className="text-2xl md:text-3xl font-black text-accent">
                  {fee.amount}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-1">
                  {fee.label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs text-center mt-4">
            * প্রথম সন্তান বিনামূল্যে। দ্বিতীয় সন্তান থেকে ২০০ টাকা।
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              title: "পেমেন্ট পদ্ধতি",
              desc: "bKash বা Nagad-এর মাধ্যমে পেমেন্ট করতে হবে। পেমেন্ট করার সময় রেফারেন্সে আপনার রেজিস্ট্রেশনকালীন ইমেইল বা মোবাইল নম্বর অবশ্যই উল্লেখ করতে হবে।",
              icon: "📱",
            },
            {
              title: "পেমেন্ট অফেরতযোগ্য",
              desc: "একবার পেমেন্ট যাচাই হলে কোনো পরিস্থিতিতেই তা ফেরত দেওয়া হবে না। তাই পেমেন্টের আগে অর্ডার সামারি ভালোভাবে যাচাই করুন।",
              icon: "⚠️",
            },
            {
              title: "যাচাইয়ের সময়",
              desc: "পেমেন্ট জমা দেওয়ার পরে সাধারণত ২৪ ঘণ্টার মধ্যে অ্যাডমিন যাচাই সম্পন্ন হয়। যাচাই না হলে আমাদের সাথে যোগাযোগ করুন।",
              icon: "⏱️",
            },
            {
              title: "নগদ পেমেন্ট",
              desc: "বিশেষ ক্ষেত্রে নগদ পেমেন্টের সুবিধা প্রদান করা হতে পারে। এজন্য সরাসরি কর্তৃপক্ষের সাথে যোগাযোগ করতে হবে।",
              icon: "💵",
            },
          ].map((rule) => (
            <div
              key={rule.title}
              className="flex gap-4 bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100"
            >
              <span className="text-2xl shrink-0">{rule.icon}</span>
              <div>
                <p className="font-black text-sm text-primary mb-1">
                  {rule.title}
                </p>
                <p className="text-sm text-muted leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "account",
    icon: <Lock size={22} />,
    title: "অ্যাকাউন্ট নিরাপত্তা ও সীমাবদ্ধতা",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          আপনার অ্যাকাউন্টের নিরাপত্তা রক্ষা করা আপনার দায়িত্ব। নিচের বিষয়গুলি
          বিশেষভাবে লক্ষ্য রাখুন:
        </p>
        <div className="space-y-3">
          {[
            "অ্যাকাউন্ট শেয়ার করা বা হস্তান্তর করা যাবে না",
            "মোবাইল নম্বর একবার নিবন্ধিত হলে পরিবর্তন করা সম্ভব নয়",
            "লগইন পাসওয়ার্ড হিসেবে ব্যবহৃত জন্মতারিখ কখনো পরিবর্তন করা যাবে না",
            "অ্যালুমনাই নম্বর সিস্টেম-নির্ধারিত এবং পরিবর্তনযোগ্য নয়",
            "রেজিস্ট্রেশন ও পেমেন্ট স্ট্যাটাস শুধুমাত্র অ্যাডমিন পরিবর্তন করতে পারবেন",
          ].map((rule) => (
            <div
              key={rule}
              className="flex items-start gap-3 bg-[#FAFAF7] rounded-xl p-4 border border-gray-100"
            >
              <ShieldCheck
                size={18}
                className="text-primary shrink-0 mt-0.5"
              />
              <p className="text-sm text-muted leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "public-profile",
    icon: <Users size={22} />,
    title: "পাবলিক প্রোফাইল ও অ্যালুমনাই ডাইরেক্টরি",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          আপনার নিবন্ধন অ্যাডমিন দ্বারা অনুমোদিত হলে আপনার প্রোফাইল পাবলিক
          অ্যালুমনাই ডাইরেক্টরিতে দৃশ্যমান হবে।
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
              যা প্রকাশ্য থাকবে
            </h4>
            <ul className="space-y-2">
              {["নাম", "ছবি", "ব্যাচ", "পেশা ও কর্মস্থল", "শিক্ষা প্রতিষ্ঠান"].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
              আপনার দায়িত্ব
            </h4>
            <ul className="space-y-2">
              {[
                "প্রোফাইলে প্রকৃত তথ্য রাখুন",
                "আপত্তিকর ছবি ব্যবহার করবেন না",
                "সামাজিক লিংক (ঐচ্ছিক) সঠিক হতে হবে",
                "অন্যের তথ্য ব্যবহার করবেন না",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            সামাজিক মিডিয়া লিংক (Facebook, Instagram) ঐচ্ছিক। তবে প্রদান করা
            হলে সেগুলি পাবলিক প্রোফাইলে দৃশ্যমান হতে পারে।
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "admin-rights",
    icon: <ShieldCheck size={22} />,
    title: "কর্তৃপক্ষের অধিকার",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          হলি ক্রিসেন্ট স্কুল কর্তৃপক্ষ (Admin) নিম্নলিখিত ক্ষমতা সংরক্ষণ করে:
        </p>
        <div className="space-y-3">
          {[
            {
              action: "নিবন্ধন অনুমোদন বা প্রত্যাখ্যান",
              detail:
                "যেকোনো নিবন্ধন বিনা কারণে প্রত্যাখ্যান করার অধিকার আছে।",
              color:
                "bg-orange-50 border-orange-200 text-orange-700",
            },
            {
              action: "অ্যাকাউন্ট মুছে ফেলা",
              detail:
                "মিথ্যা তথ্য, আপত্তিকর কন্টেন্ট বা নীতি লঙ্ঘনের ক্ষেত্রে অ্যাকাউন্ট মুছে ফেলা হতে পারে।",
              color: "bg-red-50 border-red-200 text-red-700",
            },
            {
              action: "পেমেন্ট যাচাই ও প্রত্যাখ্যান",
              detail:
                "ভুল ট্রানজেকশন আইডি বা রেফারেন্স ছাড়া পেমেন্ট যাচাই না হতে পারে।",
              color: "bg-blue-50 border-blue-200 text-blue-700",
            },
            {
              action: "শর্তাবলী পরিবর্তন",
              detail:
                "যেকোনো সময় এই শর্তাবলী আপডেট করা হতে পারে। ব্যবহারকারীরা পরিবর্তন নিজে দেখার দায়িত্ব নিজেদের।",
              color: "bg-gray-50 border-gray-200 text-gray-700",
            },
          ].map((item) => (
            <div
              key={item.action}
              className={`flex gap-4 p-5 rounded-2xl border ${item.color}`}
            >
              <ShieldCheck size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-sm mb-0.5">{item.action}</p>
                <p className="text-sm leading-relaxed opacity-80">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "termination",
    icon: <Trash2 size={22} />,
    title: "অ্যাকাউন্ট বন্ধ ও তথ্য মুছে ফেলা",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          আপনি যদি আপনার রেজিস্ট্রেশন তথ্য সম্পূর্ণভাবে মুছে ফেলতে চান, তাহলে
          নিচের পদ্ধতিতে আবেদন করুন:
        </p>
        <div className="space-y-3">
          {[
            "আপনার রেজিস্ট্রেশনকালীন মোবাইল নম্বর ও নাম উল্লেখ করে একটি ইমেইল পাঠান",
            "কর্তৃপক্ষ ৭ কার্যদিবসের মধ্যে আবেদন প্রক্রিয়া করবেন",
            "পেমেন্ট যাচাই হয়ে গেলে তথ্য মুছে ফেলা হলেও পেমেন্ট ফেরত দেওয়া হবে না",
            "Cloudinary থেকে আপলোড করা ছবিও সাথে সাথে মুছে ফেলা হবে",
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100"
            >
              <span className="text-2xl font-black text-primary/20 shrink-0 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-muted leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "updates",
    icon: <RefreshCw size={22} />,
    title: "শর্তাবলীর আপডেট",
    content: (
      <p className="text-muted leading-relaxed">
        এই শর্তাবলী সর্বশেষ{" "}
        <strong className="text-primary">{LAST_UPDATED}</strong>-এ আপডেট করা
        হয়েছে। ভবিষ্যতে যেকোনো পরিবর্তন এই পেজে প্রতিফলিত হবে। প্রতিটি
        পরিবর্তনের তারিখ উপরে উল্লেখিত থাকবে। প্ল্যাটফর্ম ব্যবহার চালিয়ে যাওয়া
        মানে হলো আপনি নতুন শর্তাবলী মেনে নিয়েছেন।
      </p>
    ),
  },
  {
    id: "contact",
    icon: <Phone size={22} />,
    title: "যোগাযোগ",
    content: (
      <div className="space-y-4">
        <p className="text-muted leading-relaxed">
          শর্তাবলী বিষয়ক যেকোনো প্রশ্ন, অভিযোগ বা আবেদনের জন্য:
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

export default function TermsOfServicePage() {
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
            ব্যবহারের শর্তাবলী
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed font-medium">
            HCS অ্যালুমনাই পোর্টাল ব্যবহারের আগে এই শর্তাবলী সম্পর্কে অবগত হওয়া
            বাধ্যতামূলক।
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
            <ScrollText size={16} className="text-accent" />
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
                    <span className="leading-tight">
                      {s.title.split("(")[0].trim()}
                    </span>
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

            {/* Privacy Policy Link Banner */}
            <div className="bg-primary rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">
                  সংশ্লিষ্ট দলিল
                </p>
                <h3 className="text-2xl font-black">গোপনীয়তা নীতিও পড়ুন</h3>
                <p className="text-white/60 text-sm mt-1">
                  আমরা আপনার তথ্য কীভাবে সংগ্রহ ও ব্যবহার করি তা জানুন।
                </p>
              </div>
              <Link
                href="/privacy-policy"
                className="shrink-0 px-8 py-4 bg-accent text-primary font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg"
              >
                Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
