/**
 * Drop keys whose value is `undefined`.
 * Convention used by every repository: undefined = "not provided", null = "set to NULL".
 */
export function withoutUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

const MAX_INT4 = 2_147_483_647;

// Postgres throws on ids outside the int4 range (or non-integers), so check before querying.
export function isValidId(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= MAX_INT4;
}
