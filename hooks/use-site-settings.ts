import { useEffect, useState } from 'react'

interface SiteSettings {
  id: string
  headerLogoUrl: string
  heroSectionImageUrl: string
  whyGodavariImageUrl: string
  updatedAt: string
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/settings', {
          cache: 'no-store'
        })
        if (!response.ok) throw new Error('Failed to fetch settings')
        const data = await response.json()
        setSettings(data.data.settings)
        setError(null)
      } catch (err: any) {
        console.error('Error fetching settings:', err)
        setError(err.message || 'Failed to fetch settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}
