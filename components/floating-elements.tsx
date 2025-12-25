"use client"

import { useEffect, useState } from "react"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    // Create floating elements
    const newElements: FloatingElement[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    }))

    setElements(newElements)

    // Animate elements
    const interval = setInterval(() => {
      setElements((prev) =>
        prev.map((element) => ({
          ...element,
          y: element.y <= -10 ? 110 : element.y - element.speed * 0.1,
        })),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-br from-orange-200 to-amber-200 animate-pulse"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            opacity: element.opacity,
            transform: "translate(-50%, -50%)",
            animationDuration: `${element.speed * 3}s`,
          }}
        />
      ))}
    </div>
  )
}
