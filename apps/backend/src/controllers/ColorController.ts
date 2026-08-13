import type { NextFunction, Request, Response } from "express";
import type { ListColorsUseCase } from "../use-cases/ListColorsUseCase.ts";

export class ColorController {
  private readonly listColorsUseCase: ListColorsUseCase;

  constructor(listColorsUseCase: ListColorsUseCase) {
    this.listColorsUseCase = listColorsUseCase;
  }

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const colors = await this.listColorsUseCase.execute();
      res.status(200).json(colors);
    } catch (error) {
      next(error);
    }
  };
}
