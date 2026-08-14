import type { CreateColorInput } from '@eteg/shared'
import type { UseFormReturn } from 'react-hook-form'

import type { ClientRecord } from '@/lib/clients/types'
import type { ColorRecord } from '@/lib/colors/types'

export interface UseAdminDashboardReturn {
  clients: ClientRecord[]
  colors: ColorRecord[]
  isLoadingClients: boolean
  isLoadingColors: boolean
  deletingClientId: string | null
  deletingColorId: string | null
  colorForm: UseFormReturn<CreateColorInput>
  isCreatingColor: boolean
  hexCodePreview: string
  onCreateColor: (event?: React.BaseSyntheticEvent) => Promise<void>
  onDeleteClient: (id: string) => Promise<void>
  onDeleteColor: (id: string) => Promise<void>
}
