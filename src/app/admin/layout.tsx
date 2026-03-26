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
    <div className="min-h-screen bg-[#FAFAF7] flex">
      <AdminSidebar />
      <main className="flex-grow overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  )
}
