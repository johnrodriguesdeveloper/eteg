import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useThemeToggle } from './hook.ts'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeToggle()

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      onClick={toggleTheme}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
