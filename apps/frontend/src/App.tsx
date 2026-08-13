import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import { ClientForm } from '@/features/client-form/index.tsx'
import { AdminDashboard } from '@/features/admin-dashboard/index.tsx'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'

function HomePage() {
  return (
    <>
      <div className="flex justify-end gap-2 p-4">
        <Button asChild variant="default" size="sm">
          <Link to="/admin">Admin</Link>
        </Button>
        <ThemeToggle />
      </div>
      <ClientForm />
    </>
  )
}

function AdminPage() {
  return (
    <>
      <div className="flex justify-between gap-2 p-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">← Voltar</Link>
        </Button>
        <ThemeToggle />
      </div>
      <AdminDashboard />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
