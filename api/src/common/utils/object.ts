/**
 * Drop keys whose value is `undefined`.
 * Convention used by every repository: undefined = "not provided", null = "set to NULL".
 */
export function withoutUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Postgres throws on `WHERE id = 'abc'` for uuid columns, so check before querying. */
export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}
