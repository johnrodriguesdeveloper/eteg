import { Prisma, type PrismaClient } from "../generated/prisma/client.ts";
import { ConflictError, NotFoundError } from "../errors/AppError.ts";
import type { ClientRecord, CreateClientInput, IClientRepository } from "./IClientRepository.ts";

export class PrismaClientRepository implements IClientRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByCpf(cpf: string): Promise<ClientRecord | null> {
    return this.prisma.client.findUnique({ where: { cpf } });
  }

  async findByEmail(email: string): Promise<ClientRecord | null> {
    return this.prisma.client.findUnique({ where: { email } });
  }

  async create(data: CreateClientInput): Promise<ClientRecord> {
    try {
      return await this.prisma.client.create({
        data: {
          fullName: data.fullName,
          cpf: data.cpf,
          email: data.email,
          color: data.color,
          notes: data.notes ?? null,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("CPF ou e-mail já cadastrado.");
      }
      throw error;
    }
  }

  async findAll(): Promise<ClientRecord[]> {
    return this.prisma.client.findMany({ orderBy: { createdAt: "desc" } });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.client.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundError("Cliente não encontrado.");
      }
      throw error;
    }
  }
}
