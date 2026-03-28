import imageCompression from 'browser-image-compression';

/**
 * Uploads a file to Cloudinary.
 * Uses 'raw' resource type for non-image files (PDF, DOC, etc.) and 'image' for images.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'hcs_alumni_preset'

  if (!cloudName) {
    throw new Error("Cloudinary Cloud Name is missing in environment variables.")
  }

  const isImage = file.type.startsWith("image/")
  const resourceType = isImage ? "image" : "raw"

  let fileToUpload = file;
  if (isImage) {
    try {
      // Compress the image before uploading to drastically reduce upload time
      const options = {
        maxSizeMB: 0.5, // Super fast uploads
        maxWidthOrHeight: 1200, // Enough for profile and web
        useWebWorker: true,
      }
      fileToUpload = await imageCompression(file, options);
    } catch (error) {
      console.warn("Image compression failed, falling back to original file.", error);
    }
  }

  const formData = new FormData()
  formData.append('file', fileToUpload)
  formData.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: 'POST', body: formData }
    )
    const data = await response.json()
    if (data.error) {
      console.error('Cloudinary API Error:', data.error)
      throw new Error(`Cloudinary Error: ${data.error.message}. Please ensure the upload preset "${uploadPreset}" is created as an UNSIGNED preset in your Cloudinary dashboard.`)
    }
    return data.secure_url
  } catch (error: any) {
    console.error('Cloudinary upload failure:', error)
    throw error
  }
}
