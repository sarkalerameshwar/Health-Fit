// components/AnimatedText.tsx
"use client"

import React from "react"

type Props = {
  text: string
  className?: string
  delayPerLetter?: number // seconds per letter, e.g. 0.05
  duration?: number // animation duration per letter in ms
  stagger?: number // extra stagger multiplier (optional)
}

/**
 * AnimatedText
 * - Renders each character in a span and uses CSS animationDelay to stagger them.
 * - Use delayPerLetter to control speed (smaller = faster). E.g. 0.03 or 0.04.
 */
export function AnimatedText({
  text,
  className = "",
  delayPerLetter = 0.05,
  duration = 400,
  stagger = 1,
}: Props) {
  // split into characters but preserve spaces
  const chars = Array.from(text)

  // Use the text as key so when text changes, animation restarts
  return (
    <span className={`animated-text inline-block ${className}`} key={text}>
      {chars.map((ch, i) => {
        // convert seconds to ms for CSS delay
        const delayMs = i * delayPerLetter * 1000 * stagger
        const style: React.CSSProperties = {
          // each char animates with its own delay
          animationDelay: `${delayMs}ms`,
          animationDuration: `${duration}ms`,
          // keep inline-block so transforms work per char
          display: "inline-block",
        }

        // render space as a regular space but keep span so delays still apply
        return (
          <span aria-hidden style={style} className="animated-char" key={i}>
            {ch}
          </span>
        )
      })}
      <style jsx>{`
        .animated-text {
          /* prevent wrapping weirdness if you want the name on same line */
          white-space: pre-wrap;
        }

        .animated-char {
          opacity: 0;
          transform: translateY(6px) scale(0.98);
          /* animation-fill-mode: forwards so final state persists */
          animation-name: at-fade-up;
          animation-timing-function: cubic-bezier(0.15, 0.9, 0.23, 1);
          animation-fill-mode: both;
        }

        @keyframes at-fade-up {
          0% {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          60% {
            opacity: 1;
            transform: translateY(-2px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Accessibility: reduce motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animated-char {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </span>
  )
}

export default AnimatedText
