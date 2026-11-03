// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Bitte eine gültige E-Mail-Adresse angeben.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Bitte ein Passwort angeben.' })
  password: string;
}
