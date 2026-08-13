import type { IClientRepository } from "../repositories/IClientRepository.ts";

export class DeleteClientUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
