import type { NextFunction, Request, Response } from "express";
import type { ListClientsQuery } from "@eteg/shared";
import type { CreateClientUseCase } from "../use-cases/CreateClientUseCase.ts";
import type { DeleteClientUseCase } from "../use-cases/DeleteClientUseCase.ts";
import type { ListClientsUseCase } from "../use-cases/ListClientsUseCase.ts";

export class ClientController {
  private readonly createClientUseCase: CreateClientUseCase;
  private readonly listClientsUseCase: ListClientsUseCase;
  private readonly deleteClientUseCase: DeleteClientUseCase;

  constructor(
    createClientUseCase: CreateClientUseCase,
    listClientsUseCase: ListClientsUseCase,
    deleteClientUseCase: DeleteClientUseCase,
  ) {
    this.createClientUseCase = createClientUseCase;
    this.listClientsUseCase = listClientsUseCase;
    this.deleteClientUseCase = deleteClientUseCase;
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await this.createClientUseCase.execute(req.body);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { colorId } = res.locals["query"] as ListClientsQuery;
      const clients = await this.listClientsUseCase.execute(colorId);
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteClientUseCase.execute(req.params["id"] as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
