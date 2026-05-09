"use client"

import { useEffect, useRef } from "react"

interface NumberTickerProps {
  value: number
  direction?: "up" | "down"
  delay?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let startValue = direction === "up" ? 0 : value
    let endValue = direction === "up" ? value : 0

    const startTime = Date.now() + delay
    let animationFrameId: number

    const updateValue = () => {
      const now = Date.now()
      const elapsed = now - startTime

      if (elapsed < 0) {
        animationFrameId = requestAnimationFrame(updateValue)
        return
      }

      if (elapsed >= duration) {
        element.textContent = `${prefix}${endValue.toFixed(decimals)}${suffix}`
        return
      }

      const progress = elapsed / duration
      const easeOutQuad = 1 - (1 - progress) * (1 - progress)
      const currentValue =
        direction === "up"
          ? startValue + (endValue - startValue) * easeOutQuad
          : startValue - (startValue - endValue) * easeOutQuad

      element.textContent = `${prefix}${currentValue.toFixed(decimals)}${suffix}`
      animationFrameId = requestAnimationFrame(updateValue)
    }

    animationFrameId = requestAnimationFrame(updateValue)

    return () => cancelAnimationFrame(animationFrameId)
  }, [value, direction, delay, duration, decimals, prefix, suffix])

  return <span ref={ref}>0</span>
}
