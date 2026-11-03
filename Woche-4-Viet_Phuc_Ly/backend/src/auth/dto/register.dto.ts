// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Bitte eine gültige E-Mail-Adresse angeben.' })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
  })
  @MaxLength(72, {
    message: 'Das Passwort darf höchstens 72 Zeichen lang sein.',
  })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Der Name darf nicht leer sein.' })
  @MaxLength(100)
  name?: string;

  // Admin kann sich nicht selbst registrieren
  @IsOptional()
  @IsIn(['CUSTOMER', 'MERCHANT'], {
    message: 'Die Rolle muss CUSTOMER oder MERCHANT sein.',
  })
  role?: 'CUSTOMER' | 'MERCHANT';
}
