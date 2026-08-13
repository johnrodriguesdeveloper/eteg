export type Theme = 'light' | 'dark' | 'system'

export interface UseThemeToggleReturn {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}
