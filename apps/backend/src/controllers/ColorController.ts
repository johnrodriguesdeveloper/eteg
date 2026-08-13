import type { NextFunction, Request, Response } from "express";
import type { CreateColorUseCase } from "../use-cases/CreateColorUseCase.ts";
import type { DeleteColorUseCase } from "../use-cases/DeleteColorUseCase.ts";
import type { ListColorsUseCase } from "../use-cases/ListColorsUseCase.ts";

export class ColorController {
  private readonly listColorsUseCase: ListColorsUseCase;
  private readonly createColorUseCase: CreateColorUseCase;
  private readonly deleteColorUseCase: DeleteColorUseCase;

  constructor(
    listColorsUseCase: ListColorsUseCase,
    createColorUseCase: CreateColorUseCase,
    deleteColorUseCase: DeleteColorUseCase,
  ) {
    this.listColorsUseCase = listColorsUseCase;
    this.createColorUseCase = createColorUseCase;
    this.deleteColorUseCase = deleteColorUseCase;
  }

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const colors = await this.listColorsUseCase.execute();
      res.status(200).json(colors);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const color = await this.createColorUseCase.execute(req.body);
      res.status(201).json(color);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteColorUseCase.execute(req.params["id"] as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
