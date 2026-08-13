import type { ClientRecord, IClientRepository } from "../repositories/IClientRepository.ts";

export class ListClientsUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(): Promise<ClientRecord[]> {
    return this.clientRepository.findAll();
  }
}
