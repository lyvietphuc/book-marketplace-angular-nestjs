// src/books/books.module.ts

import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports: [PrismaModule],
})
export class BooksModule {}
