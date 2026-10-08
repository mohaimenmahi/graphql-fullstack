import { randomUUID } from "node:crypto";
import { withoutUndefined } from "@/common/utils/object";

export interface Entity {
  id: string;
}

export type NewEntity<T> = Omit<T, "id" | "createdAt">;

export interface Repository<T extends Entity> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findByIds(ids: readonly string[]): Promise<T[]>;
  create(data: NewEntity<T>): Promise<T>;
  update(id: string, patch: Partial<NewEntity<T>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// Implementation for unit tests.
export class InMemoryRepository<T extends Entity> implements Repository<T> {
  protected readonly items = new Map<string, T>();

  constructor(private readonly generateId: () => string = randomUUID) {}

  async findAll(): Promise<T[]> {
    return this.filter(() => true);
  }

  async findById(id: string): Promise<T | null> {
    const item = this.items.get(id);
    return item ? structuredClone(item) : null;
  }

  async findByIds(ids: readonly string[]): Promise<T[]> {
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

  async update(id: string, patch: Partial<NewEntity<T>>): Promise<T | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...withoutUndefined(patch), id } as T;
    this.items.set(id, updated);
    return structuredClone(updated);
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  /** Helper for subclasses that need custom finders. Returns copies, like a real DB. */
  protected filter(predicate: (item: T) => boolean): T[] {
    return [...this.items.values()]
      .filter(predicate)
      .map((item) => structuredClone(item));
  }
}
