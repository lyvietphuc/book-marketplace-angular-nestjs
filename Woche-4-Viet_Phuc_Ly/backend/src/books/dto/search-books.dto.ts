// src/books/dto/search-books.dto.ts
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const BOOK_SORTS = [
  'relevance',
  'price_asc',
  'price_desc',
  'newest',
  'title',
] as const;
export type BookSort = (typeof BOOK_SORTS)[number];

export class SearchBooksDto {
  /** Suchbegriff: Titel, Autor oder ISBN */
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  shopId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number; // in Cent

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number; // in Cent

  @IsOptional()
  @IsIn(['true', 'false'])
  inStock?: 'true' | 'false';

  @IsOptional()
  @IsIn(BOOK_SORTS)
  sort?: BookSort;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
