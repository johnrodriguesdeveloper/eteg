import type { ClientInput } from '@eteg/shared'
import type { UseFormReturn } from 'react-hook-form'

import type { ColorRecord } from '@/lib/colors/types'

export interface UseClientFormReturn {
  form: UseFormReturn<ClientInput>
  colors: ColorRecord[]
  isLoadingColors: boolean
  isSubmitting: boolean
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>
}
