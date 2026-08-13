import { Router } from "express";
import { clientRoutes } from "./client.routes.ts";

export const routes = Router();

routes.use("/clients", clientRoutes);
