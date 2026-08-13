import { Router } from "express";
import { clientRoutes } from "./client.routes.ts";
import { colorRoutes } from "./color.routes.ts";

export const routes = Router();

routes.use("/clients", clientRoutes);
routes.use("/colors", colorRoutes);
