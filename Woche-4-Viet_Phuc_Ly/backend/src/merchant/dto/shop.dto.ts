// src/merchant/dto/shop.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty({ message: 'Bitte einen Shop-Namen angeben.' })
  @MaxLength(80)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Bitte eine Stadt angeben.' })
  @MaxLength(80)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateShopDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Der Shop-Name darf nicht leer sein.' })
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Die Stadt darf nicht leer sein.' })
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
