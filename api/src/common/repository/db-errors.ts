import { QueryFailedError } from "typeorm";
import { ConflictError } from "@/common/errors/domain-errors";

/** Postgres SQLSTATE codes we translate. Full list: postgresql.org/docs/current/errcodes-appendix.html */
const UNIQUE_VIOLATION = "23505";

/**
 * Services check uniqueness first (for a friendly message), but two concurrent requests can
 * both pass that check. The database constraint is the real guarantee; this turns its error
 * into a domain error instead of a 500.
 */
export function translateDbError(error: unknown): unknown {
  if (error instanceof QueryFailedError) {
    const code = (error.driverError as { code?: string } | undefined)?.code;
    if (code === UNIQUE_VIOLATION)
      return new ConflictError("This record already exists");
  }
  return error;
}
