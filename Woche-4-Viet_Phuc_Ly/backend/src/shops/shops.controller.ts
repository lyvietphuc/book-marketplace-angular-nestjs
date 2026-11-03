// src/shops/shops.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ShopsService } from './shops.service';

/** Öffentliche Shop-Übersicht – ohne Login nutzbar */
@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Get()
  findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shopsService.findOne(id);
  }
}
