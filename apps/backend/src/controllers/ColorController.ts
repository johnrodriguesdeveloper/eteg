import type { NextFunction, Request, Response } from "express";
import type { CreateColorUseCase } from "../use-cases/CreateColorUseCase.ts";
import type { ListColorsUseCase } from "../use-cases/ListColorsUseCase.ts";

export class ColorController {
  private readonly listColorsUseCase: ListColorsUseCase;
  private readonly createColorUseCase: CreateColorUseCase;

  constructor(listColorsUseCase: ListColorsUseCase, createColorUseCase: CreateColorUseCase) {
    this.listColorsUseCase = listColorsUseCase;
    this.createColorUseCase = createColorUseCase;
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
}
