"use client"

import { useState, useEffect } from "react"
import { CreditCard, Search, CheckCircle, XCircle, Loader2, ArrowLeft, Phone, User, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"
import { adminUpdatePaymentStatus, adminDeletePayment, adminGetAllPayments } from "@/app/actions/admin"

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [batchFilter, setBatchFilter] = useState('ALL')

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await adminGetAllPayments()
      setPayments(data || [])
    } catch (error) {
      console.error("Failed to fetch payments", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleVerify = async (paymentId: string, registrantId: string, status: 'VERIFIED' | 'FAILED') => {
    if(!confirm(`Are you sure you want to mark this payment as ${status}?`)) return
    
    try {
      setLoading(true)
      await adminUpdatePaymentStatus(paymentId, status, registrantId)
      alert(`✅ Payment successfully marked as ${status}!`)
      await loadData()
    } catch (error: any) {
      console.error("Failed to update payment status", error)
      alert(`❌ Verification failed: ${error.message || 'Unknown error. Check the browser console and server logs.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this payment record?")) return
    try {
      setLoading(true)
      await adminDeletePayment(id)
      alert("✅ Payment record deleted.")
      await loadData()
    } catch (error: any) {
      console.error("Failed to delete payment", error)
      alert(`❌ Deletion failed: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Fixed SSC Batch range as per user request
  const batches = Array.from({ length: 2026 - 2009 + 1 }, (_, i) => (2009 + i).toString()).reverse()

  const filteredPayments = payments.filter(p => {
    const registrantName = p.registrants?.full_name_en || ""
    const registrantMobile = p.registrants?.mobile || ""
    const registrantBatch = p.registrants?.ssc_batch || p.registrants?.batch || ""
    
    const matchesSearch = 
      registrantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sender_number.includes(searchQuery) ||
      registrantMobile.includes(searchQuery);
      
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesBatch = batchFilter === 'ALL' || registrantBatch === batchFilter;
    
    return matchesSearch && matchesStatus && matchesBatch;
  })

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="p-3 hover:bg-[#FAFAF7] rounded-2xl transition-all border border-transparent hover:border-gray-100">
              <ArrowLeft size={20} className="text-primary" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Payment Verification</h1>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Review Transactions ({payments.length})</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-auto text-primary">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search TxID, Name, or Number..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#FAFAF7] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="flex-grow bg-white border border-gray-100 px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
              >
                <option value="ALL">All Payments</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={batchFilter}
                onChange={e => setBatchFilter(e.target.value)}
                className="flex-grow bg-white border border-gray-100 px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-[#1F3D2B]/10 outline-none"
              >
                <option value="ALL">SSC Batch (All)</option>
                {batches.map(b => <option key={b} value={b}>SSC Batch {b}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-8 md:p-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAFAF7] text-[10px] font-black tracking-widest text-muted uppercase">
                <tr>
                  <th className="px-8 py-5">Transaction Details</th>
                  <th className="px-8 py-5">Registrant</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-muted">
                      <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                      <p className="text-sm font-bold tracking-widest uppercase">Fetching Records...</p>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-muted font-bold tracking-widest uppercase">No payment records found.</td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAFAF7]/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${p.method === 'BKASH' ? 'bg-[#D12053]/10 text-[#D12053]' : 'bg-[#F37021]/10 text-[#F37021]'}`}>
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="font-black text-primary tracking-tight uppercase">{p.transaction_id || "No ID"}</p>
                            <p className="text-[10px] text-muted font-bold tracking-widest uppercase">{p.method} • {p.sender_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div>
                              <p className="font-bold text-primary tracking-tight">{p.registrants?.full_name_en}</p>
                              <p className="text-xs text-muted font-bold tracking-widest">Mobile: {p.registrants?.mobile} • SSC Batch: {p.registrants?.ssc_batch || p.registrants?.batch}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-primary tracking-tighter text-lg">৳{p.amount}</p>
                        <p className="text-[10px] text-muted font-bold tracking-widest">{new Date(p.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest w-fit px-3 py-1.5 rounded-lg border
                          ${p.status === 'VERIFIED' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                            p.status === 'FAILED' ? 'text-rose-700 bg-rose-50 border-rose-100' : 'text-amber-700 bg-amber-50 border-amber-100'}
                        `}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 lg:opacity-100 transition-opacity">
                          {p.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleVerify(p.id, p.registrant_id, 'VERIFIED')}
                                className="p-2.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-xl text-emerald-600 transition-all font-black"
                                title="Verify Payment"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleVerify(p.id, p.registrant_id, 'FAILED')}
                                className="p-2.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-xl text-rose-600 transition-all font-black"
                                title="Mark as Failed"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2.5 bg-gray-50 border border-gray-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-xl text-muted transition-all"
                            title="Delete Payment Record"
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
          <div className="p-10 border-t border-gray-50 flex justify-between items-center text-muted">
            <span className="text-[10px] font-black tracking-widest uppercase">Showing {filteredPayments.length} transactions • Payment Verification Portal</span>
          </div>
        </div>
      </main>
    </div>
  )
}
