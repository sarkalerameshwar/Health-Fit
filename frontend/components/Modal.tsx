"use client"

import React, { useEffect } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}

export default function Modal({ open, onClose, children, className = "", ariaLabel }: ModalProps) {
  // Create container div on mount (so SSR won't attempt to use document before hydration)
  useEffect(() => {
    const root = document.getElementById("modal-root")
    if (!root) {
      const el = document.createElement("div")
      el.setAttribute("id", "modal-root")
      document.body.appendChild(el)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    // prevent body scrolling when modal is open
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const root = typeof document !== "undefined" ? document.getElementById("modal-root") : null
  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? "Modal dialog"}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* content */}
      <div className={`relative z-10 w-full max-w-lg ${className}`}>
        {children}
      </div>
    </div>
  )

  return root ? createPortal(modalContent, root) : null
}
