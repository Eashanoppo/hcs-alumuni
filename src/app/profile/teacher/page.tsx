import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getTeacherById } from "@/lib/teacher-db"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import TeacherProfileActions from "@/components/profile/TeacherProfileActions"
import Link from "next/link"
import { LogOut, MapPin, Briefcase, Calendar, Award, Phone, CheckCircle, Clock, Link2, GraduationCap } from "lucide-react"

export default async function TeacherProfilePage() {
  const cookieStore = await cookies()
  const teacherSession = cookieStore.get("teacher_session")?.value

  if (!teacherSession || teacherSession === "undefined" || teacherSession === "null") {
    redirect("/login/teachers")
  }

  const teacher = await getTeacherById(teacherSession)
  if (!teacher) {
    redirect("/login/teachers")
  }

  const isApproved = teacher.status === 'APPROVED'
  const isPending  = teacher.status === 'PENDING'

  // Prefer English name, fall back to Bangla
  const displayName = teacher.full_name_en || teacher.full_name || ""
  const banglaName  = teacher.full_name_bn  || ""

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-5xl mx-auto w-full">

        {teacher.is_founder_guide && (
          <div className="mb-6 bg-gradient-to-r from-[#CEB888] to-[#B09A6A] p-6 rounded-3xl text-white shadow-xl flex items-center justify-between animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 border border-white/30 px-3 py-1 rounded-full mb-3 inline-block">Special Recognition</span>
              <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">Our Founder & Guide</h2>
              {teacher.founder_guide_note && <p className="mt-2 font-medium opacity-90">{teacher.founder_guide_note}</p>}
            </div>
            <Award size={48} className="opacity-20 absolute right-8" />
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden">
          {/* Header Cover */}
          <div className="h-48 bg-[#1F3D2B] relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>

          <div className="px-8 md:px-16 pb-12 relative -mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                {/* Avatar */}
                <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl relative z-10 -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="w-full h-full rounded-[2rem] bg-gray-50 border-2 border-gray-100 overflow-hidden flex items-center justify-center">
                    {teacher.photo_url ? (
                      <img src={teacher.photo_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-black text-gray-300">{displayName.charAt(0)}</span>
                    )}
                  </div>
                </div>

                <div className="text-center md:text-left pb-2">
                  <h1 className="text-4xl font-black text-primary tracking-tight leading-tight">{displayName}</h1>
                  {banglaName && <p className="text-xl font-bold text-[#CEB888] mt-1">{banglaName}</p>}
                  <p className="text-muted font-bold text-lg mt-2">
                    {teacher.designation} <span className="mx-2">•</span> {teacher.subject}
                  </p>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex flex-col items-center md:items-end gap-3 pb-2">
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm ${
                  isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  teacher.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {isApproved ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {isApproved ? 'Approved Teacher' : isPending ? 'Pending Approval' : 'Rejected'}
                </div>
              </div>
            </div>

            {isPending && (
              <div className="mb-10 p-6 bg-amber-50 border border-amber-100 rounded-3xl text-amber-800 text-sm font-bold flex items-center gap-4">
                <Clock className="shrink-0" size={24} />
                <p>আপনার আবেদন পর্যালোচনা করা হচ্ছে। অনুমোদনের পর আপনি শিক্ষক তালিকায় দেখা যাবেন।</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">

                {/* Professional */}
                <div>
                  <h3 className="text-sm font-black text-primary tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-gray-50 pb-4">
                    <Briefcase size={20} className="text-[#CEB888]" /> Professional Info
                  </h3>
                  <div className="bg-[#FAFAF7] rounded-3xl p-8 border border-gray-100 space-y-6">
                    <div className="flex gap-4 border-b border-gray-100 pb-6">
                      <Calendar className="text-muted shrink-0" size={20} />
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888]">Joined School</p>
                        <p className="font-bold text-primary text-lg">{teacher.joining_date}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 border-b border-gray-100 pb-6">
                      <Calendar className="text-muted shrink-0" size={20} />
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888]">Left School</p>
                        <p className="font-bold text-primary text-lg">{teacher.leaving_year}</p>
                      </div>
                    </div>
                    {teacher.teacher_id && (
                      <div className="flex gap-4 border-b border-gray-100 pb-6">
                        <Award className="text-muted shrink-0" size={20} />
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888]">Teacher ID</p>
                          <p className="font-black text-primary font-mono text-xl">{teacher.teacher_id}</p>
                        </div>
                      </div>
                    )}
                    {teacher.current_occupation && (
                      <div className="flex gap-4 border-b border-gray-100 pb-6">
                        <Briefcase className="text-muted shrink-0" size={20} />
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888]">Current Occupation</p>
                          <p className="font-bold text-primary text-lg">{teacher.current_occupation}</p>
                        </div>
                      </div>
                    )}
                    {teacher.current_institution && (
                      <div className="flex gap-4">
                        <GraduationCap className="text-muted shrink-0" size={20} />
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888]">Current Institution</p>
                          <p className="font-bold text-primary text-lg">{teacher.current_institution}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event */}
                {(teacher.willing_to_attend || (teacher.activities && teacher.activities.length > 0) || teacher.memory_note) && (
                  <div>
                    <h3 className="text-sm font-black text-primary tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-gray-50 pb-4">
                      <Award size={20} className="text-[#CEB888]" /> Event Participation
                    </h3>
                    <div className="bg-[#FAFAF7] rounded-3xl p-8 border border-gray-100 space-y-6">
                      {teacher.willing_to_attend && (
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mb-2">Attending Silver Jubilee?</p>
                          <span className="inline-block px-4 py-2 bg-white rounded-xl border border-gray-100 font-black text-sm text-primary">
                            {teacher.willing_to_attend}
                          </span>
                        </div>
                      )}
                      {teacher.activities && teacher.activities.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mb-4">Interested Activities</p>
                          <div className="flex flex-wrap gap-3">
                            {teacher.activities.map((act: string, i: number) => (
                              <span key={i} className="px-4 py-2 bg-white rounded-xl border border-gray-100 font-bold text-xs text-primary shadow-sm">
                                {act}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {teacher.memory_note && (
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mb-2">Memory / Note</p>
                          <div className="p-5 bg-white rounded-2xl border border-gray-100 text-sm font-medium leading-relaxed italic text-muted">
                            "{teacher.memory_note}"
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Login credentials hint */}
                <div className="bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 rounded-2xl p-5">
                  <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-3">Your Login Credentials</p>
                  <p className="text-xs font-bold text-muted mb-1">Mobile (ID)</p>
                  <p className="font-mono font-black text-primary text-sm mb-3">{teacher.mobile}</p>
                  <p className="text-xs font-bold text-muted mb-1">Password (Joining Date)</p>
                  <p className="font-mono font-black text-primary text-sm">{teacher.joining_date}</p>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-xs font-black text-primary tracking-widest uppercase mb-4 border-b border-gray-100 pb-3">Contact Details</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-gray-100 flex items-center justify-center shrink-0">
                        <Phone size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Mobile</p>
                        <p className="font-bold text-primary">{teacher.mobile}</p>
                      </div>
                    </li>
                    {teacher.present_address && (
                      <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-gray-100 flex items-center justify-center shrink-0">
                          <MapPin size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Address</p>
                          <p className="font-bold text-sm text-primary leading-relaxed">{teacher.present_address}</p>
                        </div>
                      </li>
                    )}
                    {teacher.facebook_url && (
                      <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-gray-100 flex items-center justify-center shrink-0">
                          <Link2 size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Facebook</p>
                          <a href={teacher.facebook_url} target="_blank" rel="noopener noreferrer" className="font-bold text-sm text-primary hover:text-[#CEB888] transition-colors truncate block max-w-[200px]">
                            {teacher.facebook_url.replace(/https?:\/\/(www\.)?facebook\.com\//, '')}
                          </a>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Education */}
                {teacher.education && teacher.education.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-primary tracking-widest uppercase mb-4 border-b border-gray-100 pb-3">Education History</h3>
                    <ul className="space-y-5">
                      {teacher.education.map((edu: any, i: number) => (
                        <li key={i} className="flex gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#CEB888] mt-2 shrink-0"></div>
                          <div>
                            <p className="font-black text-primary text-sm">{edu.level}{edu.subject ? ` — ${edu.subject}` : ''}</p>
                            <p className="text-xs font-bold text-muted mt-1">{edu.institution}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions (Edit/Logout) */}
                <div className="pt-8 border-t border-gray-100">
                  <TeacherProfileActions teacher={teacher} />
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
