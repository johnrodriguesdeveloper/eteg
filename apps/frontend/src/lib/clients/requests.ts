import type { ClientInput } from '@eteg/shared'

import { api } from '@/lib/api'
import type { ClientRecord } from './types'

export function listClients() {
  return api.get<ClientRecord[]>('/clients').then((response) => response.data)
}

export function createClient(data: ClientInput) {
  return api.post<ClientRecord>('/clients', data).then((response) => response.data)
}

export function deleteClient(id: string) {
  return api.delete(`/clients/${id}`)
}
