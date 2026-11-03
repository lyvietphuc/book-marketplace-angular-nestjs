import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { BookCover } from '../core/book-cover';
import { EuroPipe } from '../core/euro.pipe';
import { Book } from '../core/models';

/** Kachel für ein Buch in Suchergebnissen und Shop-Seiten */
@Component({
  selector: 'app-book-card',
  imports: [RouterLink, MatCardModule, BookCover, EuroPipe],
  template: `
    <mat-card appearance="outlined" class="card">
      <a [routerLink]="['/buch', book().id]" class="cover-link">
        <app-book-cover [title]="book().title" [author]="book().author" [url]="book().coverUrl" />
      </a>
      <div class="body">
        <a [routerLink]="['/buch', book().id]" class="title">{{ book().title }}</a>
        <div class="author">{{ book().author }}</div>
        <a class="shop" [routerLink]="['/shops', book().shop.id]">{{ book().shop.name }}</a>
        <div class="price">{{ book().priceCents | euro }}</div>
        @if (book().stock === 0) {
          <div class="stock out">Derzeit nicht verfügbar</div>
        } @else if (book().stock <= 3) {
          <div class="stock low">Nur noch {{ book().stock }} auf Lager</div>
        } @else {
          <div class="stock">Auf Lager</div>
        }
        <div class="actions"><ng-content /></div>
      </div>
    </mat-card>
  `,
  styles: `
    .card {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 12px;
      box-sizing: border-box;
    }
    .cover-link {
      display: block;
      text-decoration: none;
      width: 62%;
      margin: 4px auto 12px;
    }
    .body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }
    .title {
      font: var(--mat-sys-title-small);
      color: inherit;
      text-decoration: none;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .title:hover {
      text-decoration: underline;
    }
    .author {
      color: var(--mat-sys-on-surface-variant);
      font-size: 13px;
    }
    .shop {
      font-size: 12px;
      color: var(--mat-sys-primary);
      text-decoration: none;
    }
    .price {
      font: var(--mat-sys-title-medium);
      margin-top: 6px;
    }
    .stock {
      font-size: 12px;
      color: #1e7b34;
    }
    .stock.low {
      color: #b25e00;
    }
    .stock.out {
      color: #b3261e;
    }
    .actions {
      margin-top: auto;
      padding-top: 8px;
    }
  `,
})
export class BookCard {
  book = input.required<Book>();
}
