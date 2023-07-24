import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  username: string;

  @IsNotEmpty({ message: 'Адрес электронной почты не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный адрес электронной почты' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;

  @IsOptional()
  about?: string;

  @IsOptional()
  avatar?: string;
}