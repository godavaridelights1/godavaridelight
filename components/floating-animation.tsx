"use client"

import { useEffect, useState } from "react"

export function FloatingAnimation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <style jsx global>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(2deg);
        }
      }
      
      @keyframes float-reverse {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(20px) rotate(-2deg);
        }
      }
      
      @keyframes sparkle {
        0%, 100% {
          opacity: 0;
          transform: scale(0);
        }
        50% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes drift {
        0% {
          transform: translateX(-100px) translateY(0px);
        }
        50% {
          transform: translateX(50px) translateY(-30px);
        }
        100% {
          transform: translateX(100px) translateY(0px);
        }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-float-reverse {
        animation: float-reverse 8s ease-in-out infinite;
      }
      
      .animate-sparkle {
        animation: sparkle 2s ease-in-out infinite;
      }
      
      .animate-drift {
        animation: drift 15s linear infinite;
      }
      
      .animate-fade-in {
        animation: fadeIn 1s ease-in-out;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  )
}
