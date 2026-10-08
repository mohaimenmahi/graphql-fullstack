import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Trim } from "@/common/validation/decorators";

@InputType()
export class CreateGenreInput {
  @Field()
  @Trim()
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MaxLength(50)
  name: string;
}
