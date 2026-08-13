import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { CreateColorSchema, type CreateColorInput } from '@eteg/shared'

import { deleteClient as deleteClientRequest, listClients } from '@/lib/clients/requests'
import type { ClientRecord } from '@/lib/clients/types'
import {
  createColor as createColorRequest,
  deleteColor as deleteColorRequest,
  listColors,
} from '@/lib/colors/requests'
import type { ColorRecord } from '@/lib/colors/types'
import type { UseAdminDashboardReturn } from './types.d.ts'

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ error?: string }>(error) && error.response) {
    return error.response.data.error ?? fallback
  }
  return fallback
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [colors, setColors] = useState<ColorRecord[]>([])
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [isLoadingColors, setIsLoadingColors] = useState(true)
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)
  const [deletingColorId, setDeletingColorId] = useState<string | null>(null)

  const colorForm = useForm<CreateColorInput>({
    resolver: zodResolver(CreateColorSchema),
    defaultValues: {
      name: '',
      hexCode: '#000000',
    },
  })

  useEffect(() => {
    let isMounted = true

    listClients()
      .then((data) => {
        if (isMounted) {
          setClients(data)
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error('Não foi possível carregar os clientes.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingClients(false)
        }
      })

    listColors()
      .then((data) => {
        if (isMounted) {
          setColors(data)
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error('Não foi possível carregar as cores.')
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

  const onCreateColor = colorForm.handleSubmit(async (data) => {
    try {
      await createColorRequest(data)
      toast.success('Cor cadastrada com sucesso!')
      colorForm.reset()
      setColors(await listColors())
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Não foi possível cadastrar a cor.'))
    }
  })

  const onDeleteClient = async (id: string) => {
    setDeletingClientId(id)
    try {
      await deleteClientRequest(id)
      setClients((current) => current.filter((client) => client.id !== id))
      toast.success('Cliente removido com sucesso!')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Não foi possível remover o cliente.'))
    } finally {
      setDeletingClientId(null)
    }
  }

  const onDeleteColor = async (id: string) => {
    setDeletingColorId(id)
    try {
      await deleteColorRequest(id)
      setColors((current) => current.filter((color) => color.id !== id))
      toast.success('Cor removida com sucesso!')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Não foi possível remover a cor.'))
    } finally {
      setDeletingColorId(null)
    }
  }

  return {
    clients,
    colors,
    isLoadingClients,
    isLoadingColors,
    deletingClientId,
    deletingColorId,
    colorForm,
    isCreatingColor: colorForm.formState.isSubmitting,
    hexCodePreview: colorForm.watch('hexCode'),
    onCreateColor,
    onDeleteClient,
    onDeleteColor,
  }
}
