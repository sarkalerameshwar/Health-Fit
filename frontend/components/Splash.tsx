"use client"

import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"

type Props = {
  minDisplayMs?: number
  fadeOutMs?: number
}

export default function Splash({ minDisplayMs = 900, fadeOutMs = 400 }: Props) {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure we can access document.body
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const minTimer = window.setTimeout(() => {
      setFading(true)
      window.setTimeout(() => setVisible(false), fadeOutMs)
    }, minDisplayMs)

    const onLoad = () => {
      clearTimeout(minTimer)
      setFading(true)
      window.setTimeout(() => setVisible(false), fadeOutMs)
    }

    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad, { once: true })

    return () => {
      clearTimeout(minTimer)
      window.removeEventListener("load", onLoad as any)
    }
  }, [mounted, minDisplayMs, fadeOutMs])

  if (!mounted || !visible) return null

  const splash = (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "var(--color-primary, #0f172a)",
        color: "white",
        transition: `opacity ${fadeOutMs}ms ease`,
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* PNG logo */}
        <img
          src="/logo.png"
          alt="HealthFit Logo"
          width={260}
          height={260}
          style={{ display: "block", animation: "splash-scale 1000ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards" }}
        />

        {/* App Name & Tagline */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 12 }}>
            HealthFit
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            Healthy food — delivered fresh
          </div>
        </div>
      </div>

      {/* Inline CSS for animations */}
      <style>{`
        @keyframes splash-scale {
          0% { transform: scale(0.7); opacity: 0.2; }
          60% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )

  return createPortal(splash, document.body)
}
