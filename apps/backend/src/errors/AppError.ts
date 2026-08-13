export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  public readonly details: Array<{ path: string; message: string }>;

  constructor(details: Array<{ path: string; message: string }>) {
    super("Dados inválidos.", 400);
    this.details = details;
  }
}
