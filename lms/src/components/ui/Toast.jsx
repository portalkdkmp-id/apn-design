import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (type, message, { duration = 2500 } = {}) => {
      const id = ++idCounter
      setToasts((current) => [...current, { id, type, message }])
      if (duration) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const toast = {
    success: (message, options) => push('success', message, options),
    error: (message, options) => push('error', message, options),
    loading: (message) => push('loading', message, { duration: 0 }),
    dismiss,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className="
              pointer-events-auto flex items-center gap-2 rounded-xl border
              border-black/5 bg-white px-4 py-3 text-sm shadow-lg
              dark:border-white/10 dark:bg-[#1d1d1d] dark:text-white
            "
          >
            {item.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500" />}
            {item.type === 'error' && <XCircle size={16} className="text-red-500" />}
            {item.type === 'loading' && <Loader2 size={16} className="animate-spin text-black/40 dark:text-white/40" />}
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  }
  return context
}
