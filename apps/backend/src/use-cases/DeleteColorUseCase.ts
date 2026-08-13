import type { IColorRepository } from "../repositories/IColorRepository.ts";

export class DeleteColorUseCase {
  private readonly colorRepository: IColorRepository;

  constructor(colorRepository: IColorRepository) {
    this.colorRepository = colorRepository;
  }

  async execute(id: string): Promise<void> {
    await this.colorRepository.delete(id);
  }
}
