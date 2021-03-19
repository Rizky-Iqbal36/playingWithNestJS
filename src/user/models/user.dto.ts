import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class User {
  id?: number;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  @Length(8, 30)
  password?: string;

  name?: string;

  userName?: string;
}
