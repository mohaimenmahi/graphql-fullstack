import { withoutUndefined } from "@/common/utils/object";

export interface Entity {
  id: number;
}

export type NewEntity<T> = Omit<T, "id" | "createdAt">;

export interface Repository<T extends Entity> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  findByIds(ids: readonly number[]): Promise<T[]>;
  create(data: NewEntity<T>): Promise<T>;
  update(id: number, patch: Partial<NewEntity<T>>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

// Implementation for unit tests.
export class InMemoryRepository<T extends Entity> implements Repository<T> {
  protected readonly items = new Map<number, T>();
  private lastId = 0;

  // Mirrors a SERIAL column: ids start at 1 and only go up.
  constructor(private readonly generateId: () => number = () => ++this.lastId) {}

  async findAll(): Promise<T[]> {
    return this.filter(() => true);
  }

  async findById(id: number): Promise<T | null> {
    const item = this.items.get(id);
    return item ? structuredClone(item) : null;
  }

  async findByIds(ids: readonly number[]): Promise<T[]> {
    return this.filter((item) => ids.includes(item.id));
  }

  async create(data: NewEntity<T>): Promise<T> {
    // Mirrors the database: every table has an id and a created_at default.
    const item = {
      ...data,
      id: this.generateId(),
      createdAt: new Date(),
    } as unknown as T;
    this.items.set(item.id, item);
    return structuredClone(item);
  }

  async update(id: number, patch: Partial<NewEntity<T>>): Promise<T | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...withoutUndefined(patch), id } as T;
    this.items.set(id, updated);
    return structuredClone(updated);
  }

  async delete(id: number): Promise<boolean> {
    return this.items.delete(id);
  }

  /** Helper for subclasses that need custom finders. Returns copies, like a real DB. */
  protected filter(predicate: (item: T) => boolean): T[] {
    return [...this.items.values()]
      .filter(predicate)
      .map((item) => structuredClone(item));
  }
}
