import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { ClientSchema, type ClientInput } from '@eteg/shared'

import { api } from '@/lib/api'
import type { ColorOption, UseClientFormReturn } from './types.d.ts'

export function useClientForm(): UseClientFormReturn {
  const [colors, setColors] = useState<ColorOption[]>([])
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

    api.get<ColorOption[]>('/colors')
      .then((response) => {
        if (isMounted) {
          setColors(response.data)
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
      await api.post('/clients', data)
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
