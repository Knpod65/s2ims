'use client'
import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen bg-bg-000 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-status-danger/10 border border-status-danger/20 flex items-center justify-center mb-6">
        <AlertCircle size={28} className="text-status-danger" />
      </div>
      <h1 className="font-display font-bold text-xl text-ink-1 mb-2">
        เกิดข้อผิดพลาด / Something went wrong
      </h1>
      <p className="text-ink-3 text-sm mb-6 max-w-sm font-mono">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button onClick={reset} className="btn-primary px-6 py-2.5 text-sm">
        ลองอีกครั้ง / Try again
      </button>
    </div>
  )
}
