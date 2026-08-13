import type { ClientInput } from '@eteg/shared'
import type { UseFormReturn } from 'react-hook-form'

export interface ColorOption {
  id: string
  name: string
  hexCode: string
}

export interface UseClientFormReturn {
  form: UseFormReturn<ClientInput>
  colors: ColorOption[]
  isLoadingColors: boolean
  isSubmitting: boolean
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>
}
