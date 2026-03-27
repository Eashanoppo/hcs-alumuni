"use server"

import { getAdminSupabase } from "@/lib/supabase-admin"

export async function submitRegistrationCheckMobile(registrantData: any) {
  const supabase = getAdminSupabase()
  
  // Check if mobile already exists
  if (registrantData.mobile) {
    const { data: existing, error: checkError } = await supabase
      .from('registrants')
      .select('id')
      .eq('mobile', registrantData.mobile)
      .limit(1)
      .maybeSingle()
      
    if (checkError) {
      console.error("[RegistrationAction] Error checking mobile:", checkError)
      return { success: false, error: "ERROR_CHECKING_MOBILE" }
    }

    if (existing) {
      return { success: false, error: "MOBILE_ALREADY_EXISTS" }
    }
  }

  const { data, error } = await supabase
    .from('registrants')
    .insert([registrantData])
    .select()

  if (error) {
    console.error("[RegistrationAction] Insert failed:", error)
    return { success: false, error: "INSERT_FAILED" }
  }
  
  return { success: true, data: data[0] }
}
