// src/orders/dto/create-order.dto.ts
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsInt()
  bookId: number;

  @IsInt()
  @Min(1, { message: 'Die Menge muss mindestens 1 sein.' })
  @Max(20, { message: 'Maximal 20 Stück pro Buch.' })
  quantity: number;
}

export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Bitte Vor- und Nachnamen angeben.' })
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Bitte Straße und Hausnummer angeben.' })
  @MaxLength(120)
  street: string;

  @Matches(/^\d{5}$/, { message: 'Die PLZ muss aus 5 Ziffern bestehen.' })
  zip: string;

  @IsString()
  @IsNotEmpty({ message: 'Bitte einen Ort angeben.' })
  @MaxLength(80)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  country?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Der Warenkorb ist leer.' })
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping: ShippingAddressDto;
}
