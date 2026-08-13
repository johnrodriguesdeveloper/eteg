import type { ColorRecord, IColorRepository } from "../repositories/IColorRepository.ts";

export class ListColorsUseCase {
  private readonly colorRepository: IColorRepository;

  constructor(colorRepository: IColorRepository) {
    this.colorRepository = colorRepository;
  }

  async execute(): Promise<ColorRecord[]> {
    return this.colorRepository.findAll();
  }
}
