'use client'

import { useOnline } from '@/hooks/use-helpers'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const isOnline = useOnline()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2">
      <Alert variant="destructive" className="max-w-md mx-auto">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You are currently offline. Some features may not be available.
        </AlertDescription>
      </Alert>
    </div>
  )
}
