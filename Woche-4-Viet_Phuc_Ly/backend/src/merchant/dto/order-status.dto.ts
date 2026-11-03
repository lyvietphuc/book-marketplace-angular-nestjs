// src/merchant/dto/order-status.dto.ts
import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['OPEN', 'SHIPPED'], { message: 'Status muss OPEN oder SHIPPED sein.' })
  status: 'OPEN' | 'SHIPPED';
}
