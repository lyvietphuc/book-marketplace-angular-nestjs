// src/merchant/merchant.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { PdfService } from '../pdf/pdf.service';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';
import { MerchantService } from './merchant.service';
import { UpdateOrderStatusDto } from './dto/order-status.dto';

/** Alle Endpunkte nur für eingeloggte Händler */
@Controller('merchant')
@UseGuards(AuthGuard, RolesGuard)
@Roles('MERCHANT')
export class MerchantController {
  constructor(
    private merchant: MerchantService,
    private pdf: PdfService,
  ) {}

  @Get('shops')
  listShops(@Req() req: AuthenticatedRequest) {
    return this.merchant.listShops(req.user.sub);
  }

  @Post('shops')
  createShop(@Req() req: AuthenticatedRequest, @Body() dto: CreateShopDto) {
    return this.merchant.createShop(req.user.sub, dto);
  }

  @Patch('shops/:id')
  updateShop(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShopDto,
  ) {
    return this.merchant.updateShop(req.user.sub, id, dto);
  }

  @Get('books')
  listBooks(
    @Req() req: AuthenticatedRequest,
    @Query('shopId') shopId?: string,
  ) {
    return this.merchant.listBooks(
      req.user.sub,
      shopId ? Number(shopId) : undefined,
    );
  }

  @Post('books')
  createBook(@Req() req: AuthenticatedRequest, @Body() dto: CreateBookDto) {
    return this.merchant.createBook(req.user.sub, dto);
  }

  @Patch('books/:id')
  updateBook(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto,
  ) {
    return this.merchant.updateBook(req.user.sub, id, dto);
  }

  @Delete('books/:id')
  deleteBook(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.merchant.deleteBook(req.user.sub, id);
  }

  // GET /merchant/orders?status=OPEN
  @Get('orders')
  listOrders(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: string,
  ) {
    const filter =
      status === 'OPEN' || status === 'SHIPPED' ? status : undefined;
    return this.merchant.listOrders(req.user.sub, filter);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.merchant.updateOrderStatus(req.user.sub, id, dto.status);
  }

  // GET /merchant/stats?days=30
  @Get('stats')
  stats(@Req() req: AuthenticatedRequest, @Query('days') days?: string) {
    const n = Number(days);
    const range = [7, 14, 30, 90].includes(n) ? n : 30;
    return this.merchant.stats(req.user.sub, range);
  }

  /** Versandlabel als PDF – nur für Bestellungen aus eigenen Shops */
  @Get('orders/:id/label')
  async label(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const order = await this.merchant.findOwnOrder(req.user.sub, id);
    const buffer = await this.pdf.shippingLabel(order);
    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition: `attachment; filename="Versandlabel-${order.orderNumber}.pdf"`,
    });
  }
}
