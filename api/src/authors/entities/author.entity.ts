import { Column, Entity } from 'typeorm';
import type { Author } from '@/authors/models/author.model';
import { BaseEntity } from '@/common/entities/base.entity';

/**
 * Every @Column states its `type` explicitly, so we never depend on emitDecoratorMetadata
 * (which esbuild-based tools like tsx can't emit).
 */
@Entity({ name: 'authors' })
export class AuthorEntity extends BaseEntity implements Author {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;
}
