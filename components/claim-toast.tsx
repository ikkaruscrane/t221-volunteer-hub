"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"

interface ClaimToastProps {
  name: string
  taskTitle: string
  visible: boolean
  onClose: () => void
}

export function ClaimToast({ name, taskTitle, visible, onClose }: ClaimToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(onClose, 300)
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      setIsExiting(false)
    }
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] sm:w-auto px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg flex items-start gap-3 transition-all duration-300 ${
        isExiting ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
      }`}
      role="alert"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
      <p className="text-sm leading-relaxed">
        Thank you, <strong>{name}</strong>! You&apos;ve claimed &quot;{taskTitle}&quot;. The recipient will be in touch.
      </p>
    </div>
  )
}
