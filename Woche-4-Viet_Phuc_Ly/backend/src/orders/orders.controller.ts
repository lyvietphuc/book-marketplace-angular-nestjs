// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { PdfService } from '../pdf/pdf.service';
import { UsersService } from '../users/users.service';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

/** Bestellungen aus Kundensicht */
@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class OrdersController {
  constructor(
    private orders: OrdersService,
    private pdf: PdfService,
    private users: UsersService,
  ) {}

  @Post()
  checkout(@Req() req: AuthenticatedRequest, @Body() dto: CreateOrderDto) {
    return this.orders.checkout(req.user.sub, dto);
  }

  @Get('mine')
  findMine(@Req() req: AuthenticatedRequest) {
    return this.orders.findMine(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.orders.findMineById(req.user.sub, id);
  }

  /** Rechnung als PDF – nur für die eigene Bestellung */
  @Get(':id/invoice')
  async invoice(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const order = await this.orders.findMineById(req.user.sub, id);
    const customer = await this.users.findById(req.user.sub);
    const buffer = await this.pdf.invoice(order, customer?.email ?? '');
    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition: `attachment; filename="Rechnung-${order.orderNumber}.pdf"`,
    });
  }
}
