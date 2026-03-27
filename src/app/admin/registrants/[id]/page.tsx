"use client"

import { useEffect, useState, use } from "react"
import { ArrowLeft, User, School, Phone, CheckCircle, XCircle, Download, FileText, Calendar, MapPin, CreditCard, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { adminUpdateRegistrantStatus, adminDeleteRegistrant, adminGetRegistrantById } from "@/app/actions/admin"
import { Registrant } from "@/types"

export default function RegistrantDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const [registrant, setRegistrant] = useState<Registrant | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await adminGetRegistrantById(unwrappedParams.id)
      setRegistrant(data)
    } catch (error) {
      console.error("Failed to load registrant", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [unwrappedParams.id])

  const handleStatusUpdate = async (status: 'APPROVED' | 'REJECTED') => {
    if(!registrant) return
    if(!confirm(`Are you sure you want to mark this application as ${status}?`)) return
    
    try {
      // Using SERVER ACTION to bypass RLS
      await adminUpdateRegistrantStatus(registrant.id, status)
      alert(`Status updated to ${status}!`)
      await loadData()
    } catch (error: any) {
      console.error("Failed to update status", error)
      alert(`Status update failed: ${error.message || 'Unknown error'}`)
    }
  }

  const handleDelete = async () => {
    if(!registrant) return
    if(!confirm("Are you sure you want to PERMANENTLY delete this registrant? This action cannot be undone.")) return
    
    try {
      // Using SERVER ACTION to bypass RLS
      await adminDeleteRegistrant(registrant.id)
      alert("Registrant deleted successfully.")
      window.location.href = '/admin/registrants'
    } catch (error: any) {
      console.error("Failed to delete registrant", error)
      alert(`Deletion failed: ${error.message || 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-[10px] font-black tracking-widest uppercase text-muted">Loading Application Data...</p>
      </div>
    )
  }

  if (!registrant) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center flex-col gap-4">
        <XCircle className="text-rose-500" size={48} />
        <p className="text-[10px] font-black tracking-widest uppercase text-muted">Application Not Found</p>
        <Link href="/admin/registrants" className="mt-4 px-6 py-3 bg-[#1F3D2B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Return to Directory</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <Link href="/admin/registrants" className="p-3 hover:bg-[#FAFAF7] rounded-2xl transition-all border border-transparent hover:border-gray-100">
              <ArrowLeft size={20} className="text-primary" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-primary tracking-tight">{registrant.full_name_en}</h1>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Registrant ID: #{registrant.alumni_number || registrant.id.split('-')[0]}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button 
                onClick={handleDelete}
                className="px-6 py-3 rounded-2xl border-2 border-gray-100 text-muted font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest"
              >
                <Trash2 size={18} /> Delete
            </button>
            {registrant.registration_status !== 'REJECTED' && (
              <button 
                onClick={() => handleStatusUpdate('REJECTED')}
                className="px-6 py-3 rounded-2xl border-2 border-rose-100 text-rose-600 font-bold hover:bg-rose-50 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest"
              >
                <XCircle size={18} /> Reject
              </button>
            )}
            {registrant.registration_status !== 'APPROVED' && (
              <button 
                onClick={() => handleStatusUpdate('APPROVED')}
                className="px-8 py-3 rounded-2xl bg-[#1F3D2B] text-[#CEB888] font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest"
              >
                <CheckCircle size={18} /> Approve
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Summary & Photo */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1F3D2B]/5 rounded-bl-[4rem] z-0"></div>
            <div className="w-40 h-40 mx-auto rounded-4xl bg-[#FAFAF7] border border-gray-100 shadow-md overflow-hidden mb-8 relative z-10 flex items-center justify-center">
              {registrant.photo_url ? (
                <img 
                  src={registrant.photo_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-muted/30" />
              )}
            </div>
            <h2 className="text-xl font-bold text-primary mb-1">{registrant.full_name_en}</h2>
            <p className="text-muted text-sm font-medium mb-6 uppercase tracking-widest text-[10px]">{registrant.occupation || 'N/A'}</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <span className="bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 text-primary px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase">
                SSC Batch {registrant.ssc_batch || registrant.batch || 'N/A'}
              </span>
              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border
                ${registrant.registration_status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  registrant.registration_status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                {registrant.registration_status}
              </span>
              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border
                ${registrant.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-muted border-gray-100'}`}>
                Payment: {registrant.payment_status || 'PENDING'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
            <h3 className="font-black text-primary mb-6 flex items-center gap-3 tracking-tight">
              <Phone size={20} className="text-[#CEB888]" />
              Contact Details
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Mobile</p>
                <p className="font-bold text-primary tracking-wide text-sm">{registrant.mobile}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Email</p>
                <p className="font-bold text-primary tracking-wide text-sm break-all">{registrant.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">WhatsApp</p>
                <p className="font-bold text-primary tracking-wide text-sm">{registrant.whatsapp || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Present Address</p>
                <p className="font-bold text-primary tracking-wide text-xs leading-relaxed">{registrant.present_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
            <h3 className="font-black text-primary text-xl mb-8 flex items-center gap-3 tracking-tight">
              <User size={24} className="text-[#CEB888]" />
              Form Data
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 border-b border-gray-50 pb-3 flex items-center gap-2">
                    <School size={14} className="text-primary" /> Academic Journey
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-gray-100 flex items-center justify-center text-primary">
                        <School size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted font-black uppercase tracking-widest">Admission</p>
                        <p className="font-black text-primary text-sm">{registrant.admission_year || 'N/A'} (Class {registrant.admission_class || 'N/A'})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-gray-100 flex items-center justify-center text-primary">
                        <Calendar size={16} />
                      </div>
                      <div>
                         <p className="text-[10px] text-muted font-black uppercase tracking-widest">Leaving</p>
                         <p className="font-black text-primary text-sm">{registrant.leaving_year || 'N/A'} (Class {registrant.leaving_class || 'N/A'})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-gray-100 flex items-center justify-center text-primary">
                        <FileText size={16} />
                      </div>
                      <div>
                         <p className="text-[10px] text-muted font-black uppercase tracking-widest">Certificate</p>
                         <p className="font-black text-primary text-sm">{registrant.certificate || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                   <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 border-b border-gray-50 pb-3 flex items-center gap-2">
                    <User size={14} className="text-primary" /> Core Identity
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Bengali Name</p>
                      <p className="font-bold text-primary">{registrant.full_name_bn}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Father's Name</p>
                      <p className="font-bold text-primary text-sm">{registrant.father_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Mother's Name</p>
                      <p className="font-bold text-primary text-sm">{registrant.mother_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Date of Birth</p>
                      <p className="font-bold text-primary text-sm">{registrant.dob}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                   <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 border-b border-gray-50 pb-3 flex items-center gap-2">
                    <MapPin size={14} className="text-primary" /> Attendance & Logistics
                  </h4>
                  <div className="space-y-3 text-sm font-medium text-primary">
                    <div className="flex justify-between items-center p-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl">
                      <span className="text-xs font-bold tracking-wide">Attending Event</span>
                      <span className="font-black text-emerald-600 text-xs">{registrant.attending ? 'YES' : 'NO'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl">
                      <span className="text-xs font-bold tracking-wide">Spouse Attending</span>
                      <span className="font-black text-emerald-600 text-xs">{registrant.spouse_attending ? 'YES' : 'NO'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl">
                      <span className="text-xs font-bold tracking-wide">Children</span>
                      <span className="font-black text-xs">{registrant.children_count || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl">
                      <span className="text-xs font-bold tracking-wide">T-shirt Size</span>
                      <span className="font-black text-xs px-2 py-0.5 bg-[#1F3D2B]/10 rounded-md">{registrant.tshirt_size || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(registrant.certificate_url || registrant.school_photo_url) && (
             <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
               <h3 className="font-black text-primary text-xl mb-8 flex items-center gap-3 tracking-tight">
                 <FileText size={24} className="text-[#CEB888]" />
                 Attached Media
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {registrant.certificate_url && (
                    <a href={registrant.certificate_url} target="_blank" rel="noreferrer" className="border border-gray-100 bg-[#FAFAF7] hover:border-[#1F3D2B]/20 hover:shadow-md rounded-3xl p-6 flex flex-col items-center justify-center text-center group transition-all">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <FileText size={32} />
                      </div>
                      <p className="font-black text-primary text-sm mb-1 line-clamp-1">SSC Certificate</p>
                      <p className="text-[10px] text-muted font-bold uppercase mb-4 tracking-widest">Document View</p>
                      <span className="text-[#CEB888] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:text-primary transition-colors">
                        <Download size={14} /> Open File
                      </span>
                    </a>
                 )}
                 {registrant.school_photo_url && (
                    <a href={registrant.school_photo_url} target="_blank" rel="noreferrer" className="border border-gray-100 bg-[#FAFAF7] hover:border-[#1F3D2B]/20 hover:shadow-md rounded-3xl p-6 flex flex-col items-center justify-center text-center group transition-all">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 overflow-hidden">
                        <img src={registrant.school_photo_url} alt="School" className="w-full h-full object-cover" />
                      </div>
                      <p className="font-black text-primary text-sm mb-1 line-clamp-1">School Photo</p>
                      <p className="text-[10px] text-muted font-bold uppercase mb-4 tracking-widest">Image View</p>
                      <span className="text-[#CEB888] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:text-primary transition-colors">
                        <Download size={14} /> Open File
                      </span>
                    </a>
                 )}
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  )
}
