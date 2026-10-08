export abstract class DomainError extends Error {
  abstract readonly code: string;
}

export class NotFoundError extends DomainError {
  readonly code = "NOT_FOUND";

  constructor(entity: string, id: number | string) {
    super(`${entity} with id "${id}" was not found`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends DomainError {
  readonly code = "BAD_USER_INPUT";

  constructor(
    message: string,
    readonly details: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ConflictError extends DomainError {
  readonly code = "CONFLICT";

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
