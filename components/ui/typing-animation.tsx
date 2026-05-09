"use client"

import { useEffect, useRef } from "react"

interface TypingAnimationProps {
  text?: string
  children?: React.ReactNode
  duration?: number
  delay?: number
  className?: string
}

export function TypingAnimation({
  text,
  children,
  duration = 100,
  delay = 0,
  className = "",
}: TypingAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const displayText = text || (typeof children === "string" ? children : "")

  useEffect(() => {
    const element = ref.current
    if (!element || !displayText) return

    let currentIndex = 0
    let timeoutId: NodeJS.Timeout

    const type = () => {
      if (currentIndex < displayText.length) {
        element.textContent = displayText.substring(0, currentIndex + 1)
        currentIndex++
        timeoutId = setTimeout(type, duration)
      }
    }

    timeoutId = setTimeout(type, delay)

    return () => clearTimeout(timeoutId)
  }, [displayText, duration, delay])

  return (
    <span ref={ref} className={className}>
      {displayText ? "" : children}
    </span>
  )
}
