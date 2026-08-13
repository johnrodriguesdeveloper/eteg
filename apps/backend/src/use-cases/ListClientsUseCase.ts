import type { ClientRecord, IClientRepository } from "../repositories/IClientRepository.ts";

export class ListClientsUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(colorId?: string): Promise<ClientRecord[]> {
    return this.clientRepository.findAll(colorId);
  }
}
