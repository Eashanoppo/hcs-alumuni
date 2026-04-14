import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Link from "next/link"
import { ArrowLeft, MapPin, Briefcase, Calendar, Award, Phone, CheckCircle, GraduationCap, BookOpen } from "lucide-react"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data } = await supabase
    .from("teachers")
    .select("full_name_en, full_name_bn, designation, subject")
    .eq("slug", slug)
    .eq("status", "APPROVED")
    .single()

  if (!data) return { title: "Teacher Not Found — HCS" }

  return {
    title: `${data.full_name_en} — HCS Teachers`,
    description: `${data.designation} • ${data.subject} — Holy Crescent School`,
  }
}

export default async function TeacherPublicProfilePage({ params }: Props) {
  const { slug } = await params;
  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("id, full_name_en, full_name_bn, designation, subject, joining_date, leaving_year, slug, photo_url, education, activities, memory_note, is_founder_guide, founder_guide_note, current_occupation, current_institution")
    .eq("slug", slug)
    .eq("status", "APPROVED")
    .single()

  if (error || !teacher) notFound()

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-4xl mx-auto w-full">
        
        <Link href="/teachers" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-primary transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </Link>

        {teacher.is_founder_guide && (
          <div className="mb-6 bg-gradient-to-r from-[#CEB888] to-[#B09A6A] p-6 rounded-3xl text-white shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 border border-white/30 px-3 py-1 rounded-full mb-3 inline-block">Special Recognition</span>
              <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">Our Founder & Guide</h2>
              {teacher.founder_guide_note && <p className="mt-2 font-medium opacity-90 max-w-lg">{teacher.founder_guide_note}</p>}
            </div>
            <Award size={48} className="opacity-20 absolute right-8" />
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden">
          {/* Cover */}
          <div className="h-40 bg-[#1F3D2B] relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="px-8 md:px-16 pb-12 relative -mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="w-36 h-36 rounded-[2.5rem] bg-white p-2 shadow-2xl relative z-10 -rotate-3 hover:rotate-0 transition-transform duration-300 shrink-0">
                  <div className="w-full h-full rounded-[2rem] bg-gray-50 border-2 border-gray-100 overflow-hidden flex items-center justify-center">
                    {teacher.photo_url ? (
                      <img src={teacher.photo_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-black text-gray-200">{(teacher.full_name_en || teacher.full_name_bn || "?").charAt(0)}</span>
                    )}
                  </div>
                </div>
                
                <div className="text-center md:text-left pb-2">
                  <h1 className="text-4xl font-black text-primary tracking-tight leading-tight">{teacher.full_name_en}</h1>
                  {teacher.full_name_bn && <p className="text-xl font-bold text-[#CEB888] mt-1">{teacher.full_name_bn}</p>}
                  <p className="text-muted font-bold text-base mt-2">
                    {teacher.designation} <span className="mx-2 text-gray-300">•</span> {teacher.subject}
                  </p>
                </div>
              </div>

              <div className="pb-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                  <CheckCircle size={14} /> Approved Teacher
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                
                {/* Professional */}
                <div>
                  <h3 className="text-xs font-black text-primary tracking-widest uppercase mb-5 flex items-center gap-3 border-b border-gray-50 pb-4">
                    <Briefcase size={18} className="text-[#CEB888]" /> Professional Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100">
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mb-1">Joined School</p>
                      <p className="font-bold text-primary">{(teacher.joining_date || "").match(/\d{4}/)?.[0] || ""}</p>
                    </div>
                    <div className="bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100">
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mb-1">Left School</p>
                      <p className="font-bold text-primary">{teacher.leaving_year === "Present" ? "Present" : (teacher.leaving_year || "").match(/\d{4}/)?.[0] || teacher.leaving_year}</p>
                    </div>
                    {teacher.current_occupation && (
                      <div className="col-span-2 bg-[#FAFAF7] rounded-2xl p-5 border border-gray-100">
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mb-1">Current Occupation</p>
                        <p className="font-bold text-primary">{teacher.current_occupation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Memory Note */}
                {teacher.memory_note && (
                  <div>
                    <h3 className="text-xs font-black text-primary tracking-widest uppercase mb-5 border-b border-gray-50 pb-4">Memory / Note</h3>
                    <blockquote className="p-6 bg-[#FAFAF7] rounded-2xl border border-gray-100 text-sm font-medium leading-relaxed italic text-muted border-l-4 border-l-[#CEB888]">
                      "{teacher.memory_note}"
                    </blockquote>
                  </div>
                )}

              </div>

              <div className="space-y-8">
                {/* Security Note */}
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black uppercase text-emerald-800 tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle size={14} /> Verified Member
                  </p>
                  <p className="text-xs font-bold text-emerald-900/60 leading-relaxed">
                    Identity verified by Holy Crescent School Alumni Association.
                  </p>
                </div>

                {/* Education */}
                {teacher.education && (Array.isArray(teacher.education) ? teacher.education : JSON.parse(teacher.education || "[]")).length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-primary tracking-[0.2em] uppercase mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                      <GraduationCap size={18} className="text-[#CEB888]" /> Education History
                    </h3>
                    <div className="space-y-4">
                      {(Array.isArray(teacher.education) ? teacher.education : JSON.parse(teacher.education || "[]")).map((edu: any, i: number) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-[#CEB888]/30 hover:border-l-[#CEB888]">
                          <div className="flex items-start justify-between gap-4">
                             <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CEB888]">{edu.level}</span>
                                <h4 className="font-black text-primary text-base tracking-tight">{edu.subject || "General"}</h4>
                                <p className="text-xs font-bold text-muted mt-1 leading-relaxed opacity-80">{edu.institution}</p>
                             </div>
                             <div className="p-2.5 bg-[#FAFAF7] rounded-xl text-[#CEB888] group-hover:bg-[#CEB888] group-hover:text-white transition-colors">
                                <BookOpen size={16} />
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back */}
                <div className="pt-4 border-t border-gray-100">
                  <Link href="/teachers" className="w-full py-4 rounded-xl bg-[#1F3D2B] text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                    <ArrowLeft size={14} /> All Teachers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
