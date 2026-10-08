import { Field, ID, InputType, Int } from "@nestjs/graphql";
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import {
  IsNotFutureYear,
  Trim,
  Unique,
} from "../../common/validation/decorators";

/** The fields every book has — used on its own inside createAuthorWithBooks, and extended below. */
@InputType({
  description:
    "A book created together with its author (see createAuthorWithBooks).",
})
export class NewBookInput {
  @Field()
  @Trim()
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  @MaxLength(200)
  title: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1450, { message: "Year looks too early" })
  @IsNotFutureYear()
  publishedYear?: number | null;

  @Field(() => [ID], { nullable: true })
  @Unique()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: "At most 10 genres" })
  @IsString({ each: true })
  genreIds?: string[] | null;
}
