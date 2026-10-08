import { Field, ID, InputType, OmitType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { NewBookInput } from "./new-book.dto";

/**
 * OmitType with no keys = "copy all fields + validators, but not the class-level description".
 * (Plain `extends NewBookInput` would work too, but would also inherit its description.)
 */
@InputType()
export class CreateBookInput extends OmitType(
  NewBookInput,
  [] as const,
  InputType,
) {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
