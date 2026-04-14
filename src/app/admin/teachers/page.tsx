"use client"

import { useState, useEffect } from "react"
import { Users, Search, Eye, CheckCircle, XCircle, Loader2, ArrowLeft, Trash2, Phone, Mail, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"
import { adminGetAllTeachers, adminUpdateTeacherStatus, adminDeleteTeacher, adminBulkDeleteTeachers, adminBulkUpdateTeacherStatus } from "@/app/actions/teacher-admin"
import { useNotification } from "@/lib/contexts/NotificationContext"

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { notify, confirm } = useNotification()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await adminGetAllTeachers()
      setTeachers(data || [])
    } catch (error) {
      console.error("Failed to fetch teachers", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const isConfirmed = await confirm(`Are you sure you want to mark this teacher as ${status}?`)
    if (!isConfirmed) return
    
    try {
      setLoading(true)
      const result = await adminUpdateTeacherStatus(id, status)
      if (result.success) {
        notify(`Teacher successfully ${status.toLowerCase()}!`, 'success')
        await loadData()
      } else {
        notify(`Failed to update status: ${result.error || 'Unknown error'}`, 'error')
      }
    } catch (error: any) {
      console.error("Status update failed", error)
      notify(`Status update failed: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Are you sure you want to PERMANENTLY delete this teacher? This action cannot be undone.")
    if (!isConfirmed) return
    
    try {
      setLoading(true)
      await adminDeleteTeacher(id)
      notify("Teacher deleted successfully.", 'success')
      await loadData()
    } catch (error: any) {
      console.error("Delete failed", error)
      notify(`Deletion failed: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    const isConfirmed = await confirm(`Are you sure you want to PERMANENTLY delete ${selectedIds.size} teachers?`)
    if (!isConfirmed) return
    
    try {
      setLoading(true)
      await adminBulkDeleteTeachers(Array.from(selectedIds))
      notify(`Successfully deleted ${selectedIds.size} teachers.`, 'success')
      setSelectedIds(new Set())
      await loadData()
    } catch (error: any) {
      notify(`Bulk deletion failed: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkUpdate = async (status: 'APPROVED' | 'REJECTED') => {
    if (selectedIds.size === 0) return
    const isConfirmed = await confirm(`Are you sure you want to mark ${selectedIds.size} teachers as ${status}?`)
    if (!isConfirmed) return
    
    try {
      setLoading(true)
      const result = await adminBulkUpdateTeacherStatus(Array.from(selectedIds), status)
      if (result.success) {
        notify(`Successfully updated ${selectedIds.size} teachers to ${status.toLowerCase()}.`, 'success')
        setSelectedIds(new Set())
        await loadData()
      } else {
        notify(`Bulk update failed: ${result.error || 'Unknown error'}`, 'error')
      }
    } catch (error: any) {
      notify(`Bulk update failed: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(t => {
    if (!t) return false;
    const displayName = (t.full_name_en || t.full_name_bn || t.full_name || '').toLowerCase();
    const safeSearchQuery = (searchQuery || '').toLowerCase();
    
    const matchesSearch = 
      displayName.includes(safeSearchQuery) || 
      (t.mobile || '').includes(searchQuery || '') ||
      (t.subject || '').toLowerCase().includes(safeSearchQuery);
      
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  })

  const allFilteredIds = filteredTeachers.map(r => r.id)
  const isAllSelected = filteredTeachers.length > 0 && filteredTeachers.every(r => selectedIds.has(r.id))
  
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
              <h1 className="text-2xl font-black text-primary tracking-tight">Teachers Directory</h1>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Manage All Teachers ({teachers.length})</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto text-primary">
            {selectedIds.size > 0 && (
              <>
                <button 
                  onClick={() => handleBulkUpdate('APPROVED')} 
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Approve ({selectedIds.size})
                </button>
                <button 
                  onClick={handleBulkDelete} 
                  className="w-full sm:w-auto px-6 py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete ({selectedIds.size})
                </button>
              </>
            )}
            
            <div className="relative w-full sm:w-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search name, phone, subject..." 
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
          </div>
        </div>
      </header>

      <main className="grow max-w-7xl mx-auto w-full p-8 md:p-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-125">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse hidden lg:table">
              <thead className="bg-[#FAFAF7] text-[10px] font-black tracking-widest text-muted uppercase">
                <tr>
                  <th className="px-6 py-5 w-12 text-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer" checked={isAllSelected} onChange={toggleSelectAll} disabled={filteredTeachers.length === 0} />
                  </th>
                  <th className="px-8 py-5">Teacher</th>
                  <th className="px-8 py-5">Contact</th>
                  <th className="px-8 py-5">Designation & Subject</th>
                  <th className="px-8 py-5">Tenure</th>
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
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-16 text-center text-muted font-bold tracking-widest uppercase">No teachers found matching criteria.</td>
                  </tr>
                ) : (
                  filteredTeachers.map((t) => (
                    <tr key={t.id} className={`hover:bg-[#FAFAF7]/50 transition-colors group ${selectedIds.has(t.id) ? 'bg-[#1F3D2B]/5' : ''}`}>
                      <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer" checked={selectedIds.has(t.id)} onChange={() => toggleSelect(t.id)} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 flex items-center justify-center font-black text-primary overflow-hidden">
                            {t.photo_url ? (
                               <img src={t.photo_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                (t.full_name_en || t.full_name_bn || '?').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-black text-primary tracking-tight text-base flex items-center gap-2">
                              {t.full_name_en || t.full_name_bn}
                              {t.is_founder_guide && <span className="bg-[#CEB888] text-white text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest">Founder</span>}
                            </p>
                            <p className="text-[10px] text-muted font-bold tracking-widest uppercase">{t.teacher_id || 'No ID'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-primary tracking-tight">{t.mobile}</p>
                        <p className="text-[10px] text-muted font-bold tracking-widest truncate max-w-[150px]">{t.email || 'N/A'}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-primary">{t.designation}</p>
                        <p className="text-xs text-muted font-medium">{t.subject}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-primary">{t.joining_date}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest w-fit px-3 py-1.5 rounded-lg
                          ${t.status === 'APPROVED' ? 'text-emerald-700 bg-emerald-50' : 
                            t.status === 'REJECTED' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'}
                        `}>
                          <div className={`w-2 h-2 rounded-full ${t.status === 'APPROVED' ? 'bg-emerald-500' : t.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></div>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/teachers/${t.id}`} className="p-2.5 bg-white border border-gray-100 hover:border-primary hover:shadow-sm rounded-xl text-primary transition-all" title="View Details">
                            <Eye size={18} />
                          </Link>
                          {t.status !== 'APPROVED' && (
                            <button 
                              onClick={() => handleStatusUpdate(t.id, 'APPROVED')}
                              className="p-2.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-xl text-emerald-600 transition-all font-black"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(t.id)}
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
            
            {/* Mobile View */}
            <div className="lg:hidden divide-y divide-gray-50">
              {loading ? (
                <div className="px-8 py-16 text-center text-muted">
                  <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                  <p className="text-xs font-bold tracking-widest uppercase">Loading...</p>
                </div>
              ) : filteredTeachers.length === 0 ? (
                <div className="px-8 py-16 text-center text-muted font-bold text-xs tracking-widest uppercase">No teachers found.</div>
              ) : (
                filteredTeachers.map((t) => (
                  <div key={t.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-primary overflow-hidden">
                          {t.photo_url ? (
                            <img src={t.photo_url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            (t.full_name_en || t.full_name_bn || '?').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-black text-primary tracking-tight">{t.full_name_en || t.full_name_bn}</p>
                          <p className="text-[10px] text-muted font-bold tracking-widest uppercase">{t.status}</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-primary" 
                        checked={selectedIds.has(t.id)} 
                        onChange={() => toggleSelect(t.id)} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                      <div className="space-y-1">
                        <p className="text-muted font-black uppercase tracking-widest">Designation</p>
                        <p className="font-bold text-primary">{t.designation}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted font-black uppercase tracking-widest">Subject</p>
                        <p className="font-bold text-primary">{t.subject}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted font-black uppercase tracking-widest">Mobile</p>
                        <p className="font-bold text-primary">{t.mobile}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted font-black uppercase tracking-widest">Joined</p>
                        <p className="font-bold text-primary">{t.joining_date}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/admin/teachers/${t.id}`} className="flex-1 py-3 bg-white border border-gray-100 rounded-xl text-primary font-black text-[10px] uppercase tracking-widest text-center">
                        View
                      </Link>
                      {t.status !== 'APPROVED' && (
                        <button 
                          onClick={() => handleStatusUpdate(t.id, 'APPROVED')}
                          className="flex-1 py-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-black text-[10px] uppercase tracking-widest"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
