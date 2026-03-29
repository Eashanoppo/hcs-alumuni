import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/app/actions/admin"
import { ReactNode } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    redirect("/login/admin")
  }

  return (
    <div className="h-dvh bg-[#FAFAF7] flex overflow-hidden">
      <AdminSidebar />
      <main className="grow overflow-y-auto pt-16 lg:pt-0 pb-20">
        {children}
      </main>
    </div>
  )
}
