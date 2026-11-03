import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from './api';
import { Book, BookSearch, Page, Shop, ShopWithBooks } from './models';

/** Öffentlicher Katalog: Bücher und Shops (ohne Login) */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);

  searchBooks(search: BookSearch) {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(search)) {
      if (value !== undefined && value !== null && value !== '' && value !== false) {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<Page<Book>>(`${API_URL}/books`, { params });
  }

  getBook(id: number) {
    return this.http.get<Book>(`${API_URL}/books/${id}`);
  }

  getShops() {
    return this.http.get<Shop[]>(`${API_URL}/shops`);
  }

  getShop(id: number) {
    return this.http.get<ShopWithBooks>(`${API_URL}/shops/${id}`);
  }
}
