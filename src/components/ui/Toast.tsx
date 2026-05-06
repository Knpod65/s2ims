'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl border shadow-lifted pointer-events-auto animate-toast-in ${
              t.type === 'success' ? 'bg-bg-200 border-status-success/30' :
              t.type === 'error'   ? 'bg-bg-200 border-status-danger/30' :
                                     'bg-bg-200 border-brand/30'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 size={16} className="text-status-success flex-shrink-0" />}
            {t.type === 'error'   && <AlertCircle  size={16} className="text-status-danger flex-shrink-0" />}
            {t.type === 'info'    && <Info         size={16} className="text-brand flex-shrink-0" />}
            <span className="text-sm text-ink-1 flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="ml-1 p-1 rounded text-ink-3 hover:text-ink-1 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
