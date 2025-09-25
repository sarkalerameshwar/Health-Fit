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

  // make sure we are running on client and can access document.body
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // ensure splash shows at least minDisplayMs
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, minDisplayMs, fadeOutMs])

  if (!mounted || !visible) return null

  const splash = (
    <div
      aria-hidden
      // fixed to the viewport; high z-index so it sits above everything
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "var(--color-primary, #0f172a)", // fallback if you use CSS variables
        color: "white",
        transition: `opacity ${fadeOutMs}ms ease`,
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* center container fixed to viewport (not affected by ancestors) */}
      <div
        role="presentation"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* big shiny SVG logo */}
        <svg
          width="260"
          height="260"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          role="img"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="shineGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.92)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <mask id="logoMask">
              <rect x="0" y="0" width="64" height="64" fill="black" />
              <path
                d="M32 58c12-8 22-20 22-34C54 10 44 6 32 14 20 6 10 10 10 24c0 14 10 26 22 34z"
                fill="white"
              />
            </mask>
          </defs>

          <path
            d="M32 58c12-8 22-20 22-34C54 10 44 6 32 14 20 6 10 10 10 24c0 14 10 26 22 34z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="transparent"
            className="splash-draw"
          />

          <path
            d="M32 58c12-8 22-20 22-34C54 10 44 6 32 14 20 6 10 10 10 24c0 14 10 26 22 34z"
            fill="currentColor"
            fillOpacity="0.06"
          />

          <g mask="url(#logoMask)">
            <rect
              className="shimmer-band"
              x="-140"
              y="-30"
              width="320"
              height="100"
              fill="url(#shineGrad)"
              transform="rotate(-18 0 0)"
            />
          </g>

          <path
            d="M22 28c6 3 14 3 20 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="splash-leafline"
          />
        </svg>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>HealthFit</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            Healthy food — delivered fresh
          </div>
        </div>
      </div>

      {/* Inline CSS in a style tag so animations are available when injected into body */}
      <style>{`
        @keyframes splash-draw {
          0% { stroke-dasharray: 0 150; stroke-opacity: 0.95; }
          60% { stroke-dasharray: 120 150; stroke-opacity: 1; }
          100% { stroke-dasharray: 150 0; stroke-opacity: 1; }
        }
        @keyframes splash-leafline {
          0% { opacity: 0; transform: translateY(6px); }
          70% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-scale {
          0% { transform: scale(0.7); opacity: 0.2; }
          60% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-120%) rotate(-18deg); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateX(0%) rotate(-18deg); opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(140%) rotate(-18deg); opacity: 0; }
        }

        .splash-draw {
          animation: splash-draw 900ms ease-in-out forwards;
          stroke-dasharray: 0 150;
        }
        .splash-leafline {
          animation: splash-leafline 700ms 300ms ease-out forwards;
        }
        .shimmer-band {
          animation: shimmer-slide 1200ms cubic-bezier(0.25, 0.8, 0.25, 1) 250ms forwards;
        }

        /* scale the whole svg when it mounts (we use transform on the SVG element itself) */
        svg[aria-hidden] {
          animation: splash-scale 1000ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  )

  // Render into document.body to avoid any parent CSS influence
  return createPortal(splash, document.body)
}
