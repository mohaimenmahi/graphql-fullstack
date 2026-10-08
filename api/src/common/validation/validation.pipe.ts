/**
 * Nested validation errors, mechanism: class-validator returns a tree.
 * An error on books has children for index 1, which has children for title.
 * toFieldErrors walks it and builds books.1.title.
 * The default ValidationPipe would throw BadRequestException (code BAD_REQUEST, an unstructured message array);
 * exceptionFactory throws the domain ValidationError instead,
 * so formatError emits the contract's BAD_USER_INPUT + details.
 */

import {
  ValidationPipe,
  type ValidationError as ClassValidatorError,
} from "@nestjs/common";
import { ValidationError } from "../errors/domain-errors";

/**
 * Flatten class-validator's error TREE to { "dotted.path": [messages] }.
 * Nested input (via @ValidateNested) produces children: books → 1 → title,
 * which becomes "books.1.title" — the same shape the frontend expects.
 */
export function toFieldErrors(
  errors: ClassValidatorError[],
  parentPath = "",
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const error of errors) {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    if (error.constraints) result[path] = Object.values(error.constraints);
    if (error.children?.length)
      Object.assign(result, toFieldErrors(error.children, path));
  }
  return result;
}

/**
 * Throw our framework-agnostic ValidationError instead of Nest's BadRequestException,
 * so formatError maps it to BAD_USER_INPUT with `details`.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) =>
      new ValidationError("Invalid input", toFieldErrors(errors)),
  });
}
