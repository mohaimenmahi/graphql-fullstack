import {
  ApolloServerErrorCode,
  unwrapResolverError,
} from "@apollo/server/errors";
import type { GraphQLFormattedError } from "graphql";
import { DomainError, ValidationError } from "./domain-errors";

/**
 * Map domain errors to stable `extensions.code` values the frontend can switch on,
 * and hide internals of unexpected errors in production.
 */
export function createFormatError(isProduction: boolean) {
  return (
    formatted: GraphQLFormattedError,
    error: unknown,
  ): GraphQLFormattedError => {
    const original = unwrapResolverError(error);

    if (original instanceof DomainError) {
      return {
        message: original.message,
        ...(formatted.locations && { locations: formatted.locations }),
        ...(formatted.path && { path: formatted.path }),
        extensions: {
          code: original.code,
          ...(original instanceof ValidationError && {
            details: original.details,
          }),
        },
      };
    }

    if (
      formatted.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR
    ) {
      console.error(original);
      if (isProduction) {
        return {
          message: "Internal server error",
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        };
      }
    }

    return formatted;
  };
}
