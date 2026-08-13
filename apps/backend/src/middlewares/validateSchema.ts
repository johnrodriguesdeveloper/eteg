import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ValidationError } from "../errors/AppError.ts";

type ValidationSource = "body" | "query";

// req.query is a read-only getter in Express 5, so validated query data is published on res.locals instead.
export function validateSchema(schema: ZodType, source: ValidationSource = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      next(new ValidationError(details));
      return;
    }

    if (source === "body") {
      req.body = result.data;
    } else {
      res.locals["query"] = result.data;
    }
    next();
  };
}
