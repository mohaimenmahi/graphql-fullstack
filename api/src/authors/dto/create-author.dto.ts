import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Trim } from "@/common/validation/decorators";

@InputType()
export class CreateAuthorInput {
  @Field()
  @Trim()
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MaxLength(100)
  name: string;

  @Field(() => String, { nullable: true })
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string | null;
}
