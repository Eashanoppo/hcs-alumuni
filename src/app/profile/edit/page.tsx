import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import EditProfileForm from "./EditProfileForm"

export default async function EditProfilePage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('alumni_session')

  if (!session?.value) {
    redirect('/login/alumni')
  }

  const { data: profile } = await supabase
    .from('registrants')
    .select('*')
    .eq('alumni_number', session.value)
    .single()

  if (!profile) {
    redirect('/login/alumni')
  }

  return (
    <div className="min-h-screen flex flex-col pt-28 bg-[#FAFAF7]">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
        <EditProfileForm profile={profile} />
      </main>
      <Footer />
    </div>
  )
}
