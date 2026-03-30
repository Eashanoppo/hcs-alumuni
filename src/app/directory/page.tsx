"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Search, Filter, Phone, Mail, MessageSquare, X, User, ExternalLink, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Registrant } from "@/types"

export default function DirectoryPage() {
  const [alumni, setAlumni] = useState<Registrant[]>([])
  const [filteredAlumni, setFilteredAlumni] = useState<Registrant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLeavingYear, setSelectedLeavingYear] = useState("All")
  const [selectedSSCBatch, setSelectedSSCBatch] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlumnus, setSelectedAlumnus] = useState<Registrant | null>(null)
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentAlumniNumber, setCurrentAlumniNumber] = useState<string | null>(null)

  useEffect(() => {
    const match = document.cookie.match(/(^| )alumni_session=([^;]+)/)
    if (match) {
      setIsLoggedIn(true)
      setCurrentAlumniNumber(match[2])
    }

    async function fetchAlumni() {
      // ONLY show APPROVED alumni
      const { data, error } = await supabase
        .from('registrants')
        .select('*')
        .eq('registration_status', 'APPROVED')
        .order('ssc_batch', { ascending: false })

      if (!error && data) {
        setAlumni(data)
        setFilteredAlumni(data)
      } else if (error) {
        console.error("Directory fetch error:", error)
      }
      setLoading(false)
    }
    fetchAlumni()
  }, [])

  useEffect(() => {
    let result = alumni
    if (selectedLeavingYear !== "All") {
      result = result.filter(a => a.leaving_year === selectedLeavingYear)
    }
    if (selectedSSCBatch !== "All") {
      result = result.filter(a => a.ssc_batch === selectedSSCBatch)
    }
    if (searchQuery) {
      result = result.filter(a => 
        a.full_name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.mobile.includes(searchQuery)
      )
    }
    setFilteredAlumni(result)
  }, [selectedLeavingYear, selectedSSCBatch, searchQuery, alumni])

  // Filter ranges
  const leavingYears = ["All", ...Array.from({ length: 2026 - 2002 + 1 }, (_, i) => (2002 + i).toString()).reverse()]
  const sscBatches = ["All", ...Array.from({ length: 2026 - 2009 + 1 }, (_, i) => (2009 + i).toString()).reverse()]

  // Helper for generating slugs
  const toSlug = (name: string, batch: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + batch
  }

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-[#FAFAF7]">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tighter">Alumni Directory</h1>
          <p className="text-muted font-black uppercase tracking-[0.3em] text-xs">Verified Members of Holy Crescent School</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-premium border border-gray-100 p-6 mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-grow w-full">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search by name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-[#CEB888] shrink-0" />
              <select 
                value={selectedLeavingYear}
                onChange={(e) => setSelectedLeavingYear(e.target.value)}
                className="bg-[#FAFAF7] border-none rounded-2xl py-3 px-4 font-bold text-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs w-full sm:w-40"
              >
                <option value="All">Leaving Year (All)</option>
                {leavingYears.filter(y => y !== "All").map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select 
                value={selectedSSCBatch}
                onChange={(e) => setSelectedSSCBatch(e.target.value)}
                className="bg-[#FAFAF7] border-none rounded-2xl py-3 px-4 font-bold text-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs w-full sm:w-44"
              >
                <option value="All">SSC Batch (All)</option>
                {sscBatches.filter(b => b !== "All").map(b => (
                  <option key={b} value={b}>SSC Batch {b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Accessing Database...</p>
          </div>
        ) : filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAlumni.map((person) => (
              <div key={person.id} className="bg-white rounded-[2rem] shadow-premium border border-gray-100 overflow-hidden group hover:-translate-y-1 transition-all">
                <div className="h-32 bg-[#1F3D2B] relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 bg-[url('/pattern.png')] bg-repeat"></div>
                </div>
                <div className="px-6 pb-8 -mt-16 relative z-10 text-center">
                   <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg mx-auto mb-4">
                      <div className="w-full h-full rounded-xl bg-[#FAFAF7] overflow-hidden flex items-center justify-center text-primary font-black text-2xl border border-gray-100">
                        {person.photo_url ? (
                          <img src={person.photo_url} alt={person.full_name_en} className="w-full h-full object-cover" />
                        ) : (
                          person.full_name_en.charAt(0).toUpperCase()
                        )}
                      </div>
                   </div>
                   <h3 className="text-lg font-black text-primary truncate">{person.full_name_en}</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">SSC Batch {person.ssc_batch || person.batch}</p>
                   
                   <p className="text-xs font-bold text-[#CEB888] mb-6 min-h-[1rem]">{person.occupation || 'Alumnus'}</p>
                   
                   <Link 
                    href={`/directory/${toSlug(person.full_name_en, person.ssc_batch || person.batch || '0000')}`}
                    className="w-full py-3 bg-[#FAFAF7] border border-gray-100 rounded-xl text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                   >
                     <User size={14} /> View Identity
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-12">
             <div className="w-20 h-20 bg-[#FAFAF7] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <User size={32} className="text-gray-200" />
             </div>
             <p className="text-muted font-bold tracking-tight">No approved alumni found matching your criteria.</p>
             <p className="text-[10px] font-black uppercase tracking-widest text-muted/50 mt-2">Only approved members appear in the public directory</p>
          </div>
        )}
      </main>

      {/* Contact Modal */}
      {selectedAlumnus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 relative">
                 <button 
                  onClick={() => setSelectedAlumnus(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 transition-colors text-muted"
                 >
                   <X size={20} />
                 </button>

                 <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-[#FAFAF7] overflow-hidden border border-gray-100 flex-shrink-0">
                      {selectedAlumnus.photo_url ? (
                        <img src={selectedAlumnus.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-gray-300 mx-auto mt-4" />
                      )}
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-primary leading-tight">{selectedAlumnus.full_name_en}</h2>
                       <p className="text-xs font-bold text-[#CEB888]">SSC Batch {selectedAlumnus.ssc_batch || selectedAlumnus.batch}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={selectedAlumnus.alumni_number === currentAlumniNumber ? "w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center" : "w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center"}>
                             {selectedAlumnus.alumni_number === currentAlumniNumber ? <Phone size={18} /> : <Lock size={18} />}
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-0.5">Mobile</p>
                             <p className="font-bold text-primary">
                               {selectedAlumnus.alumni_number === currentAlumniNumber ? selectedAlumnus.mobile : "Private"}
                             </p>
                          </div>
                       </div>
                       {selectedAlumnus.alumni_number === currentAlumniNumber && (
                        <a href={`tel:${selectedAlumnus.mobile}`} className="p-2 text-primary hover:scale-110 transition-transform">
                            <ExternalLink size={18} />
                        </a>
                       )}
                    </div>

                    <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={isLoggedIn || selectedAlumnus.alumni_number === currentAlumniNumber ? "w-10 h-10 rounded-xl bg-[#CEB888] text-white flex items-center justify-center" : "w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center"}>
                             {isLoggedIn || selectedAlumnus.alumni_number === currentAlumniNumber ? <Mail size={18} /> : <Lock size={18} />}
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-0.5">Email</p>
                             <p className="font-bold text-primary truncate max-w-[180px]">
                               {isLoggedIn || selectedAlumnus.alumni_number === currentAlumniNumber ? selectedAlumnus.email : "Login to view"}
                             </p>
                          </div>
                       </div>
                       {(isLoggedIn || selectedAlumnus.alumni_number === currentAlumniNumber) && (
                        <a href={`mailto:${selectedAlumnus.email}`} className="p-2 text-primary hover:scale-110 transition-transform">
                            <ExternalLink size={18} />
                        </a>
                       )}
                    </div>

                    {selectedAlumnus.whatsapp && (
                      <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={selectedAlumnus.alumni_number === currentAlumniNumber ? "w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center" : "w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center"}>
                              {selectedAlumnus.alumni_number === currentAlumniNumber ? <MessageSquare size={18} /> : <Lock size={18} />}
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-0.5">WhatsApp</p>
                               <p className="font-bold text-primary">
                                 {selectedAlumnus.alumni_number === currentAlumniNumber ? selectedAlumnus.whatsapp : "Private"}
                               </p>
                            </div>
                        </div>
                        {selectedAlumnus.alumni_number === currentAlumniNumber && (
                        <a href={`https://wa.me/${selectedAlumnus.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="p-2 text-primary hover:scale-110 transition-transform">
                            <ExternalLink size={18} />
                        </a>
                        )}
                      </div>
                    )}
                 </div>

                 {!isLoggedIn && (
                   <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <p className="text-[10px] font-bold text-primary text-center">
                       <Link href="/login/alumni" className="underline decoration-[#CEB888]">Login as Alumnus</Link> to connect and view email addresses.
                     </p>
                   </div>
                 )}

                 <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-4">
                    {selectedAlumnus.facebook_url && (
                      <a href={selectedAlumnus.facebook_url} target="_blank" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                        <User size={20} />
                      </a>
                    )}
                    {selectedAlumnus.instagram_url && (
                      <a href={selectedAlumnus.instagram_url} target="_blank" className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all transform hover:-translate-y-1">
                        <User size={20} />
                      </a>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
