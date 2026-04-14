"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Calendar,
  Tag,
  ChevronLeft,
  Share2,
  Printer,
  Download,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useNotification } from "@/lib/contexts/NotificationContext";

const CATEGORY_LABELS: Record<string, string> = {
  General: "সাধারণ",
  Academic: "অ্যাকাডেমিক",
  Events: "ইভেন্ট",
  Registration: "রেজিস্ট্রেশন",
  Reunion: "পুনর্মিলনী",
  Urgent: "জরুরি",
  Congratulations: "অভিনন্দন",
};

interface NoticeDetailContentProps {
  id: string;
}

function formatBnDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoticeDetailContent({ id }: NoticeDetailContentProps) {
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    if (!id) return;
    supabase
      .from("notices")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setError("Notice not found.");
        else setNotice(data);
        setLoading(false);
      });
  }, [id]);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: notice?.title, url: window.location.href });
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      notify("Link copied to clipboard!", "success");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="grow pt-24 md:pt-32 pb-24 px-4 md:px-8 max-w-5xl mx-auto w-full">
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

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 size={48} className="animate-spin text-primary/20" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-10 md:p-20 text-center border border-gray-100 shadow-premium">
            <AlertTriangle size={48} className="mx-auto text-rose-300 mb-6" />
            <h2 className="text-2xl font-black text-primary mb-2">Notice Not Found</h2>
            <p className="text-muted font-medium">{error}</p>
          </div>
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-20 shadow-premium border border-gray-100"
          >
            {/* Header Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest">
                <Calendar size={14} className="text-accent" />
                {formatBnDate(notice.created_at)}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-black text-xs uppercase tracking-widest">
                <Tag size={14} className="text-primary/40" />
                {CATEGORY_LABELS[notice.category] ?? notice.category}
              </div>
              <div className="ml-auto flex gap-3">
                <button
                  onClick={handleShare}
                  className="p-3 bg-background rounded-xl text-muted hover:text-accent transition-colors"
                  aria-label="Share notice"
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-3 bg-background rounded-xl text-muted hover:text-accent transition-colors"
                  aria-label="Print notice"
                >
                  <Printer size={18} />
                </button>
              </div>
            </div>

            {/* Title */}
            {notice.title_bn ? (
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-primary leading-tight mb-4 tracking-tighter">
                {notice.title_bn}
              </h1>
            ) : (
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-primary leading-tight mb-4 tracking-tighter">
                {notice.title}
              </h1>
            )}
            {notice.title_bn && (
              <p className="text-xl font-bold text-primary/50 mb-12 tracking-tight">
                {notice.title}
              </p>
            )}

            {/* Body */}
            <div className="prose prose-lg max-w-none text-muted leading-relaxed font-medium space-y-6 mb-10">
              {(notice.body_bn || notice.body) && (
                <p className="text-lg md:text-xl text-primary/80 font-bold leading-relaxed whitespace-pre-line">
                  {notice.body_bn || notice.body}
                </p>
              )}
              {notice.body_bn && notice.body && (
                <p className="whitespace-pre-line">{notice.body}</p>
              )}
            </div>

            {/* Highlights */}
            {notice.highlights && notice.highlights.length > 0 && (
              <div className="bg-background p-8 rounded-3xl mb-10">
                <h4 className="text-primary font-black mb-4">গুরুত্বপূর্ণ তথ্যসমূহ:</h4>
                <ul className="list-disc ml-6 space-y-3 font-bold text-primary/80">
                  {notice.highlights.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer: Attachment + CTA */}
            {(notice.attachment_url || notice.action_url) && (
              <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                {notice.attachment_url && (
                  <a
                    href={notice.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-background rounded-2xl w-full md:w-auto hover:shadow-md transition-all group"
                  >
                    <div className="p-3 md:p-4 bg-primary text-white rounded-xl shadow-lg group-hover:bg-accent transition-colors">
                      <Download size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-muted tracking-widest mb-1">
                        Attached Document
                      </p>
                      <p className="font-bold text-primary">
                        {notice.attachment_name || "Download File"}
                      </p>
                    </div>
                  </a>
                )}
                {notice.action_url && notice.action_label && (
                  <Link
                    href={notice.action_url}
                    className="w-full md:w-auto px-10 py-5 bg-accent text-primary font-black rounded-2xl shadow-xl hover:shadow-accent/30 hover:-translate-y-1 transition-all text-center"
                  >
                    {notice.action_label}
                  </Link>
                )}
              </div>
            )}
          </motion.article>
        )}
      </main>
      <Footer />
    </div>
  );
}
