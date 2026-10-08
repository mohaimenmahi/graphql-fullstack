import { Field, ID, InputType, OmitType, PartialType } from "@nestjs/graphql";
import { ArrayMaxSize, IsArray, IsOptional, IsString } from "class-validator";
import { Unique } from "@/common/validation/decorators.js";
import { NewBookInput } from "./new-book.dto";

/**
 * Mapped types reuse fields AND validators: PartialType makes them optional (+ @IsOptional()).
 * genreIds is redeclared only to give it a description.
 */
@InputType()
export class UpdateBookInput extends PartialType(
  OmitType(NewBookInput, ["genreIds"] as const),
  InputType,
) {
  @Field(() => [ID], {
    nullable: true,
    description: "Replaces the book's genres when provided.",
  })
  @Unique()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: "At most 10 genres" })
  @IsString({ each: true })
  genreIds?: string[] | null;
}
