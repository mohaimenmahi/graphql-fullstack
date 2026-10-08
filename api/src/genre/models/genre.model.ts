import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Genre {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}

/** One row of the book_genres join table for many to many relationship (not a GraphQL type). */
export interface BookGenreLink {
  bookId: string;
  genreId: string;
}
