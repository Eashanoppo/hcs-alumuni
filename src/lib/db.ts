import { supabase } from './supabase'
import { Registrant, PaymentRecord } from '@/types'

export async function submitRegistration(registrantData: Partial<Registrant>) {
  const { data, error } = await supabase
    .from('registrants')
    .insert([registrantData])
    .select()

  if (error) throw error
  return data[0]
}

export async function submitPayment(paymentData: Partial<PaymentRecord>) {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()

  if (error) throw error
  return data[0]
}

export async function getRegistrantById(id: string) {
  const { data, error } = await supabase
    .from('registrants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getAllRegistrants() {
  const { data, error } = await supabase
    .from('registrants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateRegistrantStatus(id: string, status: 'PENDING' | 'PAID' | 'APPROVED' | 'REJECTED') {
  console.log(`Attempting to update registrant ${id} to status ${status}`)
  const { data, error } = await supabase
    .from('registrants')
    .update({ registration_status: status })
    .eq('id', id)
    .select()
    
  if (error) {
    console.error("Supabase update error:", error)
    throw error
  }
  console.log("Supabase update success:", data)
  return data ? data[0] : null
}

export async function getAllPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, registrants(full_name_en, mobile, batch, ssc_batch)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updatePaymentStatus(id: string, status: 'PENDING' | 'VERIFIED' | 'FAILED', registrantId?: string) {
  const { data, error } = await supabase
    .from('payments')
    .update({ status })
    .eq('id', id)
    .select()
    
  if (error) throw error

  // If verified, update the registrant's payment_status as well
  if (status === 'VERIFIED' && registrantId) {
    await supabase
      .from('registrants')
      .update({ payment_status: 'PAID' })
      .eq('id', registrantId)
  }

  return data[0]
}
export async function deleteRegistrant(id: string) {
  const { error } = await supabase
    .from('registrants')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export async function deletePayment(id: string) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export async function getRegistrantBySlug(slug: string) {
  const parts = slug.split('-')
  const batch = parts.pop()
  const namePart = parts.join('-')

  let query = supabase
    .from('registrants')
    .select('*')
    .eq('registration_status', 'APPROVED')

  // If batch is 0000, look for literal or null/empty
  if (batch === '0000') {
    query = query.or(`batch.eq.${batch},ssc_batch.eq.${batch},batch.is.null,ssc_batch.is.null,batch.eq.'',ssc_batch.eq.''`)
  } else {
    query = query.or(`batch.eq.${batch},ssc_batch.eq.${batch}`)
  }

  const { data, error } = await query

  if (error) throw error

  return data?.find(r => {
    const generatedNameSlug = r.full_name_en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return generatedNameSlug === namePart
  })
}

export async function getPaymentsForRegistrant(registrantId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('registrant_id', registrantId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updatePaymentInfo(id: string, txId: string, sender: string) {
  const { data, error } = await supabase
    .from('payments')
    .update({ transaction_id: txId, sender_number: sender })
    .eq('id', id)
    .select()

  if (error) throw error
  return data ? data[0] : null
}

export async function updateRegistrantProfile(id: string, updates: Partial<Registrant>) {
  const { data, error } = await supabase
    .from('registrants')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data ? data[0] : null
}
