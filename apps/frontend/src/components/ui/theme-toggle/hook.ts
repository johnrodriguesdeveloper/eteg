import { useEffect, useState } from 'react'
import type { Theme, UseThemeToggleReturn } from './types.d.ts'

const STORAGE_KEY = 'eteg-theme'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

export function useThemeToggle(): UseThemeToggleReturn {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)
  const [systemIsDark, setSystemIsDark] = useState<boolean>(getSystemTheme() === 'dark')
  const isDark = theme === 'system' ? systemIsDark : theme === 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    if (theme !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setSystemIsDark(media.matches)

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const toggleTheme = () => {
    const next: Theme = isDark ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    setTheme(next)
  }

  return {
    theme,
    isDark,
    toggleTheme,
  }
}
