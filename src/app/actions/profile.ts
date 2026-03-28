"use server"

import { getAdminSupabase } from "@/lib/supabase-admin"
import { cookies } from "next/headers"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function extractPublicId(url: string) {
  // Typical secure_url: "https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<filename>.<ext>"
  try {
    const parts = url.split('/upload/')
    if (parts.length < 2) return null
    
    let path = parts[1]
    // Remove version if present (starts with 'v' followed by numbers)
    if (path.match(/^v\d+\//)) {
      path = path.replace(/^v\d+\//, '')
    }
    
    // Remove extension
    const lastDotIndex = path.lastIndexOf('.')
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex)
    }
    
    return path
  } catch(e) {
    return null
  }
}

export async function deleteCloudinaryImage(url: string) {
  try {
    const publicId = extractPublicId(url)
    if (!publicId) return false
    
    const result = await cloudinary.uploader.destroy(publicId)
    console.log(`Cloudinary deletion for ${publicId}:`, result.result)
    return result.result === 'ok'
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error)
    return false
  }
}

export async function updateAlumniProfile(alumniNumber: string, data: any, oldPhotoUrl?: string) {
  const supabase = getAdminSupabase()
  
  // Verify the session
  const cookieStore = await cookies()
  const session = cookieStore.get('alumni_session')
  
  if (session?.value !== alumniNumber) {
    throw new Error("Unauthorized request")
  }
  
  // Restrict sensitive fields from being updated just in case
  delete data.dob
  delete data.mobile
  delete data.alumni_number
  delete data.id
  delete data.registration_status
  delete data.payment_status

  // If there's a new photo and an old photo, delete the old one
  if (data.photo_url && oldPhotoUrl && data.photo_url !== oldPhotoUrl) {
    await deleteCloudinaryImage(oldPhotoUrl)
  }

  const { data: updated, error } = await supabase
    .from('registrants')
    .update(data)
    .eq('alumni_number', alumniNumber)
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return updated
}
