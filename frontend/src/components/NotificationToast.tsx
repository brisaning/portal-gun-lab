import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const TOAST_EXIT_MS = 350

interface NotificationToastProps {
  message: string
  visible: boolean
  toastId: string
}

export function NotificationToast({
  message,
  visible,
  toastId,
}: NotificationToastProps) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!visible && !exiting) {
      setExiting(true)
    }
  }, [visible, exiting])

  useEffect(() => {
    if (!exiting) return
    const timer = setTimeout(() => {
      toast.dismiss(toastId)
    }, TOAST_EXIT_MS)
    return () => clearTimeout(timer)
  }, [exiting, toastId])

  return (
    <div
      className={`
        notification-toast
        overflow-hidden rounded-xl border-2 bg-dark-bg px-4 py-3
        font-display text-sm font-medium text-neon-bright
        shadow-neon
        ${exiting ? 'notification-toast-exit' : 'notification-toast-enter'}
      `}
      role="alert"
    >
      <p className="text-glow glitch-text">{message}</p>
    </div>
  )
}
