import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "A library member who can review books." })
export class Member {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;
}
