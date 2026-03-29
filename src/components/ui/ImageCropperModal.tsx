"use client"

import React, { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { X, ZoomIn, ZoomOut, Check, RotateCcw } from "lucide-react"
import getCroppedImg from "@/lib/cropImage"

interface ImageCropperModalProps {
  image: string
  aspect?: number
  onCropComplete: (croppedFile: File) => void
  onClose: () => void
}

export default function ImageCropperModal({ 
  image, 
  aspect = 1, 
  onCropComplete, 
  onClose 
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onRotationChange = (rotation: number) => {
    setRotation(rotation)
  }

  const onCropCompleteCallback = useCallback((_croppedArea: any, pixelCrop: any) => {
    setCroppedAreaPixels(pixelCrop)
  }, [])

  const handleDone = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation)
      if (croppedBlob) {
        // Convert blob to file
        const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" })
        onCropComplete(croppedFile)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAFAF7]">
          <div>
            <h2 className="text-xl font-black text-primary tracking-tight">Crop Image</h2>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Adjust position and zoom</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white hover:bg-rose-50 rounded-2xl transition-all shadow-sm text-gray-400 hover:text-rose-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative h-[400px] md:h-[500px] bg-gray-900 border-y border-gray-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
            onCropComplete={onCropCompleteCallback}
            classes={{
                containerClassName: "bg-gray-900",
                mediaClassName: "max-w-none",
                cropAreaClassName: "border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] rounded-2xl"
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-8 bg-[#FAFAF7] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Zoom Control */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted">
                <div className="flex items-center gap-2"><ZoomOut size={12} /> Zoom Out</div>
                <div className="flex items-center gap-2">Zoom In <ZoomIn size={12} /></div>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted">
                <div className="flex items-center gap-2"><RotateCcw size={12} /> Rotation</div>
                <div className="font-bold">{rotation}°</div>
              </div>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e) => onRotationChange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button 
              onClick={onClose}
              className="px-8 py-4 font-bold text-muted hover:bg-white rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleDone}
              className="px-10 py-4 bg-[#1F3D2B] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center gap-3"
            >
              <Check size={20} />
              Apply Crop
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
