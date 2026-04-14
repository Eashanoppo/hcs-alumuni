"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Bell, Menu, X, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false)
  const [mobileJoinOpen, setMobileJoinOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<'login' | 'join' | null>(null)

  const [userType, setUserType] = useState<'alumni' | 'teacher' | 'admin' | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const alumniMatch = document.cookie.match(/(^| )alumni_session=([^;]+)/)
      const teacherMatch = document.cookie.match(/(^| )teacher_session=([^;]+)/)
      const adminMatch = document.cookie.match(/(^| )admin_session=([^;]+)/)

      if (adminMatch) {
        setIsLoggedIn(true)
        setUserType('admin')
        setUserPhoto(null) // Admins don't usually have photos in this repo setup
      } else if (teacherMatch) {
        setIsLoggedIn(true)
        setUserType('teacher')
        const sessionVal = teacherMatch[2]
        if (sessionVal !== 'undefined' && sessionVal !== 'null') {
          const { data } = await supabase.from('teachers').select('photo_url').eq('id', sessionVal).single()
          if (data?.photo_url) {
            setUserPhoto(data.photo_url)
          }
        }
      } else if (alumniMatch) {
        setIsLoggedIn(true)
        setUserType('alumni')
        const sessionVal = alumniMatch[2]
        if (sessionVal !== 'undefined' && sessionVal !== 'null') {
          const { data } = await supabase.from('registrants').select('photo_url').eq('alumni_number', sessionVal).single()
          if (data?.photo_url) {
            setUserPhoto(data.photo_url)
          }
        }
      } else {
        setIsLoggedIn(false)
        setUserType(null)
        setUserPhoto(null)
      }
    }
    checkAuth()

    window.addEventListener('auth-change', checkAuth)
    return () => window.removeEventListener('auth-change', checkAuth)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/directory", label: "Directory" },
    { href: "/teachers", label: "Teachers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/notices", label: "Notices" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm flex justify-between items-center px-6 md:px-16 h-20 font-sans font-medium tracking-tight">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl md:text-2xl font-black text-primary tracking-tighter hover:text-accent transition-colors flex items-center gap-2">
            <Image 
              src="/images/logo.png" 
              alt="HCS Logo" 
              width={40} 
              height={40} 
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
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
          {isLoggedIn ? (
            <Link 
              href={userType === 'admin' ? '/admin/dashboard' : userType === 'teacher' ? '/profile/teacher' : '/profile'} 
              className="hidden sm:flex w-10 h-10 rounded-full border-2 border-primary/20 bg-[#FAFAF7] items-center justify-center overflow-hidden hover:border-primary transition-all"
            >
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-primary" />
              )}
            </Link>
          ) : (
            <div className="hidden lg:flex items-center gap-6">
              {/* Login Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('login')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-[0.2em] py-2 transition-colors">
                  Login <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'login' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'login' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <Link href="/login/alumni" className="block px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary/70 hover:text-primary hover:bg-gray-50 transition-colors">
                        Alumni Login
                      </Link>
                      <Link href="/login/teachers" className="block px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary/70 hover:text-primary hover:bg-gray-50 transition-colors">
                        Teachers Login
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Join Now Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('join')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black hover:shadow-xl hover:bg-black transition-all text-xs uppercase tracking-[0.2em]">
                  Join Now <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'join' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'join' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <Link href="/registration" className="block px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary/70 hover:text-primary hover:bg-gray-50 transition-colors">
                        Alumni Registration
                      </Link>
                      <Link href="/registration/teachers" className="block px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary/70 hover:text-primary hover:bg-gray-50 transition-colors">
                        Teacher Registration
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
          
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden bg-white flex flex-col"
          >
            {/* Overlay Header: Matches main navbar height and padding */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-black text-primary tracking-tighter flex items-center gap-2">
                <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
                <span>ALUMNI <span className="text-accent underline decoration-accent/30 underline-offset-4">PORTAL</span></span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 text-primary hover:bg-gray-100 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="block text-[22px] font-black text-primary hover:text-accent transition-colors py-4 border-b border-gray-50/50 tracking-tight"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-8 space-y-4">
                {isLoggedIn ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link 
                      href={userType === 'admin' ? '/admin/dashboard' : userType === 'teacher' ? '/profile/teacher' : '/profile'} 
                      onClick={() => setIsOpen(false)}
                      className="w-full py-5 text-center bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all"
                    >
                      <User size={18} /> {userType === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    className="flex flex-col gap-4"
                  >
                    {/* Mobile Login Dropdown */}
                    <div className="bg-gray-50 rounded-[2rem] p-4 border border-gray-100">
                      <button 
                        onClick={() => setMobileLoginOpen(!mobileLoginOpen)}
                        className="w-full py-2 px-4 flex items-center justify-between text-lg font-black text-primary"
                      >
                        LOGIN <ChevronDown size={20} className={`transition-transform duration-300 ${mobileLoginOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {mobileLoginOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col gap-4 px-4 pt-2 pb-2"
                          >
                            <Link 
                              href="/login/alumni" 
                              onClick={() => setIsOpen(false)}
                              className="text-sm font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                              Alumni Login
                            </Link>
                            <Link 
                              href="/login/teachers" 
                              onClick={() => setIsOpen(false)}
                              className="text-sm font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                              Teachers Login
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Mobile Join Now Dropdown */}
                    <div className="bg-primary/5 rounded-[2rem] p-4 border border-primary/10">
                      <button 
                        onClick={() => setMobileJoinOpen(!mobileJoinOpen)}
                        className="w-full py-2 px-4 flex items-center justify-between text-lg font-black text-primary"
                      >
                        JOIN NOW <ChevronDown size={20} className={`transition-transform duration-300 ${mobileJoinOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {mobileJoinOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col gap-4 px-4 pt-2 pb-2"
                          >
                            <Link 
                              href="/registration" 
                              onClick={() => setIsOpen(false)}
                              className="text-sm font-bold text-primary hover:text-accent transition-colors uppercase tracking-widest"
                            >
                              Alumni Registration
                            </Link>
                            <Link 
                              href="/registration/teachers" 
                              onClick={() => setIsOpen(false)}
                              className="text-sm font-bold text-primary hover:text-accent transition-colors uppercase tracking-widest"
                            >
                              Teacher Registration
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
