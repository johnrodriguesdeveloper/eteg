import express from "express";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { routes } from "./routes/index.ts";

export const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);
