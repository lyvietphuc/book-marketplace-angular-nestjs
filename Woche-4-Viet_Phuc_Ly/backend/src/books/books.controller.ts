// src/books/books.controller.ts
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { SearchBooksDto } from './dto/search-books.dto';

/** Öffentlicher Katalog – ohne Login nutzbar */
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  // GET /books?q=kafka&sort=price_asc&page=1
  @Get()
  search(@Query() query: SearchBooksDto) {
    return this.booksService.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }
}
