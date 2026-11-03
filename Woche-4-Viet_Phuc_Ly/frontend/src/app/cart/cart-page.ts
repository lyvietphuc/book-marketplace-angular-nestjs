import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookCover } from '../core/book-cover';
import { EuroPipe } from '../core/euro.pipe';
import { CartService, FREE_SHIPPING_FROM_CENTS } from './cart.service';

@Component({
  selector: 'app-cart-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    BookCover,
    EuroPipe,
  ],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  cart = inject(CartService);
  readonly freeFrom = FREE_SHIPPING_FROM_CENTS;
}
