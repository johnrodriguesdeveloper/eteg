import { Router } from "express";
import { prisma } from "../database/prisma.ts";
import { ColorController } from "../controllers/ColorController.ts";
import { PrismaColorRepository } from "../repositories/PrismaColorRepository.ts";
import { ListColorsUseCase } from "../use-cases/ListColorsUseCase.ts";

const colorRepository = new PrismaColorRepository(prisma);
const listColorsUseCase = new ListColorsUseCase(colorRepository);
const colorController = new ColorController(listColorsUseCase);

export const colorRoutes = Router();

colorRoutes.get("/", colorController.list);
