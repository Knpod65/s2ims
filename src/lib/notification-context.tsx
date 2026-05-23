'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { mockNotifications } from '@/data/mock/notifications'
import type { Notification } from '@/lib/types'

interface NotificationContextValue {
  notifications: Notification[]
  unread: number
  markRead: (id: string) => void
  markAllRead: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const unread = notifications.filter(n => !n.is_read).length

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unread, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
