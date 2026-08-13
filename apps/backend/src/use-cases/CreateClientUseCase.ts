import type { ClientInput } from "@eteg/shared";
import { ConflictError } from "../errors/AppError.ts";
import type { ClientRecord, IClientRepository } from "../repositories/IClientRepository.ts";

export class CreateClientUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(input: ClientInput): Promise<ClientRecord> {
    const [existingByCpf, existingByEmail] = await Promise.all([
      this.clientRepository.findByCpf(input.cpf),
      this.clientRepository.findByEmail(input.email),
    ]);

    if (existingByCpf) {
      throw new ConflictError("CPF já cadastrado.");
    }

    if (existingByEmail) {
      throw new ConflictError("E-mail já cadastrado.");
    }

    return this.clientRepository.create(input);
  }
}
