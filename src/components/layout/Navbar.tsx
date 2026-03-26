"use client"

import Link from 'next/link'
import { Search, Bell } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm flex justify-between items-center px-8 md:px-16 h-20 font-sans font-medium tracking-tight">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-black text-primary tracking-tighter hover:text-accent transition-colors flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-xs">HCS</div>
          <span>ALUMNI <span className="text-accent underline decoration-accent/30 underline-offset-4">PORTAL</span></span>
        </Link>
      </div>
      
      <div className="hidden lg:flex items-center gap-10">
        <Link href="/" className="text-primary/60 hover:text-primary transition-colors font-bold text-xs uppercase tracking-[0.2em]">Home</Link>
        <Link href="/about" className="text-primary/60 hover:text-primary transition-colors font-bold text-xs uppercase tracking-[0.2em]">About Us</Link>
        <Link href="/directory" className="text-primary/60 hover:text-primary transition-colors font-bold text-xs uppercase tracking-[0.2em]">Directory</Link>
        <Link href="/gallery" className="text-primary/60 hover:text-primary transition-colors font-bold text-xs uppercase tracking-[0.2em]">Gallery</Link>
        <Link href="/notices" className="text-primary/60 hover:text-primary transition-colors font-bold text-xs uppercase tracking-[0.2em]">Notices</Link>
        <Link href="/contact" className="text-primary/60 hover:text-primary transition-colors font-bold text-xs uppercase tracking-[0.2em]">Contact</Link>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/login/alumni" className="hidden sm:block text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-[0.2em]">Login</Link>
        <Link href="/registration" className="bg-primary text-white px-10 py-3.5 rounded-xl font-black hover:shadow-xl hover:bg-black transition-all text-xs uppercase tracking-[0.2em]">
          Join Now
        </Link>
      </div>
    </nav>
  )
}
