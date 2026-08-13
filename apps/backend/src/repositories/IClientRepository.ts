import type { ClientInput } from "@eteg/shared";

export interface ClientRecord {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  color: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateClientInput = ClientInput;

export interface IClientRepository {
  findByCpf(cpf: string): Promise<ClientRecord | null>;
  findByEmail(email: string): Promise<ClientRecord | null>;
  create(data: CreateClientInput): Promise<ClientRecord>;
}
