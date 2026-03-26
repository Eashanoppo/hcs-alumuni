import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { User, LogOut, CheckCircle, Clock, Award, XCircle, CreditCard } from "lucide-react"
import Link from "next/link"

async function getProfileData(alumniNumber: string) {
  const { data, error } = await supabase
    .from('registrants')
    .select('*')
    .eq('alumni_number', alumniNumber)
    .single()
    
  if (error || !data) return null
  return data
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('alumni_session')

  if (!session?.value) {
    redirect('/login/alumni')
  }

  const profile = await getProfileData(session.value)

  if (!profile) {
    // Session is invalid
    redirect('/login/alumni')
  }

  return (
    <div className="min-h-screen flex flex-col pt-28 bg-[#FAFAF7]">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tighter italic">Alumni Portal</h1>
            <p className="text-muted font-black uppercase tracking-[0.3em] text-[10px] mt-2">Welcome Back, {profile.full_name_en}</p>
          </div>
          <form action={async () => {
             "use server"
             const c = await cookies()
             c.delete('alumni_session')
             redirect('/')
          }}>
            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-primary font-black text-xs uppercase tracking-widest hover:border-rose-100 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm">
              <LogOut size={16} /> Logout
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-8 text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-24 bg-[#1F3D2B]"></div>
               <div className="relative mx-auto w-32 h-32 rounded-3xl bg-white p-2 shadow-lg mb-6 mt-6">
                  <div className="w-full h-full rounded-2xl bg-[#FAFAF7] overflow-hidden flex items-center justify-center text-primary font-black text-2xl border border-gray-100">
                    {profile.photo_url ? (
                      <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      profile.full_name_en.charAt(0).toUpperCase()
                    )}
                  </div>
               </div>
               <h2 className="text-xl font-black text-primary mb-1">{profile.full_name_en}</h2>
               <p className="text-xs font-bold text-muted mb-6">{profile.occupation}</p>
               
               <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#FAFAF7] rounded-2xl border border-gray-100">
                 <Award size={18} className="text-[#CEB888]" />
                 <span className="font-black text-primary tracking-widest uppercase text-sm">{profile.alumni_number}</span>
               </div>
            </div>

            <div className={`rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group ${profile.registration_status === 'APPROVED' ? 'bg-emerald-600' : profile.registration_status === 'REJECTED' ? 'bg-rose-600' : 'bg-[#CEB888]'}`}>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Registration Status</p>
                <div className="flex items-center gap-3 mb-4">
                  {profile.registration_status === 'APPROVED' ? <CheckCircle size={28} /> : profile.registration_status === 'REJECTED' ? <XCircle size={28} /> : <Clock size={28} />}
                  <h3 className="text-2xl font-black italic tracking-tight uppercase">{profile.registration_status}</h3>
                </div>
                {profile.registration_status === 'PENDING' && (
                  <p className="text-xs font-bold opacity-90">Your application is currently under review by the administration. Please allow up to 48 hours for processing.</p>
                )}
                {profile.registration_status === 'APPROVED' && (
                  <p className="text-xs font-bold opacity-90">Congratulations! Your alumni registration has been officially verified.</p>
                )}
              </div>
            </div>
          </div>

          {/* Details & Payment */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 p-8 md:p-12">
              <h3 className="text-lg font-black text-primary mb-8 tracking-tight italic border-b border-gray-50 pb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">Full Name (Bangla)</p>
                  <p className="font-bold text-primary">{profile.full_name_bn}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">Date of Birth</p>
                  <p className="font-bold text-primary">{profile.dob}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">Mobile Number</p>
                  <p className="font-bold text-primary">{profile.mobile}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">Email</p>
                  <p className="font-bold text-primary">{profile.email}</p>
                </div>
              </div>

              <h3 className="text-lg font-black text-primary mt-12 mb-8 tracking-tight italic border-b border-gray-50 pb-4">Academic History</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">Leaving Year</p>
                  <p className="font-bold text-primary">{profile.leaving_year}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">Class Left</p>
                  <p className="font-bold text-primary">{profile.leaving_class}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">SSC Batch</p>
                  <p className="font-bold text-primary">{profile.ssc_batch || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden">
               <div className="p-8 md:p-12">
                 <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                    <h3 className="text-lg font-black text-primary tracking-tight italic">Payment Status</h3>
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 
                       ${profile.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                       <CreditCard size={14} />
                       {profile.payment_status}
                    </span>
                 </div>
                 
                 {profile.payment_status === 'UNPAID' ? (
                   <div className="text-center py-6">
                      <p className="text-sm font-bold text-muted mb-6">You have an outstanding payment for your registration.</p>
                      {/* For simplicity we redirect to a payment mock/instruction page using the existing ID if we needed it.  */}
                      <Link href={`/registration/payment?id=${profile.id}`} className="inline-flex items-center gap-2 px-8 py-4 bg-[#1F3D2B] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-2xl hover:bg-black transition-all">
                        Complete Payment Now
                      </Link>
                   </div>
                 ) : (
                   <div className="p-6 bg-[#FAFAF7] rounded-3xl border border-gray-100 flex items-center justify-between">
                     <div>
                       <p className="font-black text-primary mb-1">Registration Fee Settled</p>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Awaiting final administrative verification if pending.</p>
                     </div>
                     <CheckCircle className="text-emerald-500" size={32} />
                   </div>
                 )}
               </div>
            </div>

          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
