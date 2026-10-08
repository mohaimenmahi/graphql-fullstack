import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Normalize, Trim } from "@/common/validation/decorators";

@InputType()
export class CreateMemberInput {
  @Field()
  @Trim()
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MaxLength(100)
  name: string;

  @Field()
  @Normalize() // "Ann@X.com " and "ann@x.com" are one member
  @IsEmail({}, { message: "Enter a valid email" })
  @MaxLength(255)
  email: string;
}
