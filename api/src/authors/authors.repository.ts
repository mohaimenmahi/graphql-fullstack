import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository as OrmRepository } from 'typeorm';
import {
  InMemoryRepository,
  type NewEntity,
  type Repository,
} from '../common/repository/repository.js';
import { TypeOrmRepository } from '../common/repository/typeorm.repository.js';
import { AuthorEntity } from './entities/author.entity.js';
import type { Author } from './models/author.model.js';

/**
 * Abstract class doubles as the DI token (interfaces vanish at runtime).
 * The module decides which implementation backs it.
 */
export abstract class AuthorsRepository implements Repository<Author> {
  abstract findAll(): Promise<Author[]>;
  abstract findById(id: number): Promise<Author | null>;
  abstract findByIds(ids: readonly number[]): Promise<Author[]>;
  abstract create(data: NewEntity<Author>): Promise<Author>;
  abstract update(
    id: number,
    patch: Partial<NewEntity<Author>>,
  ): Promise<Author | null>;
  abstract delete(id: number): Promise<boolean>;
}

/** Production: Postgres. Nest injects the ORM repository; the unit of work passes a transactional one. */
@Injectable()
export class TypeOrmAuthorsRepository
  extends TypeOrmRepository<Author, AuthorEntity>
  implements AuthorsRepository
{
  constructor(
    @InjectRepository(AuthorEntity) orm: OrmRepository<AuthorEntity>,
  ) {
    super(orm, { createdAt: 'ASC' });
  }
}

/** Unit tests: no database. */
export class InMemoryAuthorsRepository
  extends InMemoryRepository<Author>
  implements AuthorsRepository {}
