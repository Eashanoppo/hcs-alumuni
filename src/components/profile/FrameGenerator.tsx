"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, Download, RotateCw, ZoomIn, RefreshCw, X, Check, MousePointer2, Move, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateFramedImage } from "@/lib/frameGenerator"

const FRAMES = [
  { id: 'jubilee', name: 'Silver Jubilee 2026', src: '/images/frames/frame1.jpg' },
  { id: 'alumni', name: 'Alumni Portal 2026', src: '/images/frames/frame2.jpg' },
]

interface FrameGeneratorProps {
  onClose: () => void;
  initialPhoto?: string | null;
}

export default function FrameGenerator({ onClose, initialPhoto }: FrameGeneratorProps) {
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0])
  const [userImage, setUserImage] = useState<string | null>(initialPhoto || null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Transform options
  const [scale, setScale] = useState(1.1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Interaction
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUserImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (userImage) {
      updatePreview()
    }
  }, [userImage, selectedFrame, scale, rotation, position])

  const updatePreview = async () => {
    if (!userImage) return
    try {
      setLoading(true)
      const result = await generateFramedImage(userImage, selectedFrame.src, {
        scale,
        rotation,
        position
      })
      setPreviewUrl(result)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!previewUrl) return
    const link = document.createElement('a')
    link.download = `HCS_Alumni_Frame_${selectedFrame.id}.jpg`
    link.href = previewUrl
    link.click()
  }

  // Dragging Logic
  const handleStart = (clientX: number, clientY: number) => {
    if (!userImage) return
    setIsDragging(true)
    setLastMousePos({ x: clientX, y: clientY })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !userImage) return
    const dx = clientX - lastMousePos.x
    const dy = clientY - lastMousePos.y
    setPosition(prev => ({ x: prev.x + dx * 2, y: prev.y + dy * 2 }))
    setLastMousePos({ x: clientX, y: clientY })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
      >
        {/* Close Button Top Right */}
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/80 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all shadow-sm z-[60] backdrop-blur-sm hidden md:flex">
          <X size={20} />
        </button>

        {/* Left: Preview & Primary Controls */}
        <div className="md:w-3/5 bg-[#F9F9F6] p-6 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 min-h-[500px]">
          <button onClick={onClose} className="absolute top-6 left-6 p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all shadow-sm z-10 md:hidden">
            <X size={20} />
          </button>
          
          {/* Main Frame Preview Wrapper */}
          <div 
            className="w-full aspect-square max-w-sm md:max-w-md bg-white rounded-[2.5rem] shadow-premium overflow-hidden border-8 border-white relative cursor-move active:scale-[0.98] transition-all group"
            onMouseDown={e => handleStart(e.clientX, e.clientY)}
            onMouseMove={e => handleMove(e.clientX, e.clientY)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setIsDragging(false)}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Framed Preview" className="w-full h-full object-contain pointer-events-none select-none" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-4 p-12 text-center bg-gray-50">
                 <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary/20">
                    <ImageIcon size={40} />
                 </div>
                 <div>
                    <p className="font-black text-primary text-xl tracking-tight">Select Photo First</p>
                    <p className="text-xs font-bold opacity-60 mt-2">Upload your image to start framing.</p>
                 </div>
              </div>
            )}
            
            {userImage && !isDragging && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-full text-white/80 animate-pulse">
                        <Move size={24} />
                    </div>
                </div>
            )}
          </div>

          {/* DRIPALLA STYLE BUTTONS BELOW CANVAS */}
          <div className="w-full max-w-md mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <label className="flex items-center justify-center gap-3 py-4 bg-[#F5E6CC] text-[#735B24] rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-[#fedb98] transition-all shadow-md group">
                <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                Select Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
             </label>
             <button 
               disabled={!previewUrl || loading}
               onClick={handleDownload}
               className="flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-30 group"
             >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />}
                Download
             </button>
          </div>
          
          {userImage && (
             <button onClick={() => { setScale(1.1); setRotation(0); setPosition({x:0,y:0}) }} className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#CEB888] hover:text-primary transition-colors">
                <RefreshCw size={14} /> Reset Position
             </button>
          )}
        </div>

        {/* Right: Settings & Details */}
        <div className="md:w-2/5 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
          <div className="mb-10">
             <h2 className="text-2xl font-black text-primary tracking-tight">Customize Frame</h2>
             <p className="text-[10px] font-black uppercase tracking-widest text-[#CEB888] mt-1">HCS Silver Jubilee</p>
          </div>

          <div className="space-y-10 flex-grow">
            {/* Design Selector */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 opacity-40">Choose Frame Design</label>
              <div className="grid grid-cols-2 gap-4">
                {FRAMES.map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setSelectedFrame(f)}
                    className={`p-2 rounded-2xl border-2 transition-all transform ${selectedFrame.id === f.id ? 'border-primary bg-primary/5 scale-105' : 'border-gray-50 opacity-60 hover:opacity-100 hover:border-gray-100'}`}
                  >
                    <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-2 relative">
                       <img src={f.src} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <p className={`text-[10px] font-black uppercase text-center px-1 truncate ${selectedFrame.id === f.id ? 'text-primary' : 'text-muted'}`}>{f.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Transform Controls */}
            <AnimatePresence>
            {userImage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-8 bg-[#FAFAF7] p-8 rounded-[2.5rem] border border-gray-50"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                      <ZoomIn size={14} className="text-[#CEB888]" />
                      Zoom / Scale
                    </div>
                  </div>
                  <input type="range" min="0.5" max="3.0" step="0.1" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full accent-primary h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                      <RotateCw size={14} className="text-[#CEB888]" />
                      Rotation ({rotation}°)
                    </div>
                  </div>
                  <input type="range" min="0" max="360" value={rotation} onChange={e => setRotation(parseInt(e.target.value))} className="w-full accent-primary h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer" />
                </div>
                
                <p className="text-[10px] font-bold text-muted text-center pt-2 italic flex items-center justify-center gap-2 border-t border-gray-100/50 mt-4 uppercase">
                   <MousePointer2 size={12} /> Drag photo on canvas to move
                </p>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
             <p className="text-[9px] font-black text-muted uppercase tracking-widest opacity-30">Processed entirely in browser</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
