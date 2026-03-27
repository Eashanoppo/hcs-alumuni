"use client"

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

interface NotificationProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning' | 'confirm'
  onClose: () => void
  onConfirm?: () => void
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export default function Notification({
  message,
  type,
  onClose,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}: NotificationProps) {
  
  const isConfirm = type === 'confirm'

  const variants = {
    initial: { opacity: 0, y: isConfirm ? 20 : -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  }

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={24} />,
    error: <XCircle className="text-rose-500" size={24} />,
    warning: <AlertTriangle className="text-amber-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
    confirm: <AlertCircle className="text-primary" size={32} />
  }

  if (isConfirm) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-primary/5 rounded-full mb-6">
              {icons.confirm}
            </div>
            <h3 className="text-xl font-black text-primary mb-3 tracking-tight">Confirm Action</h3>
            <p className="text-muted text-sm font-medium leading-relaxed mb-8">{message}</p>
            
            <div className="flex w-full gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-4 bg-[#FAFAF7] hover:bg-gray-100 text-primary font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl hover:bg-black transition-all"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed top-8 right-8 z-100 flex flex-col items-end pointer-events-none">
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pointer-events-auto flex items-center gap-4 min-w-[320px] max-w-md bg-white p-5 rounded-3xl shadow-premium border border-gray-100 overflow-hidden"
      >
        <div className="shrink-0">
          {icons[type as keyof typeof icons] || icons.info}
        </div>
        <div className="grow">
          <p className="text-sm font-bold text-primary leading-tight">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-muted hover:text-primary hover:bg-gray-50 rounded-xl transition-all shrink-0"
        >
          <X size={18} />
        </button>
        
        {/* Progress Bar for Toasts */}
        <motion.div 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 4, ease: "linear" }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10 origin-left"
        />
      </motion.div>
    </div>
  )
}
