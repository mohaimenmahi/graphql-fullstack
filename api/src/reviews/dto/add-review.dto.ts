import { Field, ID, InputType, Int } from "@nestjs/graphql";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { Trim } from "@/common/validation/decorators";

@InputType()
export class AddReviewInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1, { message: "Rating must be 1–5" })
  @Max(5, { message: "Rating must be 1–5" })
  rating: number;

  @Field(() => String, { nullable: true })
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string | null;
}
