'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Create animated orbs
      const orbs = containerRef.current?.querySelectorAll('[data-orb]') || []
      
      // Create orbs if they don't exist
      if (orbs.length === 0) {
        const container = containerRef.current
        const orbCount = 3
        
        for (let i = 0; i < orbCount; i++) {
          const orb = document.createElement('div')
          orb.setAttribute('data-orb', `${i}`)
          orb.className = `absolute rounded-full mix-blend-screen filter blur-[80px] opacity-30`
          
          const size = 250 + i * 100
          orb.style.width = `${size}px`
          orb.style.height = `${size}px`
          orb.style.pointerEvents = 'none'
          
          // Different colors for orbs
          const colors = [
            'from-primary/40 to-accent/40',
            'from-secondary/40 to-primary/40',
            'from-accent/40 to-secondary/40'
          ]
          orb.className += ` bg-gradient-to-br ${colors[i]}`
          
          container?.appendChild(orb)
        }
      }

      // Animate orbs
      const animatedOrbs = containerRef.current?.querySelectorAll('[data-orb]') || []
      animatedOrbs.forEach((orb, index) => {
        gsap.to(orb, {
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          duration: 15 + index * 5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 2
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Fixed gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(var(--primary), .05) 25%, rgba(var(--primary), .05) 26%, transparent 27%, transparent 74%, rgba(var(--primary), .05) 75%, rgba(var(--primary), .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(var(--primary), .05) 25%, rgba(var(--primary), .05) 26%, transparent 27%, transparent 74%, rgba(var(--primary), .05) 75%, rgba(var(--primary), .05) 76%, transparent 77%, transparent)`,
          backgroundSize: '60px 60px'
        }}
      ></div>
    </div>
  )
}
