import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { User, School, Phone, Mail, MessageSquare, MapPin, Briefcase, Calendar, FileText, ArrowLeft, ExternalLink, Lock } from "lucide-react"
import Link from "next/link"
import { getRegistrantBySlug } from "@/lib/db"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"

export default async function AlumniProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const alumni = await getRegistrantBySlug(slug)

  if (!alumni) {
    notFound()
  }

  const cookieStore = await cookies()
  const loggedInAlumniNumber = cookieStore.get('alumni_session')?.value
  const isOwner = loggedInAlumniNumber === alumni.alumni_number

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-[#FAFAF7]">
      <Navbar />
      
      <main className="grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="mb-10">
          <Link href="/directory" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors mb-4 group">
             <div className="p-2 bg-white rounded-xl border border-gray-100 group-hover:border-primary transition-colors">
                <ArrowLeft size={16} />
             </div>
             Back to Directory
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Summary Card */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-10 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] z-0"></div>
               <div className="w-40 h-40 mx-auto rounded-4xl bg-[#FAFAF7] border border-gray-100 shadow-md overflow-hidden mb-8 relative z-10 flex items-center justify-center">
                  {alumni.photo_url ? (
                    <img src={alumni.photo_url} alt={alumni.full_name_en} className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-muted/30" />
                  )}
               </div>
               <h1 className="text-2xl font-black text-primary mb-1">{alumni.full_name_en}</h1>
               <p className="text-[#CEB888] text-xs font-black uppercase tracking-widest mb-6">{alumni.occupation || 'Holy Crescent Alumnus'}</p>
               
               <div className="flex flex-wrap justify-center gap-2">
                 <span className="bg-primary/5 border border-primary/10 text-primary px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase">
                   SSC Batch {alumni.ssc_batch || alumni.batch}
                 </span>
                 <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase">
                   Verified Member
                 </span>
               </div>

               <div className="mt-8 flex justify-center gap-4 border-t border-gray-50 pt-8">
                  {alumni.facebook_url && (
                    <a href={alumni.facebook_url} target="_blank" className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {alumni.instagram_url && (
                    <a href={alumni.instagram_url} target="_blank" className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all transform hover:-translate-y-1">
                      <ExternalLink size={20} />
                    </a>
                  )}
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-10">
               <h3 className="font-black text-primary mb-6 flex items-center gap-3 tracking-tight">
                 <Phone size={20} className="text-[#CEB888]" />
                 Contact Identity
               </h3>
               <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Mobile</p>
                   <p className="font-bold text-primary tracking-wide text-sm">
                    {alumni.mobile}
                   </p>
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Email</p>
                   <p className="font-bold text-primary tracking-wide text-sm break-all">
                    {alumni.email}
                   </p>
                 </div>
                 {alumni.whatsapp && (
                   <div>
                     <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">WhatsApp</p>
                     <p className="font-bold text-primary tracking-wide text-sm">
                      {alumni.whatsapp}
                     </p>
                   </div>
                 )}
                 <div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Present Address</p>
                    <p className="font-bold text-primary tracking-wide text-xs leading-relaxed">
                      {alumni.present_address}
                    </p>
                 </div>
               </div>
            </div>
          </div>

          {/* Center & Right Column: Details */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-10">
                <h3 className="font-black text-primary text-xl mb-8 flex items-center gap-3 tracking-tight">
                  <Briefcase size={24} className="text-[#CEB888]" />
                  Professional & Identity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div>
                         <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 border-b border-gray-50 pb-3 flex items-center gap-2">
                           <Briefcase size={14} className="text-primary" /> Current Status
                         </h4>
                         <div className="space-y-4">
                            <div>
                               <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Occupation</p>
                               <p className="font-bold text-primary">{alumni.occupation}</p>
                            </div>
                            {alumni.workplace && (
                              <div>
                                <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Workplace</p>
                                <p className="font-bold text-primary">{alumni.workplace}</p>
                              </div>
                            )}
                            {alumni.current_institution && (
                              <div>
                                <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Current Institution</p>
                                <p className="font-bold text-primary">{alumni.current_institution}</p>
                              </div>
                            )}
                         </div>
                      </div>

                      <div>
                         <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 border-b border-gray-50 pb-3 flex items-center gap-2">
                           <User size={14} className="text-primary" /> Core Information
                         </h4>
                         <div className="space-y-4">
                            <div>
                               <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Bengali Name</p>
                               <p className="font-bold text-primary text-lg">
                                 {alumni.full_name_bn || alumni.full_name_en}
                               </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Father's Name</p>
                                  <p className="font-bold text-primary text-xs">
                                    {isOwner ? alumni.father_name : "Hidden"}
                                  </p>
                               </div>
                               <div>
                                  <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Date of Birth</p>
                                  <p className="font-bold text-primary text-xs">
                                    {isOwner ? alumni.dob : "Hidden"}
                                  </p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div>
                         <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 border-b border-gray-50 pb-3 flex items-center gap-2">
                           <School size={14} className="text-primary" /> HCS Journey
                         </h4>
                         <div className="space-y-5">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-gray-100 flex items-center justify-center text-primary">
                                  <Calendar size={18} />
                               </div>
                               <div>
                                  <p className="text-[10px] text-muted font-black uppercase tracking-widest">Admission</p>
                                  <p className="font-black text-primary text-sm">{alumni.admission_year} (Class {alumni.admission_class})</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-gray-100 flex items-center justify-center text-primary">
                                  <FileText size={18} />
                               </div>
                               <div>
                                  <p className="text-[10px] text-muted font-black uppercase tracking-widest">Leaving</p>
                                  <p className="font-black text-primary text-sm">{alumni.leaving_year} (Class {alumni.leaving_class})</p>
                               </div>
                            </div>
                            <div className="p-4 bg-primary text-white rounded-2xl flex items-center justify-between">
                               <span className="text-[10px] font-black uppercase tracking-widest">Academic Batch</span>
                               <span className="text-lg font-black text-[#CEB888]">SSC {alumni.ssc_batch || alumni.batch}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="bg-[#FAFAF7] p-8 rounded-4xl border border-gray-100 relative overflow-hidden group">
                         <div className="relative z-10">
                            <h4 className="text-sm font-black text-primary mb-2">Member ID</h4>
                            <p className="text-4xl font-black text-primary/10 tracking-widest uppercase">
                              {isOwner ? `#${alumni.alumni_number}` : "#HIDDEN"}
                            </p>
                         </div>
                         <div className="absolute -right-2.5 -bottom-2.5 text-primary/5 -rotate-12 transition-transform group-hover:rotate-0">
                            <School size={80} />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <MessageSquare size={24} />
                   </div>
                   <div>
                      <h4 className="font-black text-primary">Get in Touch</h4>
                      <p className="text-xs text-muted font-medium">Connect with this alumni for networking.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <a href={`tel:${alumni.mobile}`} className="px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all">Call Now</a>
                   <a href={`mailto:${alumni.email}`} className="px-6 py-3 bg-white border border-gray-100 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-primary transition-all">Send Email</a>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
