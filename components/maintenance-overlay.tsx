import { Lock } from "lucide-react"
import type { ReactNode } from "react"

interface MaintenanceOverlayProps {
  children?: ReactNode
}

export function MaintenanceOverlay({ children }: MaintenanceOverlayProps) {
  return (
    <div
      role="status"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-background/75 p-5 text-center backdrop-blur-[2px]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-800">
        <Lock className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="font-semibold text-foreground">Under Maintenance</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Phone login is temporarily unavailable. Please use another sign-in option.
      </p>
      {children}
    </div>
  )
}
