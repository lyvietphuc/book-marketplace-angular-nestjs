// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { AdminService } from './admin.service';

/** Nur für Administratoren */
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('overview')
  overview() {
    return this.admin.overview();
  }

  @Get('merchants')
  merchants() {
    return this.admin.merchants();
  }

  @Get('customers')
  customers() {
    return this.admin.customers();
  }

  @Get('customers/:id/orders')
  customerOrders(@Param('id', ParseIntPipe) id: number) {
    return this.admin.customerOrders(id);
  }
}
