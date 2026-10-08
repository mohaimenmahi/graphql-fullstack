import {
  In,
  type DeepPartial,
  type FindOptionsOrder,
  type FindOptionsWhere,
  type ObjectLiteral,
  type Repository as OrmRepository,
} from "typeorm";
import type { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";
import { isValidId, withoutUndefined } from "@/common/utils/object";
import type { Entity, NewEntity, Repository } from "./repository";
import { translateDbError } from "./db-errors";

/**
 * Generic TypeORM implementation of our Repository contract.
 * TModel = what services see; TEntity = the decorated class TypeORM maps (a superset, e.g. + createdAt).
 */
export class TypeOrmRepository<
  TModel extends Entity,
  TEntity extends TModel & ObjectLiteral,
> implements Repository<TModel> {
  constructor(
    protected readonly orm: OrmRepository<TEntity>,
    private readonly defaultOrder: FindOptionsOrder<TEntity> = {},
  ) {}

  findAll(): Promise<TEntity[]> {
    return this.orm.find({ order: this.defaultOrder });
  }

  async findById(id: number): Promise<TEntity | null> {
    if (!isValidId(id)) return null; // -1 or 1e12 is simply not found, not a 500
    return this.orm.findOneBy({ id } as FindOptionsWhere<TEntity>);
  }

  async findByIds(ids: readonly number[]): Promise<TEntity[]> {
    const valid = ids.filter(isValidId);
    if (valid.length === 0) return [];
    return this.orm.findBy({ id: In(valid) } as FindOptionsWhere<TEntity>);
  }

  async create(data: NewEntity<TModel>): Promise<TEntity> {
    try {
      return await this.orm.save(this.orm.create(data as DeepPartial<TEntity>));
    } catch (error) {
      throw translateDbError(error);
    }
  }

  async update(
    id: number,
    patch: Partial<NewEntity<TModel>>,
  ): Promise<TEntity | null> {
    if (!isValidId(id)) return null;
    const changes = withoutUndefined(patch);
    if (Object.keys(changes).length > 0) {
      try {
        await this.orm.update(id, changes as QueryDeepPartialEntity<TEntity>);
      } catch (error) {
        throw translateDbError(error);
      }
    }
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    if (!isValidId(id)) return false;
    const result = await this.orm.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
