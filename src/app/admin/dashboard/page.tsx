"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, Users, FileCheck, CreditCard, Search, Filter, MoreVertical, Eye, CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { adminUpdateRegistrantStatus, adminDeleteRegistrant, adminGetAllRegistrants } from "@/app/actions/admin"
import { Registrant } from "@/types"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [registrants, setRegistrants] = useState<Registrant[]>([])
  const [loading, setLoading] = useState(true)

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
    if(!confirm(`Are you sure you want to mark this application as ${status}?`)) return
    
    try {
      const result = await adminUpdateRegistrantStatus(id, status)
      if (result) {
        alert(`Application successfully ${status.toLowerCase()}!`)
        await loadData()
      } else {
        alert("Failed to update status.")
      }
    } catch (error: any) {
      console.error("Status update failed", error)
      alert(`Status update failed: ${error.message || 'Unknown error'}`)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to PERMANENTLY delete this registrant?")) return
    try {
      await adminDeleteRegistrant(id)
      alert("Registrant deleted successfully.")
      await loadData()
    } catch (error: any) {
      console.error("Delete failed", error)
      alert(`Delete failed: ${error.message || 'Unknown error'}`)
    }
  }

  const totalRegistrants = registrants.length
  const pendingRegistrants = registrants.filter(r => r.registration_status === 'PENDING').length
  const verifiedPayments = registrants.filter(r => r.payment_status === 'PAID').length

  const stats = [
    { label: "Total Registrants", value: totalRegistrants.toString(), icon: <Users />, color: "bg-blue-500" },
    { label: "Pending Approval", value: pendingRegistrants.toString(), icon: <FileCheck />, color: "bg-amber-500" },
    { label: "Payments Verified", value: verifiedPayments.toString(), icon: <CreditCard />, color: "bg-emerald-500" },
  ]

  const filteredRegistrants = registrants.filter(r => {
    if (activeTab === 'ALL') return true
    return r.registration_status === activeTab
  })

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Dashboard Overview</h1>
          <p className="text-muted text-sm font-medium">Hello Admin, welcome back to HCS Registrar.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className={`${s.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {s.icon}
            </div>
            <div>
              <p className="text-muted text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-black text-primary tracking-tighter">{s.value}</p>
                {loading && <Loader2 size={16} className="text-muted animate-spin" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h3 className="font-black text-primary text-xl tracking-tight">Recent Applications</h3>
          <div className="flex flex-wrap bg-[#FAFAF7] p-1.5 rounded-2xl border border-gray-100">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${activeTab === t ? 'bg-white text-primary shadow-sm border border-gray-100' : 'text-muted hover:text-primary'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAF7] text-[10px] font-black tracking-widest text-muted uppercase">
              <tr>
                <th className="px-8 py-5">Registrant</th>
                <th className="px-8 py-5">SSC Batch</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Payment</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-muted">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    <p className="text-sm font-bold">Loading Data...</p>
                  </td>
                </tr>
              ) : filteredRegistrants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-muted font-bold">No registrants found currently.</td>
                </tr>
              ) : (
                filteredRegistrants.slice(0, 10).map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAFAF7]/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-primary overflow-hidden">
                          {r.photo_url ? (
                             <img src={r.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                              r.full_name_en.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-black text-primary tracking-tight">{r.full_name_en}</p>
                          <p className="text-[10px] text-muted font-bold tracking-widest">{r.alumni_number || r.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 px-3 py-1.5 rounded-lg text-xs tracking-widest font-black text-primary">
                        SSC Batch {r.ssc_batch || r.batch || 'N/A'}
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
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${r.payment_status === 'PAID' ? 'text-emerald-600' : 'text-muted'}`}>
                        {r.payment_status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/registrants/${r.id}`} className="p-2.5 bg-white border border-gray-100 hover:border-primary hover:shadow-sm rounded-xl text-primary transition-all">
                          <Eye size={18} />
                        </Link>
                        {r.registration_status !== 'APPROVED' && (
                          <button 
                            onClick={() => handleStatusUpdate(r.id, 'APPROVED')}
                            className="p-2.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-xl text-emerald-600 transition-all font-black text-sm"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {r.registration_status !== 'REJECTED' && (
                          <button 
                            onClick={() => handleStatusUpdate(r.id, 'REJECTED')}
                            className="p-2.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-xl text-rose-600 transition-all font-black text-sm"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(r.id)}
                          className="p-2.5 bg-gray-50 border border-gray-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-xl text-muted transition-all"
                          title="Delete"
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
      </div>
    </div>
  )
}
