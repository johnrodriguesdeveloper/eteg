import type { CreateColorInput } from '@eteg/shared'
import type { UseFormReturn } from 'react-hook-form'

export interface ClientRecord {
  id: string
  fullName: string
  cpf: string
  email: string
  color: string
  notes: string | null
  createdAt: string
}

export interface ColorRecord {
  id: string
  name: string
  hexCode: string
}

export interface UseAdminDashboardReturn {
  clients: ClientRecord[]
  colors: ColorRecord[]
  isLoadingClients: boolean
  isLoadingColors: boolean
  deletingClientId: string | null
  deletingColorId: string | null
  colorForm: UseFormReturn<CreateColorInput>
  isCreatingColor: boolean
  onCreateColor: (event?: React.BaseSyntheticEvent) => Promise<void>
  onDeleteClient: (id: string) => Promise<void>
  onDeleteColor: (id: string) => Promise<void>
}
