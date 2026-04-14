"use client"

import { useState, useEffect } from "react"
import { getAllApprovedTeachers } from "@/lib/teacher-db"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Search, MapPin, Award, Loader2 } from "lucide-react"

export default function TeachersContent() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("ALL")

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getAllApprovedTeachers()
        setTeachers(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeachers()
  }, [])

  // Extract unique subjects for the filter drop down
  const subjects = Array.from(new Set(teachers.map(t => t.subject))).filter(Boolean).sort()

  const filteredTeachers = teachers.filter(t => {
    if (!t) return false;
    const displayName = (t.full_name_en || t.full_name_bn || "").toLowerCase();
    const safeSearchQuery = (searchQuery || "").toLowerCase();
    
    const matchesSearch = 
      displayName.includes(safeSearchQuery) || 
      (t.designation || "").toLowerCase().includes(safeSearchQuery);
      
    const matchesSubject = subjectFilter === "ALL" || t.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  })

  // Separate founders and normal teachers
  const founders = filteredTeachers.filter(t => t.is_founder_guide)
  const regularTeachers = filteredTeachers.filter(t => !t.is_founder_guide)

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tighter mb-4">Honorable Teachers</h1>
          <p className="text-muted text-sm font-bold tracking-widest uppercase max-w-2xl mx-auto">
            Our guiding stars who shaped our futures. Search and connect with your beloved mentors.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-16">
          <div className="relative grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or designation..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAF7] pl-16 pr-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none transition-all font-bold text-primary"
            />
          </div>
          <div className="w-full md:w-64 shrink-0">
            <select 
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="w-full bg-[#FAFAF7] px-6 py-4 rounded-2xl border border-gray-100 font-bold text-primary focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none appearance-none cursor-pointer"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((sub: any) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm font-black tracking-widest uppercase">Loading directory...</p>
          </div>
        ) : (
          <>
            {/* Founders & Guides Section */}
            {founders.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#CEB888] to-[#B09A6A] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Award size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-primary tracking-tight">Our Founder & Guide</h2>
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mt-1">Visionaries of HCS</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {founders.map(t => (
                    <Link key={t.id} href={`/teachers/${t.slug || t.id}`}><TeacherCard teacher={t} isFounder={true} /></Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Teachers Section */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#1F3D2B] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary tracking-tight">Our Mentors</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted mt-1">The Pillars of our Institution</p>
                </div>
              </div>

              {regularTeachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {regularTeachers.map(t => (
                    <Link key={t.id} href={`/teachers/${t.slug || t.id}`}><TeacherCard teacher={t} isFounder={false} /></Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <p className="text-muted font-bold uppercase tracking-widest text-sm">No teachers found matching your search.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

function TeacherCard({ teacher, isFounder }: { teacher: any, isFounder: boolean }) {
  return (
    <div className={`bg-white rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden flex flex-col h-full
      ${isFounder ? 'border-2 border-[#CEB888]/30 shadow-premium hover:shadow-2xl' : 'shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20'}
    `}>
      {isFounder && (
        <div className="absolute top-0 right-0 bg-gradient-to-br from-[#CEB888] to-[#B09A6A] text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-bl-2xl z-10 shadow-sm">
          Founder & Guide
        </div>
      )}

      <div className="flex items-center gap-5 mb-6">
        <div className={`w-20 h-20 shrink-0 rounded-[1.5rem] bg-gray-50 flex items-center justify-center overflow-hidden border-2 transition-colors
          ${isFounder ? 'border-[#CEB888]/20 group-hover:border-[#CEB888]' : 'border-gray-100 group-hover:border-primary/20'}
        `}>
          {teacher.photo_url ? (
            <img src={teacher.photo_url} alt={teacher.full_name_en || teacher.full_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-black text-gray-300">{(teacher.full_name_en || teacher.full_name || "?").charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="font-black text-primary text-xl leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {teacher.full_name_en || teacher.full_name_bn}
          </h3>
          {teacher.teacher_id && <p className="text-[10px] font-mono font-bold text-muted mt-1">{teacher.teacher_id}</p>}
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mb-1">Designation & Subject</p>
          <p className="font-bold text-sm text-primary">{teacher.designation} • {teacher.subject}</p>
        </div>
        
        <div>
          <p className="text-[10px] uppercase font-black tracking-widest text-[#CEB888] mb-1">Tenure</p>
          <p className="font-bold text-sm text-primary">
            {(teacher.joining_date || "").match(/\d{4}/)?.[0] || ""} &mdash; {teacher.leaving_year === "Present" ? "Present" : (teacher.leaving_year || "").match(/\d{4}/)?.[0] || teacher.leaving_year}
          </p>
        </div>

        {(isFounder && teacher.founder_guide_note) && (
          <div className="pt-4 mt-auto">
             <p className="text-xs font-medium italic text-muted leading-relaxed line-clamp-3">"{teacher.founder_guide_note}"</p>
          </div>
        )}
      </div>

    </div>
  )
}
