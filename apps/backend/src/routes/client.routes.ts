import { Router } from "express";
import { ClientSchema } from "@eteg/shared";
import { prisma } from "../database/prisma.ts";
import { ClientController } from "../controllers/ClientController.ts";
import { validateSchema } from "../middlewares/validateSchema.ts";
import { PrismaClientRepository } from "../repositories/PrismaClientRepository.ts";
import { CreateClientUseCase } from "../use-cases/CreateClientUseCase.ts";

const clientRepository = new PrismaClientRepository(prisma);
const createClientUseCase = new CreateClientUseCase(clientRepository);
const clientController = new ClientController(createClientUseCase);

export const clientRoutes = Router();

clientRoutes.post("/", validateSchema(ClientSchema), clientController.create);
