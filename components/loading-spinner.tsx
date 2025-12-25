"use client"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "white"
}

export function LoadingSpinner({ size = "md", color = "primary" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const colorClasses = {
    primary: "border-amber-600 border-t-transparent",
    secondary: "border-gray-400 border-t-transparent",
    white: "border-white border-t-transparent",
  }

  return <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 rounded-full animate-spin`} />
}
