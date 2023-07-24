import { IsNotEmpty, MaxLength, Min } from "class-validator";

export class CreateGiftDto {
  @IsNotEmpty({ message: 'Название подарка не может быть пустым' })
  name: string;

  @IsNotEmpty({ message: 'Ссылка на подарок не может быть пустой' })
  link: string;

  @IsNotEmpty({ message: 'Ссылка на изображение подарка не может быть пустой' })
  image: string;

  @IsNotEmpty({ message: 'Стоимость подарка не может быть пустой' })
  @Min(0, { message: 'Стоимость подарка должна быть не меньше 0' })
  price: number;

  @IsNotEmpty({ message: 'Описание подарка не может быть пустым' })
  @MaxLength(1024, { message: 'Описание подарка не может превышать 1024 символа' })
  description: string;
}