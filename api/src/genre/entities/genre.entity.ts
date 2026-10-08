import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { BookEntity } from '@/books/entities/book.entity';
import type { BookGenreLink, Genre } from '@/genre/models/genre.model';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity({ name: 'genres' })
export class GenreEntity extends BaseEntity implements Genre {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;
}

/**
 * Explicit join entity instead of @ManyToMany:
 * - we can batch-load links by book OR genre ids with plain IN queries,
 * - the table can grow columns later (e.g. `added_at`) without a redesign.
 * Composite primary key (book_id, genre_id) also prevents duplicate links.
 */
@Entity({ name: 'book_genres' })
export class BookGenreEntity implements BookGenreLink {
  @PrimaryColumn({ type: 'int', name: 'book_id' })
  bookId: number;

  /** The PK index starts with book_id, so lookups by genre need their own index. */
  @Index()
  @PrimaryColumn({ type: 'int', name: 'genre_id' })
  genreId: number;

  @ManyToOne(() => BookEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book?: Relation<BookEntity>;

  @ManyToOne(() => GenreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genre_id' })
  genre?: Relation<GenreEntity>;
}
