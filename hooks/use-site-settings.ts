import { useEffect, useState } from 'react'

interface SiteSettings {
  id: string
  headerLogoUrl: string
  heroSectionImageUrl: string
  whyGodavariImageUrl: string
  updatedAt: string
}

const SETTINGS_CACHE_DURATION_MS = 30_000
let cachedSettings: SiteSettings | null = null
let cacheExpiresAt = 0
let settingsRequest: Promise<SiteSettings> | null = null
let settingsCacheVersion = 0

function fetchSiteSettings(): Promise<SiteSettings> {
  if (cachedSettings && Date.now() < cacheExpiresAt) {
    return Promise.resolve(cachedSettings)
  }

  if (!settingsRequest) {
    const requestVersion = settingsCacheVersion
    const request = fetch("/api/admin/settings", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch settings")
        }
        const data = await response.json()
        const settings = data.data.settings as SiteSettings
        if (requestVersion === settingsCacheVersion) {
          cachedSettings = settings
          cacheExpiresAt = Date.now() + SETTINGS_CACHE_DURATION_MS
        }
        return settings
      })
      .finally(() => {
        if (settingsRequest === request) {
          settingsRequest = null
        }
      })
    settingsRequest = request
  }

  return settingsRequest
}

export function clearSiteSettingsCache() {
  settingsCacheVersion += 1
  cachedSettings = null
  cacheExpiresAt = 0
  settingsRequest = null
}

export function updateSiteSettingsCache(settings: SiteSettings) {
  settingsCacheVersion += 1
  cachedSettings = settings
  cacheExpiresAt = Date.now() + SETTINGS_CACHE_DURATION_MS
  settingsRequest = null
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettings(await fetchSiteSettings())
        setError(null)
      } catch (err: unknown) {
        console.error('Error fetching settings:', err)
        setError(err instanceof Error ? err.message : "Failed to fetch settings")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}
