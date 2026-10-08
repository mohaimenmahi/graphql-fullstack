import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from "@nestjs/graphql";

@ObjectType()
export class Review {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  rating: number;

  @Field(() => String, { nullable: true })
  comment: string | null;

  /** Nest's built-in scalar, named `DateTime` in the schema. */
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  bookId: number;
  memberId: number;
}

/** Aggregate per book, computed in SQL (AVG / COUNT ... GROUP BY). */
export interface RatingStats {
  bookId: number;
  average: number | null;
  count: number;
}
