import type { NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../errors/AppError.ts";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({ error: err.message, details: err.details });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor." });
}
