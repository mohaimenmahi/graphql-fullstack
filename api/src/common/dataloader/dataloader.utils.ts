import DataLoader from "dataloader";
import { NotFoundError } from "@/common/errors/domain-errors";

export function mapToKeys<K, V>(
  keys: readonly K[],
  items: readonly V[],
  keyOf: (item: V) => K,
  onMissing: (key: K) => Error,
): Array<V | Error> {
  const byKey = new Map(items.map((item) => [keyOf(item), item]));
  return keys.map((key) => byKey.get(key) ?? onMissing(key));
}

export function groupToKeys<K, V>(
  keys: readonly K[],
  items: readonly V[],
  keyOf: (item: V) => K,
): V[][] {
  const groups = new Map<K, V[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return keys.map((key) => groups.get(key) ?? []);
}

export function byIdLoader<V extends { id: number }>(
  entity: string,
  fetch: (ids: readonly number[]) => Promise<V[]>,
): DataLoader<number, V> {
  return new DataLoader(async (ids) =>
    mapToKeys(
      ids,
      await fetch(ids),
      (item) => item.id,
      (id) => new NotFoundError(entity, id),
    ),
  );
}

export function groupLoader<Row, V = Row>(
  fetch: (keys: readonly number[]) => Promise<Row[]>,
  keyOf: (row: Row) => number,
  select: (row: Row) => V = (row) => row as unknown as V,
): DataLoader<number, V[]> {
  return new DataLoader(async (keys) =>
    groupToKeys(keys, await fetch(keys), keyOf).map((rows) => rows.map(select)),
  );
}
