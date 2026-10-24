const floatingElements = [
  { id: 0, x: 12, y: 18, size: 18, duration: "7s", opacity: 0.14 },
  { id: 1, x: 28, y: 72, size: 24, duration: "9s", opacity: 0.18 },
  { id: 2, x: 49, y: 38, size: 14, duration: "6s", opacity: 0.12 },
  { id: 3, x: 68, y: 84, size: 20, duration: "8s", opacity: 0.16 },
  { id: 4, x: 84, y: 24, size: 26, duration: "10s", opacity: 0.2 },
  { id: 5, x: 93, y: 58, size: 16, duration: "7s", opacity: 0.13 },
]

export function FloatingElements() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-pulse rounded-full bg-gradient-to-br from-orange-200 to-amber-200"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            opacity: element.opacity,
            animationDuration: element.duration,
          }}
        />
      ))}
    </div>
  )
}
