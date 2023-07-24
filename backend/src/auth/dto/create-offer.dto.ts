import { IsNotEmpty, Min } from "class-validator";

export class CreateOfferDto {
  @IsNotEmpty({ message: 'Идентификатор подарка не может быть пустым' })
  itemId: number;

  @IsNotEmpty({ message: 'Сумма заявки не может быть пустой' })
  @Min(0, { message: 'Сумма заявки должна быть не меньше 0' })
  amount: number;

  @IsNotEmpty({ message: 'Флаг скрытия не может быть пустым' })
  hidden: boolean;
}