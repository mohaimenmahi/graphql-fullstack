/**
 * Without this filter, Nest's default handler logs every non-HttpException as ERROR
 * with a stack trace, so a user typing a duplicate email looks like a crash in your logs.
 */

import { Catch } from "@nestjs/common";
import type { GqlExceptionFilter } from "@nestjs/graphql";
import { DomainError } from "./domain-errors.js";

/**
 * Domain errors are expected outcomes (bad input, missing entity), not crashes.
 * Handling them here stops Nest's default handler from logging them as ERROR;
 * returning the error hands it back to Apollo, where formatError maps the code.
 */
@Catch(DomainError)
export class DomainErrorFilter implements GqlExceptionFilter {
  catch(exception: DomainError) {
    return exception;
  }
}
