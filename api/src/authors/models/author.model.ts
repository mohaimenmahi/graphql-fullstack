import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "A person who writes books" })
export class Author {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  bio: string | null;
}

// `books` is not stored on the author: it's a @ResolveField in AuthorsResolver.
