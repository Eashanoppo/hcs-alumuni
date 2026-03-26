"use server"

import { getAdminSupabase } from "@/lib/supabase-admin"
import { cookies } from "next/headers"

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies()
    cookieStore.set("hcs_admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return { success: true }
  }

  return { success: false, error: "Invalid credentials" }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("hcs_admin_session")?.value === "authenticated"
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("hcs_admin_session")
}

export async function adminUpdateRegistrantStatus(id: string, status: 'PENDING' | 'PAID' | 'APPROVED' | 'REJECTED') {
  console.log(`[AdminAction] Updating status for ${id} to ${status}`)
  const supabase = getAdminSupabase()
  
  const { data, error } = await supabase
    .from('registrants')
    .update({ 
      registration_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()

  if (error) {
    console.error(`[AdminAction] Update failed for ${id}:`, error)
    throw new Error(error.message)
  }

  console.log(`[AdminAction] Update successful for ${id}:`, data?.[0])
  return data ? data[0] : null
}

export async function adminDeleteRegistrant(id: string) {
  const supabase = getAdminSupabase()
  
  const { error } = await supabase
    .from('registrants')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function adminGetAllRegistrants() {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('registrants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function adminGetRegistrantById(id: string) {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('registrants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function adminUpdatePaymentStatus(paymentId: string, status: 'VERIFIED' | 'FAILED', registrantId: string) {
  console.log(`[AdminAction] START: Verifying payment ${paymentId} → ${status} for registrant ${registrantId}`)
  
  const supabase = getAdminSupabase()
  
  // 1. Update Payment Status
  const { data: pData, error: pError } = await supabase
    .from('payments')
    .update({ status: status, updated_at: new Date().toISOString() })
    .eq('id', paymentId)
    .select()

  if (pError) {
    console.error(`[AdminAction] Payment update FAILED:`, pError)
    throw new Error(`Payment update failed: ${pError.message}`)
  }
  console.log(`[AdminAction] Payment updated OK:`, pData?.[0]?.status)

  // 2. If verified, update registrant's payment status to PAID
  if (status === 'VERIFIED' && registrantId) {
    const { data: rData, error: rError } = await supabase
      .from('registrants')
      .update({ payment_status: 'PAID', updated_at: new Date().toISOString() })
      .eq('id', registrantId)
      .select()

    if (rError) {
      console.error(`[AdminAction] Registrant payment_status update FAILED:`, rError)
      throw new Error(`Registrant update failed: ${rError.message}`)
    }
    console.log(`[AdminAction] Registrant payment_status updated OK:`, rData?.[0]?.payment_status)
  }

  console.log(`[AdminAction] DONE: Payment ${paymentId} is now ${status}`)
  return true
}

export async function adminGetAllPayments() {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('payments')
    .select('*, registrants(full_name_en, mobile, batch, ssc_batch)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function adminDeletePayment(id: string) {
  console.log(`[AdminAction] Deleting payment ${id}`)
  
  const supabase = getAdminSupabase()
  
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  return true
}

export async function adminCreateNotice(noticeData: any) {
  console.log(`[AdminAction] Creating notice: ${noticeData.title}`)
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('notices')
    .insert([noticeData])
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminDeleteNotice(id: string) {
  console.log(`[AdminAction] Deleting notice: ${id}`)
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

export async function adminCreateGalleryPhoto(photoData: any) {
  console.log(`[AdminAction] Creating gallery photo: ${photoData.title}`)
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('gallery')
    .insert([photoData])
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminDeleteGalleryPhoto(id: string) {
  console.log(`[AdminAction] Deleting gallery photo: ${id}`)
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
