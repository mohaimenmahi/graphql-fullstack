import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({
  description:
    "A book written by exactly one author, tagged with any number of genres.",
})
export class Book {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field(() => Int, { nullable: true })
  publishedYear: number | null;

  autoherId: string; // the stored foreign key, not in schema as a field.
}
