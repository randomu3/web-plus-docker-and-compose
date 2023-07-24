import { IsEmail } from "class-validator";

export class FindManyUserDto {
   @IsEmail()
   query: string;
}