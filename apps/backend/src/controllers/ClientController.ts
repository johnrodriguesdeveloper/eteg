import type { NextFunction, Request, Response } from "express";
import type { CreateClientUseCase } from "../use-cases/CreateClientUseCase.ts";

export class ClientController {
  private readonly createClientUseCase: CreateClientUseCase;

  constructor(createClientUseCase: CreateClientUseCase) {
    this.createClientUseCase = createClientUseCase;
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await this.createClientUseCase.execute(req.body);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  };
}
