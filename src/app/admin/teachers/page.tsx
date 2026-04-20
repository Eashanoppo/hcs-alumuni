"use client"

import { useState, useEffect } from "react"
import { Users, Search, Eye, CheckCircle, Loader2, ArrowLeft, Trash2 } from "lucide-react"
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
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12 relative">
      <header className="flex items-center gap-6 mb-12">
        <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm md:shadow-none hover:shadow-premium">
          <ArrowLeft size={20} className="text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Teachers Directory</h1>
          <p className="text-muted text-sm font-medium">Manage faculty records and guide status ({teachers.length})</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Bulk Actions & Filters */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-premium flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search name, phone, subject..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-sm"
              />
            </div>
            
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
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button 
                onClick={() => handleBulkUpdate('APPROVED')} 
                className="flex-1 lg:flex-none px-6 py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle size={14} /> Approve ({selectedIds.size})
              </button>
              <button 
                onClick={handleBulkDelete} 
                className="flex-1 lg:flex-none px-6 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> Delete ({selectedIds.size})
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAFAF7] text-[10px] font-black tracking-widest text-muted uppercase">
                <tr>
                  <th className="px-8 py-6 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded-lg border-gray-200 text-primary cursor-pointer accent-primary" 
                      checked={isAllSelected} 
                      onChange={toggleSelectAll} 
                      disabled={filteredTeachers.length === 0} 
                    />
                  </th>
                  <th className="px-8 py-6">Teacher Details</th>
                  <th className="px-8 py-6">Contact Info</th>
                  <th className="px-8 py-6">Professional</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right pr-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={40} />
                      <p className="text-[10px] font-black tracking-widest uppercase text-muted">Loading Directory...</p>
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center text-muted font-black text-[10px] tracking-widest uppercase">No matching records found.</td>
                  </tr>
                ) : (
                  filteredTeachers.map((t) => (
                    <tr key={t.id} className={`hover:bg-[#FAFAF7]/50 transition-all group ${selectedIds.has(t.id) ? 'bg-primary/5' : ''}`}>
                      <td className="px-8 py-8 text-center">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded-lg border-gray-200 text-primary cursor-pointer accent-primary" 
                          checked={selectedIds.has(t.id)} 
                          onChange={() => toggleSelect(t.id)} 
                        />
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary overflow-hidden shadow-sm">
                            {t.photo_url ? (
                               <img src={t.photo_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                (t.full_name_en || t.full_name_bn || '?').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-black text-primary tracking-tight text-lg leading-tight mb-1">
                              {t.full_name_en || t.full_name_bn}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-[9px] text-muted font-black tracking-widest uppercase">{t.teacher_id || 'ID-PENDING'}</p>
                              {t.is_founder_guide && (
                                <span className="bg-accent text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Founder Guide</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <p className="font-black text-primary text-base mb-1">{t.mobile}</p>
                        <p className="text-[9px] text-muted font-black tracking-widest uppercase truncate max-w-[180px]">{t.email || 'NO EMAIL'}</p>
                      </td>
                      <td className="px-8 py-8">
                        <p className="font-black text-primary mb-1 uppercase tracking-tight">{t.designation}</p>
                        <p className="text-[10px] text-muted font-bold tracking-widest uppercase">{t.subject}</p>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <span className={`inline-flex items-center gap-2 text-[9px] uppercase font-black tracking-widest px-4 py-2 rounded-xl border mx-auto
                          ${t.status === 'APPROVED' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                            t.status === 'REJECTED' ? 'text-rose-700 bg-rose-50 border-rose-100' : 'text-amber-700 bg-amber-50 border-amber-100'}
                        `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'APPROVED' ? 'bg-emerald-500' : t.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></div>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-right pr-12">
                        <div className="flex justify-end gap-3 translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all">
                          <Link href={`/admin/teachers/${t.id}`} className="p-3 bg-white border border-gray-100 hover:border-primary hover:text-primary rounded-2xl transition-all shadow-sm" title="View Details">
                            <Eye size={18} />
                          </Link>
                          {t.status !== 'APPROVED' && (
                            <button 
                              onClick={() => handleStatusUpdate(t.id, 'APPROVED')}
                              className="p-3 bg-emerald-50 border border-emerald-100 hover:bg-emerald-500 hover:text-white rounded-2xl text-emerald-600 transition-all shadow-sm"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="p-3 bg-rose-50 border border-rose-100 hover:bg-rose-500 hover:text-white rounded-2xl text-rose-600 transition-all shadow-sm"
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
          </div>
          <div className="p-10 border-t border-gray-50 bg-[#FAFAF7]/30 flex justify-between items-center text-muted">
            <span className="text-[10px] font-black tracking-widest uppercase">Institutional Directory • HCS Academic Portal</span>
          </div>
        </div>
      </main>
    </div>
  )
}
