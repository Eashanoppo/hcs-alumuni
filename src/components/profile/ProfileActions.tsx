"use client"

import { useState } from "react"
import Link from "next/link"
import { Award, LogOut, Edit2 } from "lucide-react"
import FrameGenerator from "./FrameGenerator"
import { AnimatePresence } from "framer-motion"

interface ProfileActionsProps {
  profile: any;
  logoutAction: () => Promise<void>;
}

export default function ProfileActions({ profile, logoutAction }: ProfileActionsProps) {
  const [showFrameGen, setShowFrameGen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => setShowFrameGen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#EED6A5] text-[#1F3D2B] rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:shadow-2xl transition-all shadow-xl group border border-[#D4BC8A]"
        >
          <Award size={16} className="group-hover:rotate-12 transition-transform" /> 
          Generate Frame
        </button>
        
        <Link href="/profile/edit" className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1F3D2B] rounded-2xl text-white font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-2xl">
          <Edit2 size={16} />
          Edit Profile
        </Link>

        <form action={logoutAction}>
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-primary font-black text-[10px] sm:text-xs uppercase tracking-widest hover:border-rose-100 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm">
            <LogOut size={16} /> Logout
          </button>
        </form>
      </div>

      <AnimatePresence>
        {showFrameGen && (
          <FrameGenerator 
            onClose={() => setShowFrameGen(false)} 
            initialPhoto={profile.photo_url}
          />
        )}
      </AnimatePresence>
    </>
  )
}
