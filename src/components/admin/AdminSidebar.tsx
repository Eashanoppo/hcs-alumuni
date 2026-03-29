"use client"

import { LayoutDashboard, Users, CreditCard, LogOut, ChevronRight, Megaphone, Image as ImageIcon, Menu, X, Star, MessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAdmin } from "@/app/actions/admin"
import { useState, useEffect } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Registrants", href: "/admin/registrants", icon: <Users size={20} /> },
    { label: "Payments", href: "/admin/payments", icon: <CreditCard size={20} /> },
    { label: "Notices", href: "/admin/notices", icon: <Megaphone size={20} /> },
    { label: "Gallery", href: "/admin/gallery", icon: <ImageIcon size={20} /> },
    { label: "Videos", href: "/admin/videos", icon: <ImageIcon size={20} /> },
    { label: "Visions", href: "/admin/visions", icon: <Star size={20} /> },
    { label: "Testimonials", href: "/admin/testimonials", icon: <MessageSquare size={20} /> },
    { label: "About Page", href: "/admin/about", icon: <LayoutDashboard size={20} /> },
  ]

  const handleSignOut = async () => {
    await logoutAdmin()
    window.location.href = "/login/admin"
  }

  const NavLinks = () => (
    <>
      <nav className="space-y-3 grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between group p-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/10 text-[#CEB888] shadow-lg xl:translate-x-2' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="font-bold tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} className="text-[#CEB888]/50" />}
            </Link>
          )
        })}
      </nav>

      <div className="pt-8 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 p-4 rounded-2xl w-full text-white/40 hover:text-white hover:bg-white/5 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar (lg+) ── */}
      <aside className="w-72 bg-[#1F3D2B] text-white hidden lg:flex flex-col p-8 h-screen sticky top-0 border-r border-white/5 z-100 overflow-y-auto custom-scrollbar">
        <div className="mb-14">
          <h2 className="text-2xl font-black text-[#CEB888] tracking-tighter">HCS Admin</h2>
          <p className="text-[10px] uppercase font-black text-white/30 tracking-[0.3em] mt-1">Institutional Portal</p>
        </div>
        <NavLinks />
      </aside>

      {/* ── Mobile top bar (< lg) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-200 bg-[#1F3D2B] text-white flex items-center gap-4 px-5 h-16 border-b border-white/10 shadow-lg">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-all"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-black text-[#CEB888] tracking-tighter">HCS Admin</h2>
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-300 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-400 h-full w-72 bg-[#1F3D2B] text-white flex flex-col p-8 shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto custom-scrollbar`}
      >
        <div className="flex items-center justify-between mb-14">
          <div>
            <h2 className="text-2xl font-black text-[#CEB888] tracking-tighter">HCS Admin</h2>
            <p className="text-[10px] uppercase font-black text-white/30 tracking-[0.3em] mt-1">Institutional Portal</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-xl hover:bg-white/10 transition-all text-white/60 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>
        <NavLinks />
      </div>
    </>
  )
}
