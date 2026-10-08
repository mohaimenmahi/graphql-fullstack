import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
  type Relation,
} from 'typeorm';
import { BookEntity } from '@/books/entities/book.entity';
import { MemberEntity } from '@/members/entities/member.entity';
import type { Review } from '@/reviews/models/review.model';
import { BaseEntity } from '@/common/entities/base.entity';

/** Constraint names are explicit so every app sharing this database generates the same SQL. */
@Entity({ name: 'reviews' })
@Unique('UQ_reviews_book_member', ['bookId', 'memberId']) // one review per member per book
@Check('CHK_reviews_rating', '"rating" BETWEEN 1 AND 5')
export class ReviewEntity extends BaseEntity implements Review {
  @Column({ type: 'int', name: 'book_id' })
  bookId: number;

  @Index()
  @Column({ type: 'int', name: 'member_id' })
  memberId: number;

  @Column({ type: 'smallint' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @ManyToOne(() => BookEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book?: Relation<BookEntity>;

  @ManyToOne(() => MemberEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member?: Relation<MemberEntity>;
}
