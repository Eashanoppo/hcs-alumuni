"use client"

import { LogOut, Edit3 } from "lucide-react"
import Link from "next/link"
import { TeacherRecord } from "@/lib/teacher-db"

interface Props {
  teacher: TeacherRecord
}

export default function TeacherProfileActions({ teacher }: Props) {
  const handleLogout = () => {
    document.cookie = "teacher_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/"
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/profile/teacher/edit"
        className="w-full py-4 rounded-xl bg-[#CEB888] text-white font-black text-xs uppercase tracking-widest hover:bg-[#B09A6A] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
      >
        <Edit3 size={16} /> Edit Profile
      </Link>

      <button
        onClick={handleLogout}
        className="w-full py-4 rounded-xl border-2 border-rose-100 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
      >
        <LogOut size={16} /> Logout
      </button>
      
      <p className="text-[10px] text-center text-muted font-bold mt-2 leading-relaxed">
        আপনার মোবাইল নাম্বার এবং যোগদানের তারিখ (পাসওয়ার্ড) পরিবর্তন করা সম্ভব নয়।
      </p>
    </div>
  )
}
