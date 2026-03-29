"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Megaphone, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function FloatingNotice() {
  const [notice, setNotice] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchFeaturedNotice() {
      try {
        const { data, error } = await supabase
          .from("notices")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching featured notice:", error);
        }

        if (data) {
          setNotice(data);
          // Auto-show logic
          const dismissed = sessionStorage.getItem(`notice_dismissed_${data.id}`);
          if (!dismissed) {
            setIsVisible(true);
            setTimeout(() => setIsExpanded(true), 1500); // Auto-expand after a brief delay
            // Auto collapse after 10 seconds to not be too intrusive
            setTimeout(() => setIsExpanded(false), 10000);
          }
        }
      } catch (error) {
        console.error("Error setting featured notice:", error);
      }
    }

    fetchFeaturedNotice();
  }, []);

  // Do not render anything on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  if (!notice || !isVisible) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem(`notice_dismissed_${notice.id}`, "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex items-end"
        >
          {/* Main Container */}
          <div className="relative group flex items-end">
            
            {/* The Floating Button */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative z-10 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-dark transition-colors border-2 border-[#D4AF37] focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Important Notice"
            >
              {/* Pulse Effect */}
              <span className="absolute w-full h-full rounded-full bg-[#D4AF37] opacity-40 animate-ping" />
              <Megaphone className="w-6 h-6 relative z-10 text-white" />
            </motion.button>

            {/* Expanded Content Panel */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0, right: 10 }}
                  animate={{ opacity: 1, width: 320, right: 64 }}
                  exit={{ opacity: 0, width: 0, right: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute bottom-0 overflow-hidden"
                >
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mr-4 border border-[#eee] min-w-75">
                    <div className="bg-primary/5 p-4 relative">
                       {/* Close Button Panel */}
                      <button
                        onClick={handleDismiss}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-red-500 transition-colors bg-white/50 rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-white text-[10px] uppercase font-bold tracking-wider">
                           Featured
                         </span>
                         <span className="text-xs text-muted-foreground font-medium">
                           {notice.category}
                         </span>
                      </div>
                      
                      <h4 className="font-bold text-base leading-tight mb-2 text-primary-dark line-clamp-2 pr-6">
                        {notice.title_bn || notice.title}
                      </h4>
                      
                      <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                        {notice.body_bn || notice.body}
                      </p>
                      
                      <Link 
                        href={`/notices/${notice.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark group-hover:underline"
                        onClick={() => setIsExpanded(false)}
                      >
                        Read Full Notice
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
