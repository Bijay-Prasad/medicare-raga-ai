"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

type Variant = "circle" | "square" | "triangle" | "diamond" | "rectangle" | "hexagon" | "star"

interface AnimatedThemeTogglerProps {
  variant?: Variant
  duration?: number
  fromCenter?: boolean
}

const getClipPath = (variant: Variant, fromCenter: boolean = false): string => {
  const baseClipPaths: Record<Variant, string> = {
    circle: "circle(0%)",
    square: "inset(0%)",
    triangle: "polygon(50% 0%, 100% 100%, 0% 100%)",
    diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    rectangle: "inset(0% 100% 0% 0%)",
    hexagon: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  }

  if (fromCenter) {
    return baseClipPaths[variant]
  }

  // Default top-left origin
  const clipPaths: Record<Variant, string> = {
    circle: "circle(50%)",
    square: "inset(0%)",
    triangle: "polygon(0% 0%, 100% 0%, 0% 100%)",
    diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    rectangle: "inset(0%)",
    hexagon: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  }

  return clipPaths[variant]
}

export function AnimatedThemeToggler({
  variant = "circle",
  duration = 500,
  fromCenter = false,
}: AnimatedThemeTogglerProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  const handleToggle = () => {
    document.startViewTransition?.(() => {
      setTheme(isDark ? "light" : "dark")
    })
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="relative inline-flex items-center justify-center rounded-lg bg-primary/10 p-2 transition-colors hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-lg"
        style={{
          clipPath: fromCenter ? `circle(0% at 50% 50%)` : `circle(0%)`,
        }}
      >
        <div className={`absolute inset-0 ${isDark ? "bg-background" : "bg-background"}`} />
      </motion.div>

      <motion.div
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0.8 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-primary" />
        ) : (
          <Sun className="h-5 w-5 text-primary" />
        )}
      </motion.div>
    </motion.button>
  )
}
