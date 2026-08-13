import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "../adapters/openapi.ts";

export const docsRoutes = Router();

docsRoutes.use("/", swaggerUi.serve, swaggerUi.setup(openApiDocument));
