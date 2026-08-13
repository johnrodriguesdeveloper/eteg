import type { PrismaClient } from "../generated/prisma/client.ts";
import type { ColorRecord, IColorRepository } from "./IColorRepository.ts";

export class PrismaColorRepository implements IColorRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<ColorRecord[]> {
    return this.prisma.color.findMany({ orderBy: { name: "asc" } });
  }
}
