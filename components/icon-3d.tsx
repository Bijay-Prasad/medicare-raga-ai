'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Icon3DProps {
  children: React.ReactNode
  delay?: number
}

export function Icon3D({ children, delay = 0 }: Icon3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Floating animation
      gsap.to(containerRef.current, {
        y: -10,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay
      })

      // Rotation animation
      gsap.to(containerRef.current, {
        rotateZ: 360,
        duration: 20,
        ease: 'none',
        repeat: -1,
        delay
      })
    }, containerRef)

    return () => ctx.revert()
  }, [delay])

  return (
    <div
      ref={containerRef}
      className="perspective"
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function Icon3DGradient({ 
  gradient = 'from-primary to-accent',
  size = 'w-12 h-12'
}: {
  gradient?: string
  size?: string
}) {
  return (
    <Icon3D>
      <div className={`${size} rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}>
        <div className="w-full h-full rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm">
          {/* Placeholder for 3D icon - ready for Three.js integration */}
        </div>
      </div>
    </Icon3D>
  )
}
