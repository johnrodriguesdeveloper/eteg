import { Router } from "express";
import { CreateColorSchema } from "@eteg/shared";
import { prisma } from "../database/prisma.ts";
import { ColorController } from "../controllers/ColorController.ts";
import { validateSchema } from "../middlewares/validateSchema.ts";
import { PrismaColorRepository } from "../repositories/PrismaColorRepository.ts";
import { CreateColorUseCase } from "../use-cases/CreateColorUseCase.ts";
import { ListColorsUseCase } from "../use-cases/ListColorsUseCase.ts";

const colorRepository = new PrismaColorRepository(prisma);
const listColorsUseCase = new ListColorsUseCase(colorRepository);
const createColorUseCase = new CreateColorUseCase(colorRepository);
const colorController = new ColorController(listColorsUseCase, createColorUseCase);

export const colorRoutes = Router();

colorRoutes.get("/", colorController.list);
colorRoutes.post("/", validateSchema(CreateColorSchema), colorController.create);
