"use client"

import { useState, useEffect } from "react"
import { Users, Search, Eye, CheckCircle, XCircle, Loader2, ArrowLeft, Trash2, Filter } from "lucide-react"
import Link from "next/link"
import { adminUpdateRegistrantStatus, adminDeleteRegistrant, adminGetAllRegistrants, adminBulkDeleteRegistrants } from "@/app/actions/admin"
import { useNotification } from "@/lib/contexts/NotificationContext"
import { Registrant } from "@/types"
import RegistrantImportModal from "@/components/admin/RegistrantImportModal"

export default function AdminRegistrants() {
  const [registrants, setRegistrants] = useState<Registrant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [batchFilter, setBatchFilter] = useState('ALL')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { notify, confirm } = useNotification()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await adminGetAllRegistrants()
      setRegistrants(data || [])
    } catch (error) {
      console.error("Failed to fetch registrants", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const isConfirmed = await confirm(`Are you sure you want to mark this application as ${status}?`)
    if (!isConfirmed) return
    
    try {
      setLoading(true)
      const result = await adminUpdateRegistrantStatus(id, status)
      if (result) {
        notify(`Application successfully ${status.toLowerCase()}!`, 'success')
        await loadData()
      } else {
        notify("Failed to update status.", 'error')
      }
    } catch (error: any) {
      console.error("Status update failed", error)
      notify(`Status update failed: ${error.message || 'Unknown error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Are you sure you want to PERMANENTLY delete this registrant? This action cannot be undone.")
    if (!isConfirmed) return
    
    try {
      setLoading(true)
      await adminDeleteRegistrant(id)
      notify("Registrant deleted successfully.", 'success')
      await loadData()
    } catch (error: any) {
      console.error("Delete failed", error)
      notify(`Deletion failed: ${error.message || 'Unknown error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    const isConfirmed = await confirm(`Are you sure you want to PERMANENTLY delete ${selectedIds.size} registrants?`)
    if (!isConfirmed) return
    
    try {
      setLoading(true)
      await adminBulkDeleteRegistrants(Array.from(selectedIds))
      notify(`Successfully deleted ${selectedIds.size} registrants.`, 'success')
      setSelectedIds(new Set())
      await loadData()
    } catch (error: any) {
      console.error("Bulk delete failed", error)
      notify(`Bulk deletion failed: ${error.message || 'Unknown error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Generate fixed range 2009-2026 as per user request
  const batches = Array.from({ length: 2026 - 2009 + 1 }, (_, i) => (2009 + i).toString()).reverse()

  const filteredRegistrants = registrants.filter(r => {
    const matchesSearch = 
      r.full_name_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.full_name_bn && r.full_name_bn.includes(searchQuery)) ||
      r.mobile.includes(searchQuery) ||
      (r.alumni_number && r.alumni_number.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === 'ALL' || r.registration_status === statusFilter;
    const registrantBatch = r.ssc_batch || r.batch;
    const matchesBatch = batchFilter === 'ALL' || registrantBatch === batchFilter;
    
    return matchesSearch && matchesStatus && matchesBatch;
  })

  const allFilteredIds = filteredRegistrants.map(r => r.id)
  const isAllSelected = filteredRegistrants.length > 0 && filteredRegistrants.every(r => selectedIds.has(r.id))
  
  const toggleSelectAll = () => {
    if (isAllSelected) {
      const newSet = new Set(selectedIds)
      allFilteredIds.forEach(id => newSet.delete(id))
      setSelectedIds(newSet)
    } else {
      const newSet = new Set(selectedIds)
      allFilteredIds.forEach(id => newSet.add(id))
      setSelectedIds(newSet)
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="p-3 hover:bg-[#FAFAF7] rounded-2xl transition-all border border-transparent hover:border-gray-100">
              <ArrowLeft size={20} className="text-primary" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Applications Directory</h1>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Manage All Registrants ({registrants.length})</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto text-primary">
            {selectedIds.size > 0 && (
              <button 
                onClick={handleBulkDelete} 
                className="w-full sm:w-auto px-6 py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Delete Selected ({selectedIds.size})
              </button>
            )}
            <button 
              onClick={() => setIsImportModalOpen(true)} 
              className="w-full sm:w-auto px-6 py-3 bg-[#1F3D2B] rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-2xl whitespace-nowrap"
            >
              Import Registrants
            </button>
            <div className="relative w-full sm:w-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search name, phone, alumni ID..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#FAFAF7] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="grow bg-white border border-gray-100 px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={batchFilter}
                onChange={e => setBatchFilter(e.target.value)}
                className="grow bg-white border border-gray-100 px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
              >
                <option value="ALL">SSC Batch (All)</option>
                {batches.map(b => <option key={b} value={b}>SSC Batch {b}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="grow max-w-7xl mx-auto w-full p-8 md:p-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-125">
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left border-collapse hidden lg:table">
              <thead className="bg-[#FAFAF7] text-[10px] font-black tracking-widest text-muted uppercase">
                <tr>
                  <th className="px-6 py-5 w-12 text-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer" checked={isAllSelected} onChange={toggleSelectAll} disabled={filteredRegistrants.length === 0} />
                  </th>
                  <th className="px-8 py-5">Registrant</th>
                  <th className="px-8 py-5">Contact</th>
                  <th className="px-8 py-5">SSC Batch</th>
                  <th className="px-8 py-5">Payment</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-16 text-center text-muted">
                      <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                      <p className="text-sm font-bold tracking-widest uppercase">Fetching Records...</p>
                    </td>
                  </tr>
                ) : filteredRegistrants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-16 text-center text-muted font-bold tracking-widest uppercase">No applications found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredRegistrants.map((r) => (
                    <tr key={r.id} className={`hover:bg-[#FAFAF7]/50 transition-colors group ${selectedIds.has(r.id) ? 'bg-[#1F3D2B]/5' : ''}`}>
                      <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer" checked={selectedIds.has(r.id)} onChange={() => toggleSelect(r.id)} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 flex items-center justify-center font-black text-primary overflow-hidden">
                            {r.photo_url ? (
                               <img src={r.photo_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                r.full_name_en.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-black text-primary tracking-tight text-base">{r.full_name_en}</p>
                            <p className="text-[10px] text-muted font-bold tracking-widest uppercase">{r.alumni_number || 'No Alumni ID'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-primary tracking-tight">{r.mobile}</p>
                        <p className="text-[10px] text-muted font-bold tracking-widest truncate max-w-37.5">{r.email}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 px-3 py-1.5 rounded-lg text-xs tracking-widest font-black text-primary">
                          SSC Batch {r.batch || r.ssc_batch || 'N/A'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${r.payment_status === 'PAID' ? 'text-emerald-600' : 'text-muted'}`}>
                          {r.payment_status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest w-fit px-3 py-1.5 rounded-lg
                          ${r.registration_status === 'APPROVED' ? 'text-emerald-700 bg-emerald-50' : 
                            r.registration_status === 'REJECTED' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'}
                        `}>
                          <div className={`w-2 h-2 rounded-full ${r.registration_status === 'APPROVED' ? 'bg-emerald-500' : r.registration_status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></div>
                          {r.registration_status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/registrants/${r.id}`} className="p-2.5 bg-white border border-gray-100 hover:border-primary hover:shadow-sm rounded-xl text-primary transition-all" title="View Details">
                            <Eye size={18} />
                          </Link>
                          {r.registration_status !== 'APPROVED' && (
                            <button 
                              onClick={() => handleStatusUpdate(r.id, 'APPROVED')}
                              className="p-2.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-xl text-emerald-600 transition-all font-black"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(r.id)}
                            className="p-2.5 bg-gray-50 border border-gray-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-xl text-muted transition-all"
                            title="Delete Permanently"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-50 px-4">
              {loading ? (
                <div className="py-16 text-center text-muted">
                  <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                  <p className="text-sm font-bold tracking-widest uppercase">Fetching Records...</p>
                </div>
              ) : filteredRegistrants.length === 0 ? (
                <div className="py-16 text-center text-muted font-bold tracking-widest uppercase">No applications found.</div>
              ) : (
                filteredRegistrants.map((r) => (
                  <div key={r.id} className="py-6 flex flex-col gap-6">
                    {/* Row 1: Registrant & SSC Batch */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="grow-0 shrink-0 text-center self-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer" checked={selectedIds.has(r.id)} onChange={() => toggleSelect(r.id)} />
                        </div>
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 flex items-center justify-center font-black text-primary overflow-hidden">
                          {r.photo_url ? (
                             <img src={r.photo_url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                              r.full_name_en.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-primary tracking-tight">{r.full_name_en}</p>
                          <p className="text-[10px] text-muted font-bold tracking-widest leading-relaxed whitespace-pre-wrap">{r.alumni_number || 'No ID'} • {r.mobile}</p>
                        </div>
                      </div>
                      <span className="shrink-0 bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 px-3 py-1.5 rounded-lg text-[10px] tracking-widest font-black text-primary whitespace-nowrap">
                        SSC {r.batch || r.ssc_batch || 'N/A'}
                      </span>
                    </div>

                    {/* Row 2: Status, Payment, Action */}
                    <div className="flex justify-between items-center gap-4 bg-[#FAFAF7] p-4 rounded-2xl border border-gray-50">
                      <div className="flex flex-col gap-3">
                        <span className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest w-fit
                          ${r.registration_status === 'APPROVED' ? 'text-emerald-700' : 
                            r.registration_status === 'REJECTED' ? 'text-rose-700' : 'text-amber-700'}
                        `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${r.registration_status === 'APPROVED' ? 'bg-emerald-500' : r.registration_status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></div>
                          {r.registration_status}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${r.payment_status === 'PAID' ? 'text-emerald-600' : 'text-muted'}`}>
                          {r.payment_status || 'PENDING'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/admin/registrants/${r.id}`} className="p-2.5 bg-white border border-gray-100 rounded-xl text-primary shadow-sm" title="View Details">
                          <Eye size={18} />
                        </Link>
                        {r.registration_status !== 'APPROVED' && (
                          <button 
                            onClick={() => handleStatusUpdate(r.id, 'APPROVED')}
                            className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(r.id)}
                          className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="p-10 border-t border-gray-50 flex justify-between items-center text-muted">
            <span className="text-[10px] font-black tracking-widest uppercase">Showing {filteredRegistrants.length} records • Institutional Alumni SaaS</span>
          </div>
        </div>
      </main>

      <RegistrantImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onSuccess={() => { setIsImportModalOpen(false); loadData(); }} 
      />
    </div>
  )
}
