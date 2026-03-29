"use client"

import { useState } from "react"
import { UploadCloud, X, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import * as xlsx from "xlsx"
import { useNotification } from "@/lib/contexts/NotificationContext"
import { adminBulkImportRegistrants } from "@/app/actions/admin"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function RegistrantImportModal({ isOpen, onClose, onSuccess }: Props) {
  const { notify } = useNotification()
  const [loading, setLoading] = useState(false)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [preview, setPreview] = useState<any[]>([])
  const [errorLogs, setErrorLogs] = useState<string[]>([])
  const [hasAttempted, setHasAttempted] = useState(false)

  if (!isOpen) return null

  // Function to determine if string contains Bengali script
  const isBangla = (str: string) => /[\u0980-\u09FF]/.test(str)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setErrorLogs([])
    setHasAttempted(true)
    
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = xlsx.read(bstr, { type: 'array', cellDates: true })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = xlsx.utils.sheet_to_json(ws, { raw: false, dateNF: 'dd/mm/yyyy' })
        
        // Transform the data based on our best guesses of columns
        const transformedData: any[] = []
        const errors: string[] = []

        data.forEach((row: any, index: number) => {
          // Flatten keys for easier searching
          const normalizedRow: any = {}
          const originalKeys = Object.keys(row)
          originalKeys.forEach(k => {
             normalizedRow[k.toLowerCase().trim()] = row[k]
          })

          const keys = Object.keys(normalizedRow)
          
          // Helper to intelligently match column names with exclusions
          const getBestMatch = (keywords: string[], excludeWords: string[] = []) => {
            // Priority 1: Exact match
            let matchedKey = keys.find(k => keywords.some(kw => k === kw))
            
            // Priority 2: Fuzzy match avoiding excluded words
            if (!matchedKey) {
              matchedKey = keys.find(k => {
                if (excludeWords.some(ew => k.includes(ew))) return false
                return keywords.some(kw => k.includes(kw))
              })
            }
            return matchedKey ? normalizedRow[matchedKey] : ""
          }

          // Extract fields using intelligent guessing
          const nameField = getBestMatch(['name', 'পূর্ণ নাম', 'নাম', 'student name', 'your name'], ['father', 'mother', 'পিতা', 'মাতা', 'guardian']) || row[originalKeys[1]] || row[originalKeys[0]] || ""
          const mobile = String(getBestMatch(['mobile', 'phone', 'contact', 'মোবাইল', 'ফোন', 'number']))
          const email = getBestMatch(['email', 'e-mail', 'ইমেইল', 'ই-মেইল']) || `${mobile.replace(/\D/g, '') || index}@placeholder.com`
          
          if (!nameField || !mobile) {
            errors.push(`Row ${index + 2}: Missing Name or Phone number. Skipped.`)
            return
          }

          let full_name_en = ""
          let full_name_bn = ""
          if (isBangla(nameField)) full_name_bn = nameField
          else full_name_en = nameField

          // Try to get others, provide fallbacks
          let rawDob = getBestMatch(['dob', 'birth', 'জন্ম'])
          let dobValue = rawDob ? String(rawDob).trim() : ""

          // Convert CSV date (mm/dd/yyyy or mm/dd/yy) → D-MonthName-YYYY  
          // This matches the format used by site-registered accounts for login
          const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"]
          
          if (dobValue && dobValue.includes('/')) {
            const parts = dobValue.split('/')
            if (parts.length === 3) {
              let [m, d, y] = parts
              // Fix 2-digit year
              if (y.length === 2) {
                const yearNum = parseInt(y)
                y = yearNum > 30 ? `19${y}` : `20${y}`
              }
              const monthName = MONTH_NAMES[parseInt(m) - 1] || m
              // Store as D-MonthName-YYYY  e.g. "15-March-1990"
              dobValue = `${parseInt(d)}-${monthName}-${y}`
            }
          }
          if (!dobValue) dobValue = "1-January-1990"

          const batchValue = String(getBestMatch(['batch', 'ssc', 'ব্যাচ', 'পাসের সাল', 'পাস']) || "")
          const yearStr = (batchValue && batchValue.length >= 4) ? batchValue.substring(0, 4) : new Date().getFullYear().toString()
          const randomDigits = Math.floor(1000 + Math.random() * 9000).toString()
          const generatedAlumniNumber = `HCS-${yearStr}-${randomDigits}`

          const record = {
            full_name_en: full_name_en || "N/A",
            full_name_bn,
            father_name: getBestMatch(['father', 'পিতা', 'বাবার']) || "N/A",
            mother_name: getBestMatch(['mother', 'মাতা', 'মায়ের']) || "N/A",
            dob: dobValue,
            present_address: getBestMatch(['present address', 'বর্তমান ঠিকানা', 'address', 'ঠিকানা'], ['permanent', 'স্থায়ী']) || "N/A",
            permanent_address: getBestMatch(['permanent', 'স্থায়ী ঠিকানা', 'স্থায়ী']) || "",
            occupation: getBestMatch(['occupation', 'profession', 'job', 'work', 'পেশা']) || "N/A",
            admission_year: String(getBestMatch(['admission year', 'ভর্তি হওয়ার', 'ভর্তির বছর', 'ভর্তি']) || "N/A"),
            admission_class: String(getBestMatch(['admission class']) || "1"),
            leaving_year: String(getBestMatch(['leaving year', 'স্কুল ছাড়ার', 'ছাড়ার বছর', 'passing year'], ['batch', 'পাসের সাল']) || "N/A"),
            leaving_class: String(getBestMatch(['leaving class', 'পর্যন্ত পড়েছেন']) || "10"),
            mobile,
            email,
            batch: batchValue,
            alumni_number: generatedAlumniNumber,
            attending: "yes", 
            volunteer_status: false,
            registration_status: "APPROVED" // Automatically approve bulk imported ones
          }

          transformedData.push(record)
        })

        setParsedData(transformedData)
        setPreview(transformedData) // Show all records for review
        setErrorLogs(errors)

      } catch (err: any) {
        notify(`Error parsing file: ${err.message}`, "error")
      } finally {
        setLoading(false)
      }
    }
    
    reader.readAsArrayBuffer(file)
  }

  const handleImport = async () => {
    if (parsedData.length === 0) return
    try {
      setLoading(true)
      await adminBulkImportRegistrants(parsedData)
      notify(`Successfully imported ${parsedData.length} registrants!`, "success")
      setParsedData([])
      setPreview([])
      onSuccess()
    } catch(err: any) {
      notify(`Import failed: ${err.message}`, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-[#FAFAF7] shrink-0">
          <div>
            <h2 className="text-2xl font-black text-primary">Import Registrants</h2>
            <p className="text-muted text-sm font-bold mt-1">Upload an Excel (.xlsx) or CSV file</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-rose-50 rounded-2xl transition-all shadow-sm text-gray-400 hover:text-rose-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          {!hasAttempted ? (
            <div className="flex flex-col items-center justify-center p-12 py-20 bg-[#FAFAF7] border-2 border-dashed border-gray-200 rounded-[2rem]">
              <UploadCloud size={48} className="text-primary/40 mb-4" />
              <h3 className="text-lg font-black text-primary">Select a file to import</h3>
              <p className="text-muted text-sm mb-6 text-center max-w-sm">
                Ensure your file has headers like Name, Phone, Email, Batch. Missing fields will be substituted with "N/A".
              </p>
              <label className="px-8 py-3 bg-[#1F3D2B] text-white rounded-xl font-bold text-sm tracking-wide cursor-pointer hover:bg-black transition-all shadow-md">
                Browse Files
                <input type="file" className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileUpload} disabled={loading} />
              </label>
              {loading && <Loader2 className="animate-spin text-primary mt-6" size={24} />}
            </div>
          ) : parsedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 py-20 bg-rose-50 border-2 border-dashed border-rose-200 rounded-[2rem]">
              <AlertCircle size={48} className="text-rose-500 mb-4" />
              <h3 className="text-lg font-black text-rose-700">No valid records found</h3>
              <p className="text-rose-600 text-sm mb-6 text-center max-w-sm font-bold">
                We couldn't parse any rows. Ensure your spreadsheet has at least a Name and Phone/Mobile header.
              </p>
              
              {errorLogs.length > 0 && (
                <div className="w-full p-4 bg-white text-rose-800 rounded-2xl border border-rose-100 max-h-40 overflow-y-auto text-sm mb-6">
                  <div className="flex items-center gap-2 mb-2 font-black tracking-widest uppercase text-xs">Parse Errors</div>
                  <ul className="list-disc pl-5 space-y-1 font-medium">
                    {errorLogs.map((log, i) => <li key={i}>{log}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setHasAttempted(false)} className="px-8 py-3 bg-white text-rose-600 rounded-xl font-bold text-sm tracking-wide hover:shadow-md transition-all">
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <CheckCircle size={24} />
                <div>
                  <h4 className="font-bold">Ready to import</h4>
                  <p className="text-sm">Found {parsedData.length} valid records.</p>
                </div>
              </div>

              {errorLogs.length > 0 && (
                <div className="p-4 bg-orange-50 text-orange-800 rounded-2xl border border-orange-100 max-h-40 overflow-y-auto text-sm">
                  <div className="flex items-center gap-2 mb-2 font-bold"><AlertCircle size={16}/> Warnings</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {errorLogs.map((log, i) => <li key={i}>{log}</li>)}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-black text-primary text-sm uppercase tracking-widest mb-4">Preview All Records ({parsedData.length})</h4>
                <div className="overflow-x-auto overflow-y-auto max-h-[40vh] rounded-xl border border-gray-100 shadow-sm relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#FAFAF7] text-xs font-black uppercase text-muted sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Name EN</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Name BN</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Phone</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Email</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">SSC Batch</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Father</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Mother</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">DOB</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Occupation</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Present Address</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Permanent Address</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Ad. Year</th>
                        <th className="px-4 py-3 bg-[#FAFAF7] sticky top-0 whitespace-nowrap">Lv. Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} className="border-t border-gray-50 bg-white hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">{row.full_name_en}</td>
                          <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">{row.full_name_bn}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.mobile}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.email}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.batch}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.father_name}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.mother_name}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.dob}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.occupation}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.present_address}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.permanent_address}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.admission_year}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{row.leaving_year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button onClick={() => {setParsedData([]); setErrorLogs([]); setHasAttempted(false);}} className="px-6 py-3 font-bold text-muted hover:bg-gray-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleImport} disabled={loading} className="px-8 py-3 bg-[#1F3D2B] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2">
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  Confirm Import
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
