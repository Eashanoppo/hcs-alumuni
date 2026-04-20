"use client"

import { Registrant } from "@/types"

interface RegistrantWithPayment extends Registrant {
  transaction_id?: string | null
}

interface RegistrantPrintReportProps {
  registrants: RegistrantWithPayment[]
  reportType: 'PAID' | 'UNPAID'
}

export default function RegistrantPrintReport({ registrants, reportType }: RegistrantPrintReportProps) {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const calculateAttendance = (reg: Registrant) => {
    let count = 1 // Self
    if (reg.spouse_attending) count += 1
    count += (Number(reg.children_count) || 0)
    return count
  }

  return (
    <div className="print-report hidden">
      <div className="p-8 bg-white text-black min-h-screen">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center border-b-2 border-black pb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Holy Crescent School</h1>
          <h2 className="text-xl font-bold mb-4 tracking-widest uppercase">Alumni Reunion 2025 - Registrants Report</h2>
          <div className="flex justify-between w-full mt-4 text-sm font-bold uppercase tracking-wider">
            <span>Report: <span className="bg-black text-white px-3 py-1 rounded">{reportType}</span></span>
            <span>Date: {today}</span>
            <span>Total: {registrants.length}</span>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-black uppercase">#</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-black uppercase">Name</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-black uppercase">Father's Name</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-black uppercase">Mobile</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-black uppercase">Attending</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-black uppercase">T-Shirt</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-black uppercase">
                {reportType === 'PAID' ? 'Transaction ID' : 'Status'}
              </th>
            </tr>
          </thead>
          <tbody>
            {registrants.map((reg, index) => (
              <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-300 px-3 py-2 text-xs">{index + 1}</td>
                <td className="border border-gray-300 px-3 py-2 text-xs font-bold">{reg.full_name_en}</td>
                <td className="border border-gray-300 px-3 py-2 text-xs">{reg.father_name}</td>
                <td className="border border-gray-300 px-3 py-2 text-xs">{reg.mobile}</td>
                <td className="border border-gray-300 px-3 py-2 text-xs text-center font-bold">
                  {calculateAttendance(reg)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-xs text-center">{reg.tshirt_size}</td>
                <td className="border border-gray-300 px-3 py-2 text-xs font-mono">
                  {reportType === 'PAID' 
                    ? (reg.transaction_id || 'N/A') 
                    : (reg.payment_status === 'VERIFYING' ? 'VERIFYING' : 'UNPAID')
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-[10px] text-gray-400 flex justify-between items-center italic">
          <span>Holy Crescent School Alumni Portal • System Generated Report</span>
          <span className="print-page-number"></span>
        </div>
      </div>
    </div>
  )
}
