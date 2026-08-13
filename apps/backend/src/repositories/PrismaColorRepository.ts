import { Prisma, type PrismaClient } from "../generated/prisma/client.ts";
import { NotFoundError } from "../errors/AppError.ts";
import type { ColorRecord, CreateColorInput, IColorRepository } from "./IColorRepository.ts";

export class PrismaColorRepository implements IColorRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<ColorRecord[]> {
    return this.prisma.color.findMany({ orderBy: { name: "asc" } });
  }

  async findByName(name: string): Promise<ColorRecord | null> {
    return this.prisma.color.findUnique({ where: { name } });
  }

  async create(data: CreateColorInput): Promise<ColorRecord> {
    return this.prisma.color.create({ data });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.color.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundError("Cor não encontrada.");
      }
      throw error;
    }
  }
}
