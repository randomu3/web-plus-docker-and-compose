import { IsOptional, MaxLength, Min } from "class-validator";

export class UpdateGiftDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  link?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  @Min(0, { message: 'Новая стоимость подарка должна быть не меньше 0' })
  price?: number;

  @IsOptional()
  @MaxLength(1024, { message: 'Описание подарка не может превышать 1024 символа' })
  description?: string;
}