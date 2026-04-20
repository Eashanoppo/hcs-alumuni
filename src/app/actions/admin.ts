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

export async function adminBulkDeleteRegistrants(ids: string[]) {
  console.log(`[AdminAction] Bulk deleting ${ids.length} registrants`)
  const supabase = getAdminSupabase()
  
  const { error } = await supabase
    .from('registrants')
    .delete()
    .in('id', ids)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function adminBulkUpdateRegistrantStatus(ids: string[], status: 'PENDING' | 'PAID' | 'APPROVED' | 'REJECTED') {
  console.log(`[AdminAction] Bulk updating ${ids.length} registrants to ${status}`)
  const supabase = getAdminSupabase()
  
  const { error } = await supabase
    .from('registrants')
    .update({ 
      registration_status: status,
      updated_at: new Date().toISOString()
    })
    .in('id', ids)

  if (error) {
    console.error(`[AdminAction] Bulk update failed:`, error)
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

export async function adminGetRegistrantsWithPayments() {
  const supabase = getAdminSupabase()
  // Fetch registrants and join with verified payments to get transaction_id
  const { data, error } = await supabase
    .from('registrants')
    .select('*, payments(transaction_id, status)')
    .order('full_name_en', { ascending: true })

  if (error) throw new Error(error.message)
  
  // Map the data to flatten the verified payment transaction_id
  return data.map((reg: any) => ({
    ...reg,
    transaction_id: reg.payments?.find((p: any) => p.status === 'VERIFIED')?.transaction_id || null
  }))
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

export async function adminUpdateNotice(id: string, noticeData: any) {
  console.log(`[AdminAction] Updating notice: ${id}`)
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('notices')
    .update(noticeData)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminCreateVideo(videoData: any) {
  console.log(`[AdminAction] Creating video: ${videoData.title}`)
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('videos')
    .insert([videoData])
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminDeleteVideo(id: string) {
  console.log(`[AdminAction] Deleting video: ${id}`)
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

export async function adminUpdateAboutContent(section: string, contentData: any) {
  console.log(`[AdminAction] Updating about content for: ${section}`)
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('about_content')
    .update(contentData)
    .eq('section', section)
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminCreateMilestone(milestoneData: any) {
  console.log(`[AdminAction] Creating milestone for year: ${milestoneData.year}`)
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('milestones')
    .insert([milestoneData])
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminUpdateMilestone(id: string, milestoneData: any) {
  console.log(`[AdminAction] Updating milestone: ${id}`)
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('milestones')
    .update(milestoneData)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminDeleteMilestone(id: string) {
  console.log(`[AdminAction] Deleting milestone: ${id}`)
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

export async function adminBulkImportRegistrants(registrants: any[]) {
  console.log(`[AdminAction] Bulk importing ${registrants.length} registrants`)
  const supabase = getAdminSupabase()
  
  // Use chunking to avoid huge payload limits if many rows (e.g., 500 records)
  const chunkSize = 100;
  for (let i = 0; i < registrants.length; i += chunkSize) {
    const chunk = registrants.slice(i, i + chunkSize);
    const { error } = await supabase
      .from('registrants')
      .insert(chunk)
      
    if (error) {
      console.error("[AdminAction] Bulk import chunk error:", error)
      throw new Error(`Failed during bulk import: ${error.message}`)
    }
  }
  
  return true
}

// ============================================
// Visions & Testimonials Actions
// ============================================

export async function adminGetVisions() {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('visions')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data || []
}

export async function adminAddVision(visionData: any) {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('visions')
    .insert([visionData])
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminUpdateVision(id: string, visionData: any) {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('visions')
    .update(visionData)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminDeleteVision(id: string) {
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from('visions')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

export async function adminGetTestimonials() {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data || []
}

export async function adminAddTestimonial(testimonialData: any) {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonialData])
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminUpdateTestimonial(id: string, testimonialData: any) {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('testimonials')
    .update(testimonialData)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  return data ? data[0] : null
}

export async function adminDeleteTestimonial(id: string) {
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

// ============================================
// Site Settings Actions
// ============================================

export async function adminUpdateSiteSettings(settingsData: { id: string, value: any }[]) {
  console.log(`[AdminAction] Updating site settings`)
  const supabase = getAdminSupabase()
  
  const { data, error } = await supabase
    .from('site_settings')
    .upsert(settingsData, { onConflict: 'id' })
    .select()

  if (error) throw new Error(error.message)
  return data
}
