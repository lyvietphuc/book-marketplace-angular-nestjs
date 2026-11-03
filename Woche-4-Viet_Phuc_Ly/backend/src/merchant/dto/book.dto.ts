// src/merchant/dto/book.dto.ts
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsInt()
  shopId: number;

  @IsString()
  @IsNotEmpty({ message: 'Bitte einen Titel angeben.' })
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Bitte einen Autor angeben.' })
  @MaxLength(200)
  author: string;

  @IsOptional()
  @Matches(/^(97[89])?\d{9}[\dX]$/, {
    message: 'Die ISBN muss 10 oder 13 Ziffern haben (ohne Bindestriche).',
  })
  isbn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Die Cover-URL ist ungültig.' })
  coverUrl?: string;

  /** Preis in Cent, z. B. 1999 = 19,99 € */
  @IsInt({ message: 'Der Preis muss in Cent angegeben werden.' })
  @Min(1, { message: 'Der Preis muss größer als 0 sein.' })
  @Max(100000)
  priceCents: number;

  @IsInt()
  @Min(0, { message: 'Der Bestand darf nicht negativ sein.' })
  @Max(100000)
  stock: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class UpdateBookDto {
  @IsOptional()
  @IsInt()
  shopId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Der Titel darf nicht leer sein.' })
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Der Autor darf nicht leer sein.' })
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @Matches(/^(97[89])?\d{9}[\dX]$/, {
    message: 'Die ISBN muss 10 oder 13 Ziffern haben (ohne Bindestriche).',
  })
  isbn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Die Cover-URL ist ungültig.' })
  coverUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Der Preis muss größer als 0 sein.' })
  @Max(100000)
  priceCents?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Der Bestand darf nicht negativ sein.' })
  @Max(100000)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
