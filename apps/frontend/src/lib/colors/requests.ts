import type { CreateColorInput } from '@eteg/shared'

import { api } from '@/lib/api'
import type { ColorRecord } from './types'

export function listColors() {
  return api.get<ColorRecord[]>('/colors').then((response) => response.data)
}

export function createColor(data: CreateColorInput) {
  return api.post<ColorRecord>('/colors', data).then((response) => response.data)
}

export function deleteColor(id: string) {
  return api.delete(`/colors/${id}`)
}
