"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Search, Bell, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/directory", label: "Directory" },
    { href: "/gallery", label: "Gallery" },
    { href: "/notices", label: "Notices" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm flex justify-between items-center px-6 md:px-16 h-20 font-sans font-medium tracking-tight">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl md:text-2xl font-black text-primary tracking-tighter hover:text-accent transition-colors flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center text-white text-xs">HCS</div>
            <span>ALUMNI <span className="text-accent underline decoration-accent/30 underline-offset-4">PORTAL</span></span>
          </Link>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-primary/60 hover:text-primary transition-colors font-bold text-xs uppercase tracking-[0.2em]">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/login/alumni" className="hidden sm:block text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-[0.2em]">Login</Link>
          <Link href="/registration" className="hidden sm:flex bg-primary text-white px-8 py-3 rounded-xl font-black hover:shadow-xl hover:bg-black transition-all text-xs uppercase tracking-[0.2em]">
            Join Now
          </Link>
          
          {/* Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden bg-white pt-24 px-6 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black text-primary hover:text-accent transition-colors border-b border-gray-50 pb-4"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-auto pb-10 flex flex-col gap-4">
              <Link 
                href="/login/alumni" 
                onClick={() => setIsOpen(false)}
                className="w-full py-4 text-center text-primary/60 font-black uppercase tracking-widest border border-primary/10 rounded-xl"
              >
                Login
              </Link>
              <Link 
                href="/registration" 
                onClick={() => setIsOpen(false)}
                className="w-full py-4 text-center bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-lg"
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
