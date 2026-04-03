"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, Download, RotateCw, ZoomIn, RefreshCw, X, MousePointer2, Move, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateFramedImage } from "@/lib/frameGenerator"

// Custom SVG Icons given lucide version mismatch
const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const Facebook = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const CircleIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle">
    <circle cx="12" cy="12" r="10"/>
  </svg>
)

const FRAMES = [
  { id: 'instagram', name: 'Instagram', label: '1080 × 1350', aspect: 'portrait', icon: Instagram },
  { id: 'facebook',  name: 'Facebook',  label: '1200 × 1500',  aspect: 'portrait',  icon: Facebook  },
  { id: 'circle',    name: 'Circular',   label: '1080 × 1080', aspect: 'square', icon: CircleIcon },
]

interface FrameGeneratorProps {
  onClose: () => void;
  initialPhoto?: string | null;
}

export default function FrameGenerator({ onClose, initialPhoto }: FrameGeneratorProps) {
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0])
  const [selectedColor, setSelectedColor] = useState('#0F2169')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Transform options
  const [scale, setScale] = useState(1.1)
  const [rotation, setRotation] = useState(0)
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)

  // Dragging
  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setUserImage(reader.result as string)
      setScale(1.1); setRotation(0); setPosX(0); setPosY(0)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    let cancelled = false
    const timeout = setTimeout(() => {
      const run = async () => {
        try {
          if (!cancelled) setLoading(true)
          const result = await generateFramedImage(userImage, '', {
            scale,
            rotation,
            position: { x: posX, y: posY },
            bgColor: selectedColor,
            frameId: selectedFrame.id,
          })
          if (!cancelled) setPreviewUrl(result)
        } catch (err) {
          console.error("Frame generation failed", err)
        } finally {
          if (!cancelled) setLoading(false)
        }
      }
      run()
    }, 150)
    
    return () => { 
      cancelled = true
      clearTimeout(timeout)
    }
  }, [userImage, selectedFrame.id, selectedColor, scale, rotation, posX, posY])

  const handleDownload = () => {
    if (!previewUrl) return
    const link = document.createElement('a')
    link.download = `HCS_Alumni_${selectedFrame.name}_Frame.jpg`
    link.href = previewUrl
    link.click()
  }

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!userImage) return
    isDragging.current = true
    lastMousePos.current = { x: clientX, y: clientY }
  }

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging.current || !userImage) return
    const dx = clientX - lastMousePos.current.x
    const dy = clientY - lastMousePos.current.y
    lastMousePos.current = { x: clientX, y: clientY }
    setPosX(prev => prev + dx * 1.5)
    setPosY(prev => prev + dy * 1.5)
  }

  const handleDragEnd = () => {
    isDragging.current = false
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[3rem] w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-white/90 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-xl z-[60] backdrop-blur-md hidden md:flex"
        >
          <X size={20} />
        </button>

        <div className="md:w-[65%] bg-[#F9F9F6] p-6 md:p-16 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 min-h-[500px]">
          <button onClick={onClose} className="absolute top-6 left-6 p-3 bg-white hover:bg-rose-50 rounded-2xl transition-all shadow-sm z-10 md:hidden">
            <X size={20} />
          </button>

          <div
            className={`w-full max-w-md md:max-w-lg bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-8 border-white relative cursor-move group ${
              selectedFrame.aspect === 'video' ? 'aspect-video' :
              selectedFrame.aspect === 'portrait' ? 'aspect-[4/5]' : 'aspect-square'
            }`}
            onMouseDown={e => handleDragStart(e.clientX, e.clientY)}
            onMouseMove={e => handleDragMove(e.clientX, e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={e => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={e => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain select-none pointer-events-none" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-4 p-12 bg-gray-50">
                <ImageIcon size={40} className="opacity-10" />
                <p className="font-bold text-gray-400">Loading Preview...</p>
              </div>
            )}
            
            {userImage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-full text-white">
                  <Move size={24} />
                </div>
              </div>
            )}
          </div>

          <div className="w-full max-w-lg mt-12 grid grid-cols-2 gap-5">
            <label className="flex items-center justify-center gap-3 py-5 bg-[#F5E6CC] text-[#735B24] rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-[#fedb98] transition-all shadow-lg active:translate-y-1">
              <Upload size={20} /> Select Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              disabled={!previewUrl || loading}
              onClick={handleDownload}
              className="flex items-center justify-center gap-3 py-5 bg-[#1F3D2B] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:translate-y-1 disabled:opacity-30"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />} Download
            </button>
          </div>

          {userImage && (
            <button
              onClick={() => { setScale(1.1); setRotation(0); setPosX(0); setPosY(0) }}
              className="mt-8 text-[10px] font-bold uppercase tracking-widest text-[#CEB888] hover:text-primary transition-all flex items-center gap-2"
            >
              <RefreshCw size={12} /> Reset Position
            </button>
          )}
        </div>

        <div className="md:w-[35%] p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-primary tracking-tighter">Customize</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CEB888] mt-1">HCS Silver Jubilee</p>
          </div>

          <div className="space-y-10 flex-grow">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Theme Color</label>
              <div className="flex flex-wrap gap-4 items-center">
                {['#0F2169', '#1F3D2B', '#10b981', '#CEB888', '#000000'].map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-95 flex-shrink-0 ${selectedColor === c ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <div 
                  className={`relative w-10 h-10 rounded-full overflow-hidden transition-all hover:scale-110 flex-shrink-0 cursor-pointer ${!['#0F2169', '#1F3D2B', '#10b981', '#CEB888', '#000000'].includes(selectedColor) ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                  style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                >
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="absolute inset-0 w-20 h-20 -top-2 -left-2 cursor-pointer opacity-0"
                    title="Choose custom color"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Layout Type</label>
              <div className="grid grid-cols-1 gap-4">
                {FRAMES.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedFrame(f); setPreviewUrl(null) }}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                      selectedFrame.id === f.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedFrame.id === f.id ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                      <f.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xs uppercase">{f.name}</p>
                      <p className="text-[10px] opacity-50 font-bold">{f.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {userImage && (
              <div className="space-y-8 p-8 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Zoom</span>
                    <span>{(scale * 100).toFixed(0)}%</span>
                  </div>
                  <input type="range" min="0.5" max="3" step="0.1" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full accent-primary" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Rotation</span>
                    <span>{rotation}°</span>
                  </div>
                  <input type="range" min="-180" max="180" value={rotation} onChange={e => setRotation(parseInt(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
