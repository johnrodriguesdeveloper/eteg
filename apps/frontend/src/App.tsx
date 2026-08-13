import { ClientForm } from '@/features/client-form/index.tsx'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <>
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <ClientForm />
      <Toaster />
    </>
  )
}

export default App
