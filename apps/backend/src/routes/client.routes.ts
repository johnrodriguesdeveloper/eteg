import { Router } from "express";
import { ClientSchema, ListClientsQuerySchema } from "@eteg/shared";
import { prisma } from "../database/prisma.ts";
import { ClientController } from "../controllers/ClientController.ts";
import { validateSchema } from "../middlewares/validateSchema.ts";
import { PrismaClientRepository } from "../repositories/PrismaClientRepository.ts";
import { CreateClientUseCase } from "../use-cases/CreateClientUseCase.ts";
import { DeleteClientUseCase } from "../use-cases/DeleteClientUseCase.ts";
import { ListClientsUseCase } from "../use-cases/ListClientsUseCase.ts";

const clientRepository = new PrismaClientRepository(prisma);
const createClientUseCase = new CreateClientUseCase(clientRepository);
const listClientsUseCase = new ListClientsUseCase(clientRepository);
const deleteClientUseCase = new DeleteClientUseCase(clientRepository);
const clientController = new ClientController(createClientUseCase, listClientsUseCase, deleteClientUseCase);

export const clientRoutes = Router();

clientRoutes.post("/", validateSchema(ClientSchema), clientController.create);
clientRoutes.get("/", validateSchema(ListClientsQuerySchema, "query"), clientController.list);
clientRoutes.delete("/:id", clientController.remove);
