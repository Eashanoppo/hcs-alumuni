"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import Notification from '@/components/ui/Notification'

type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'confirm'

interface NotificationOptions {
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType, options?: NotificationOptions) => void
  confirm: (message: string) => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{
    message: string
    type: NotificationType
    options?: NotificationOptions
    resolve?: (value: boolean) => void
  } | null>(null)

  const notify = useCallback((message: string, type: NotificationType = 'info', options?: NotificationOptions) => {
    setNotification({ message, type, options })
    if (type !== 'confirm') {
      setTimeout(() => {
        setNotification(null)
      }, 4000)
    }
  }, [])

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setNotification({
        message,
        type: 'confirm',
        resolve
      })
    })
  }, [])

  const close = useCallback(() => {
    if (notification?.resolve) {
      notification.resolve(false)
    }
    setNotification(null)
  }, [notification])

  const handleConfirm = useCallback(() => {
    if (notification?.resolve) {
      notification.resolve(true)
    }
    if (notification?.options?.onConfirm) {
      notification.options.onConfirm()
    }
    setNotification(null)
  }, [notification])

  const handleCancel = useCallback(() => {
    if (notification?.resolve) {
      notification.resolve(false)
    }
    if (notification?.options?.onCancel) {
      notification.options.onCancel()
    }
    setNotification(null)
  }, [notification])

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={close}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirmLabel={notification.options?.confirmLabel}
            cancelLabel={notification.options?.cancelLabel}
          />
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
