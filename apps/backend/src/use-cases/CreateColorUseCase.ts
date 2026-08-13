import type { CreateColorInput } from "@eteg/shared";
import { ConflictError } from "../errors/AppError.ts";
import type { ColorRecord, IColorRepository } from "../repositories/IColorRepository.ts";

export class CreateColorUseCase {
  private readonly colorRepository: IColorRepository;

  constructor(colorRepository: IColorRepository) {
    this.colorRepository = colorRepository;
  }

  async execute(input: CreateColorInput): Promise<ColorRecord> {
    const existingByName = await this.colorRepository.findByName(input.name);

    if (existingByName) {
      throw new ConflictError("Cor já cadastrada.");
    }

    return this.colorRepository.create(input);
  }
}
