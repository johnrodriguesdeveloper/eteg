import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { ClientSchema, type ClientInput } from '@eteg/shared'

import { createClient } from '@/lib/clients/requests'
import { listColors } from '@/lib/colors/requests'
import type { ColorRecord } from '@/lib/colors/types'
import type { UseClientFormReturn } from './types.d.ts'

export function useClientForm(): UseClientFormReturn {
  const [colors, setColors] = useState<ColorRecord[]>([])
  const [isLoadingColors, setIsLoadingColors] = useState(true)

  const form = useForm<ClientInput>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      email: '',
      color: '',
      notes: '',
    },
  })

  useEffect(() => {
    let isMounted = true

    listColors()
      .then((data) => {
        if (isMounted) {
          setColors(data)
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error('Não foi possível carregar as cores disponíveis.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingColors(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createClient(data)
      toast.success('Cliente cadastrado com sucesso!')
      form.reset()
    } catch (error) {
      if (isAxiosError<{ error?: string }>(error) && error.response) {
        toast.error(error.response.data.error ?? 'Não foi possível cadastrar o cliente.')
        return
      }
      toast.error('Não foi possível cadastrar o cliente.')
    }
  })

  return {
    form,
    colors,
    isLoadingColors,
    isSubmitting: form.formState.isSubmitting,
    onSubmit,
  }
}
