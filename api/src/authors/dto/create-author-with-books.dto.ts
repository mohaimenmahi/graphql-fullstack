import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from "class-validator";
import { NewBookInput } from "@/books/dto/new-book.dto";
import { CreateAuthorInput } from "./create-author.dto";

/**
 * Nested input. Three decorators make nesting work end to end:
 *   @Field(() => [NewBookInput])  → GraphQL: `books: [NewBookInput!]!`
 *   @Type(() => NewBookInput)     → class-transformer builds real NewBookInput instances
 *                                   (so @Trim etc. run on each book)
 *   @ValidateNested({ each: true }) → class-validator descends into every book
 * Forget @Type and nested validation silently does nothing: the items stay plain objects.
 */
@InputType()
export class CreateAuthorWithBooksInput extends CreateAuthorInput {
  @Field(() => [NewBookInput])
  @IsArray()
  @ArrayMinSize(1, { message: "Add at least one book" })
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => NewBookInput)
  books: NewBookInput[];
}
