"use client"

import { useState, useEffect } from "react"
import { CreditCard, Search, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { adminUpdatePaymentStatus, adminDeletePayment, adminGetAllPayments } from "@/app/actions/admin"
import { useNotification } from "@/lib/contexts/NotificationContext"

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [batchFilter, setBatchFilter] = useState('ALL')
  const [methodFilter, setMethodFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const { notify, confirm } = useNotification()

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
    const isConfirmed = await confirm(`Are you sure you want to mark this payment as ${status}?`)
    if (!isConfirmed) return
    
    try {
      setLoading(true)
      await adminUpdatePaymentStatus(paymentId, status, registrantId)
      notify(`Payment successfully marked as ${status}!`, 'success')
      await loadData()
    } catch (error: any) {
      console.error("Failed to update payment status", error)
      notify(`Verification failed: ${error.message || 'Unknown error.'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const batches = Array.from({ length: 2026 - 2009 + 1 }, (_, i) => (2009 + i).toString()).reverse()

  const filteredPayments = payments.filter(p => {
    const registrantName = p.registrants?.full_name_en || ""
    const registrantMobile = p.registrants?.mobile || ""
    const registrantBatch = p.registrants?.ssc_batch || p.registrants?.batch || ""
    
    const matchesSearch = 
      registrantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.transaction_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sender_number || "").includes(searchQuery) ||
      registrantMobile.includes(searchQuery);
      
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesBatch = batchFilter === 'ALL' || registrantBatch === batchFilter;
    const matchesMethod = methodFilter === 'ALL' || p.method === methodFilter;
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesBatch && matchesMethod && matchesType;
  })

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12 relative">
      <header className="flex items-center gap-6 mb-12">
        <Link href="/admin/dashboard" className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm md:shadow-none hover:shadow-premium">
          <ArrowLeft size={20} className="text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Payment Verification</h1>
          <p className="text-muted text-sm font-medium">Review and verify transactions ({payments.length})</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Action & Filter Card */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-premium flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full lg:w-96">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search TxID, Name, or Number..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#FAFAF7] border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
               <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#FAFAF7] border-0 px-5 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary/10 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="FAILED">Failed</option>
              </select>
              <select 
                value={methodFilter}
                onChange={e => setMethodFilter(e.target.value)}
                className="bg-[#FAFAF7] border-0 px-5 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary/10 outline-none"
              >
                <option value="ALL">All Methods</option>
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="CASH">Cash/Office</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select 
              value={batchFilter}
              onChange={e => setBatchFilter(e.target.value)}
              className="bg-[#FAFAF7] border-0 px-5 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary/10 outline-none"
            >
              <option value="ALL">SSC Batch (All)</option>
              {batches.map(b => <option key={b} value={b}>SSC Batch {b}</option>)}
            </select>
            <select 
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-[#FAFAF7] border-0 px-5 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary/10 outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAFAF7] text-[10px] font-black tracking-widest text-muted uppercase">
                <tr>
                   <th className="px-8 py-6">Transaction</th>
                   <th className="px-8 py-6">Registrant</th>
                   <th className="px-8 py-6">Details</th>
                   <th className="px-8 py-6">Status</th>
                   <th className="px-8 py-6 text-right pr-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={40} />
                      <p className="text-[10px] font-black tracking-widest uppercase text-muted">Syncing Payments...</p>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center text-muted font-black text-[10px] tracking-widest uppercase">No payment records found.</td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAFAF7]/50 transition-all group">
                       <td className="px-8 py-8">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all shadow-sm ${p.method === 'BKASH' ? 'bg-[#D12053]/10 text-[#D12053]' : p.method === 'CASH' ? 'bg-primary/10 text-primary' : 'bg-[#F37021]/10 text-[#F37021]'}`}>
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="font-black text-primary tracking-tight uppercase truncate max-w-[150px] text-lg leading-tight mb-1">{p.transaction_id || "OFFLINE-REC"}</p>
                            <p className="text-[9px] text-muted font-black tracking-widest uppercase">{p.method} • {p.sender_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <p className="font-black text-primary tracking-tight text-base mb-1">{p.registrants?.full_name_en}</p>
                        <p className="text-[9px] text-muted font-black tracking-widest uppercase">Batch {p.registrants?.ssc_batch || p.registrants?.batch}</p>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-2">
                          <p className="font-black text-primary text-base tracking-tighter">৳{p.amount}</p>
                          <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit border ${p.type === 'OFFLINE' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                            {p.type || 'ONLINE'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`flex items-center gap-2 text-[9px] uppercase font-black tracking-widest w-fit px-4 py-2 rounded-xl border
                          ${p.status === 'VERIFIED' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                            p.status === 'FAILED' ? 'text-rose-700 bg-rose-50 border-rose-100' : 'text-amber-700 bg-amber-50 border-amber-100'}
                        `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'VERIFIED' ? 'bg-emerald-500' : p.status === 'FAILED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></div>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-right pr-12">
                        <div className="flex justify-end gap-3">
                          {p.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleVerify(p.id, p.registrant_id, 'VERIFIED')}
                                className="p-3 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-2xl text-emerald-600 transition-all shadow-sm"
                                title="Verify Payment"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleVerify(p.id, p.registrant_id, 'FAILED')}
                                className="p-3 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-2xl text-rose-600 transition-all shadow-sm"
                                title="Mark as Failed"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-10 border-t border-gray-50 bg-[#FAFAF7]/30 flex justify-between items-center text-muted">
            <span className="text-[10px] font-black tracking-widest uppercase">Showing {filteredPayments.length} transactions • HCS Payment Control</span>
          </div>
        </div>
      </main>
    </div>
  )
}
