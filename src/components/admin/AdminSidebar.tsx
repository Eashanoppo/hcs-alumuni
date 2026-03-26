"use client"

import { LayoutDashboard, Users, CreditCard, LogOut, ChevronRight, Megaphone, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAdmin } from "@/app/actions/admin"

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Registrants", href: "/admin/registrants", icon: <Users size={20} /> },
    { label: "Payments", href: "/admin/payments", icon: <CreditCard size={20} /> },
    { label: "Notices", href: "/admin/notices", icon: <Megaphone size={20} /> },
    { label: "Gallery", href: "/admin/gallery", icon: <ImageIcon size={20} /> },
  ]

  const handleSignOut = async () => {
    await logoutAdmin()
    window.location.href = "/login/admin"
  }

  return (
    <aside className="w-72 bg-[#1F3D2B] text-white hidden lg:flex flex-col p-8 h-screen sticky top-0 border-r border-white/5 z-[100]">
      <div className="mb-14">
        <h2 className="text-2xl font-black text-[#CEB888] tracking-tighter italic">HCS Admin</h2>
        <p className="text-[10px] uppercase font-black text-white/30 tracking-[0.3em] mt-1">Institutional Portal</p>
      </div>

      <nav className="space-y-3 flex-grow">
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
    </aside>
  )
}
