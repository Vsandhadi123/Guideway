'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = '0'
      ref.current.style.transform = 'translateY(8px)'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.transition = 'opacity 0.35s ease, transform 0.35s ease'
            ref.current.style.opacity = '1'
            ref.current.style.transform = 'translateY(0)'
          }
        })
      })
    }
  }, [pathname])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}