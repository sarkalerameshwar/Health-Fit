"use client"

import React, { useEffect, useState } from "react"

type Props = {
  texts: string[]          // array of words/phrases to type
  speed?: number           // typing speed (ms per char)
  deleteSpeed?: number     // backspacing speed (ms per char)
  pause?: number           // pause after typing a word (ms)
  className?: string
}

export function TypingText({
  texts,
  speed = 120,
  deleteSpeed = 60,
  pause = 1200,
  className = "",
}: Props) {
  const [displayed, setDisplayed] = useState("")
  const [index, setIndex] = useState(0) // which word
  const [subIndex, setSubIndex] = useState(0) // which char in word
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const currentWord = texts[index % texts.length]

    // logic for typing / deleting
    let timeout: NodeJS.Timeout
    if (!deleting && subIndex <= currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.substring(0, subIndex))
        setSubIndex(subIndex + 1)
      }, speed)
    } else if (deleting && subIndex >= 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.substring(0, subIndex))
        setSubIndex(subIndex - 1)
      }, deleteSpeed)
    } else if (subIndex > currentWord.length) {
      // word finished → wait then start deleting
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (subIndex < 0) {
      // finished deleting → move to next word
      setDeleting(false)
      setIndex((i) => (i + 1) % texts.length)
      setSubIndex(0)
    }

    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, texts, speed, deleteSpeed, pause])

  return (
    <span className={`typing-text ${className}`}>
      {displayed}
      <span className="caret">|</span>

      <style jsx>{`
        .caret {
          display: inline-block;
          margin-left: 2px;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}
