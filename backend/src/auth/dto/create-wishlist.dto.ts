import { IsArray, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateWishlistDto {
   @IsString()
   @Length(1, 250)
   name: string;

   @IsString()
   @IsUrl()
   image: string;

   @IsArray()
   @IsNumber({}, { each: true })
   itemsId: number[];

   @IsOptional()
   @IsString()
   @Length(1, 1500)
   description: string;
}