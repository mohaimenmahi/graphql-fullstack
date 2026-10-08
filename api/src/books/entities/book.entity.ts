import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { AuthorEntity } from '@/authors/entities/author.entity';
import type { Book } from '@/books/models/book.model';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity({ name: 'books' })
export class BookEntity extends BaseEntity implements Book {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'int', name: 'published_year', nullable: true })
  publishedYear: number | null;

  /** Plain FK column: loaders batch by it without loading the relation. */
  @Index()
  @Column({ type: 'int', name: 'author_id' })
  authorId: number;

  /** Defines the FOREIGN KEY constraint. Never loaded (no `eager`, no `relations`). */
  @ManyToOne(() => AuthorEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author?: Relation<AuthorEntity>;
}
