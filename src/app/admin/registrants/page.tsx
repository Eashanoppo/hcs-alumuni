"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Search, CheckCircle, Trash2, Eye, Printer, Loader2, Download } from "lucide-react"
import Link from "next/link"
import { 
  adminGetAllRegistrants, 
  adminUpdateRegistrantStatus, 
  adminDeleteRegistrant,
  adminGetRegistrantsWithPayments 
} from "@/app/actions/admin"
import { useNotification } from "@/lib/contexts/NotificationContext"
import RegistrantImportModal from "@/components/admin/RegistrantImportModal"
import RegistrantPrintReport from "@/components/admin/RegistrantPrintReport"
import { Registrant } from "@/types"

export default function AdminRegistrantsPage() {
  const [registrants, setRegistrants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [batchFilter, setBatchFilter] = useState("ALL")
  const [bloodDonationFilter, setBloodDonationFilter] = useState("ALL")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [printType, setPrintType] = useState<'PAID' | 'UNPAID'>('PAID')
  
  const { notify } = useNotification()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await adminGetRegistrantsWithPayments()
      setRegistrants(data)
    } catch (err: any) {
      notify(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await adminUpdateRegistrantStatus(id, status)
      notify(`Registrant ${status.toLowerCase()}`, "success")
      loadData()
    } catch (err: any) {
      notify(err.message, "error")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registrant?")) return
    try {
      await adminDeleteRegistrant(id)
      notify("Registrant deleted", "success")
      loadData()
    } catch (err: any) {
      notify(err.message, "error")
    }
  }

  const handleBulkUpdate = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => adminUpdateRegistrantStatus(id, status)))
      notify(`Updated ${selectedIds.size} records`, "success")
      setSelectedIds(new Set())
      loadData()
    } catch (err: any) {
      notify(err.message, "error")
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} records?`)) return
    try {
      await Promise.all(Array.from(selectedIds).map(id => adminDeleteRegistrant(id)))
      notify("Deleted records", "success")
      setSelectedIds(new Set())
      loadData()
    } catch (err: any) {
      notify(err.message, "error")
    }
  }

  const filteredRegistrants = useMemo(() => {
    return registrants.filter(r => {
      const matchesSearch = 
        r.full_name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.mobile.includes(searchQuery) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "ALL" || r.registration_status === statusFilter
      const matchesBatch = batchFilter === "ALL" || r.batch === batchFilter || r.ssc_batch === batchFilter
      const matchesBlood = bloodDonationFilter === "ALL" || 
        (bloodDonationFilter === "YES" ? r.blood_donation_interest : !r.blood_donation_interest)

      return matchesSearch && matchesStatus && matchesBatch && matchesBlood
    })
  }, [registrants, searchQuery, statusFilter, batchFilter, bloodDonationFilter])

  const batches = useMemo(() => {
    const b = new Set(registrants.map(r => r.batch || r.ssc_batch).filter(Boolean))
    return Array.from(b).sort()
  }, [registrants])

  const isAllSelected = filteredRegistrants.length > 0 && selectedIds.size === filteredRegistrants.length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredRegistrants.map(r => r.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  const handlePrint = async (type: 'PAID' | 'UNPAID') => {
    try {
      setLoading(true)
      setPrintType(type)
      // Small delay to ensure state updates before print
      setTimeout(() => {
        window.print()
      }, 500)
    } catch (err: any) {
      notify("Failed to prepare print report", "error")
    } finally {
      setLoading(false)
    }
  }

  // Data for printing
  const paidForPrint = useMemo(() => registrants.filter(r => r.payment_status === 'PAID'), [registrants])
  const unpaidForPrint = useMemo(() => registrants.filter(r => r.payment_status !== 'PAID'), [registrants])

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="p-8 md:p-12 no-print">
        <header className="flex items-center gap-6 mb-12">
          <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm md:shadow-none hover:shadow-premium">
            <ArrowLeft size={20} className="text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Applications Directory</h1>
            <p className="text-muted text-sm font-medium">Manage all registrants ({registrants.length})</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto space-y-8">
          {/* Action & Filter Card */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-premium flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setIsImportModalOpen(true)} 
                  className="px-6 py-4 bg-[#1F3D2B] rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                >
                  Import Registrants
                </button>
                <button 
                  onClick={() => handlePrint('PAID')}
                  className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-primary font-black text-[10px] uppercase tracking-widest hover:bg-[#FAFAF7] transition-all flex items-center gap-2"
                >
                  <Printer size={14} /> Print Paid
                </button>
                <button 
                  onClick={() => handlePrint('UNPAID')}
                  className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2"
                >
                  <Printer size={14} /> Print Unpaid
                </button>
                
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-2 pl-4 border-l border-gray-100 ml-2">
                    <button onClick={() => handleBulkUpdate('APPROVED')} className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle size={14} /> Approve ({selectedIds.size})
                    </button>
                    <button onClick={handleBulkDelete} className="px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                      <Trash2 size={14} /> Delete ({selectedIds.size})
                    </button>
                  </div>
                )}
              </div>

              <div className="relative w-full lg:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#FAFAF7] border-0 px-5 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary/10 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select 
                value={batchFilter}
                onChange={e => setBatchFilter(e.target.value)}
                className="bg-[#FAFAF7] border-0 px-5 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary/10 outline-none"
              >
                <option value="ALL">SSC Batch (All)</option>
                {batches.map(b => <option key={b} value={b}>SSC Batch {b}</option>)}
              </select>
              <select 
                value={bloodDonationFilter}
                onChange={e => setBloodDonationFilter(e.target.value)}
                className="bg-[#FAFAF7] border-0 px-5 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary/10 outline-none"
              >
                <option value="ALL">Blood Donor (All)</option>
                <option value="YES">Interested</option>
                <option value="NO">Not Interested</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FAFAF7] text-[10px] font-black tracking-widest text-muted uppercase">
                  <tr>
                    <th className="px-8 py-6 w-12 text-center">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer" checked={isAllSelected} onChange={toggleSelectAll} disabled={filteredRegistrants.length === 0} />
                    </th>
                    <th className="px-8 py-6">Registrant</th>
                    <th className="px-8 py-6">Contact</th>
                    <th className="px-8 py-6">Details</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right pr-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-24 text-center">
                        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={40} />
                        <p className="text-[10px] font-black tracking-widest uppercase text-muted">Synchronizing Directory...</p>
                      </td>
                    </tr>
                  ) : filteredRegistrants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-24 text-center text-muted font-black text-[10px] tracking-widest uppercase">No records found.</td>
                    </tr>
                  ) : (
                    filteredRegistrants.map((r) => (
                      <tr key={r.id} className={`hover:bg-[#FAFAF7]/50 transition-all group ${selectedIds.has(r.id) ? 'bg-primary/5' : ''}`}>
                        <td className="px-8 py-8 text-center">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer" checked={selectedIds.has(r.id)} onChange={() => toggleSelect(r.id)} />
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary overflow-hidden shadow-sm">
                              {r.photo_url ? (
                                 <img src={r.photo_url} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                  r.full_name_en.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="font-black text-primary tracking-tight text-lg leading-tight mb-0.5">{r.full_name_en}</p>
                              <p className="text-[10px] text-muted font-bold mb-1 tracking-tight">S/O: {r.father_name}</p>
                              <p className="text-[9px] text-muted font-black tracking-widest uppercase">{r.alumni_number || 'REG-PENDING'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <p className="font-black text-primary text-base mb-1">{r.mobile}</p>
                          <p className="text-[10px] text-muted font-bold truncate max-w-[150px]">{r.email}</p>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-lg uppercase border border-primary/5">
                                Batch {r.batch || r.ssc_batch}
                              </span>
                              <span className="text-[10px] font-black text-accent bg-accent/5 px-2.5 py-1 rounded-lg uppercase border border-accent/5">
                                {r.tshirt_size}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-primary/70">
                                Attending: <span className="text-primary font-black">{(1 + (r.spouse_attending ? 1 : 0) + (r.children_count || 0))}</span>
                              </span>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${r.payment_status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                • {r.payment_status || 'PENDING'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <span className={`flex items-center gap-2 text-[9px] uppercase font-black tracking-widest w-fit px-4 py-2 rounded-xl border
                            ${r.registration_status === 'APPROVED' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                              r.registration_status === 'REJECTED' ? 'text-rose-700 bg-rose-50 border-rose-100' : 'text-amber-700 bg-amber-50 border-amber-100'}
                          `}>
                            <div className={`w-1.5 h-1.5 rounded-full ${r.registration_status === 'APPROVED' ? 'bg-emerald-500' : r.registration_status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></div>
                            {r.registration_status}
                          </span>
                        </td>
                        <td className="px-8 py-8 text-right pr-12">
                          <div className="flex justify-end gap-3">
                            <Link href={`/admin/registrants/${r.id}`} className="p-3 bg-white border border-gray-100 hover:border-primary rounded-2xl text-primary transition-all shadow-sm hover:shadow-premium">
                              <Eye size={18} />
                            </Link>
                            {r.registration_status !== 'APPROVED' && (
                              <button onClick={() => handleStatusUpdate(r.id, 'APPROVED')} className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 transition-all hover:bg-emerald-100">
                                <CheckCircle size={18} />
                              </button>
                            )}
                            <button onClick={() => handleDelete(r.id)} className="p-3 bg-white border border-gray-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-2xl text-muted transition-all shadow-sm">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-10 border-t border-gray-50 bg-[#FAFAF7]/30 flex justify-between items-center text-muted">
              <span className="text-[10px] font-black tracking-widest uppercase">Showing {filteredRegistrants.length} entries • HCS Alumni Portal</span>
            </div>
          </div>
        </main>
      </div>

      <RegistrantImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onSuccess={() => { setIsImportModalOpen(false); loadData(); }} 
      />

      <div className="print-report-root">
        <RegistrantPrintReport 
          registrants={printType === 'PAID' ? paidForPrint : unpaidForPrint} 
          reportType={printType} 
        />
      </div>
    </div>
  )
}
