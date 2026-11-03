import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MerchantService } from './merchant.service';
import { BookInput, MerchantBook, MerchantShop } from './merchant.models';
import { toErrorMessage } from '../auth/auth.service';

export interface BookFormData {
  book: MerchantBook | null;
  shops: MerchantShop[];
}

/**
 * Dialog zum Anlegen/Bearbeiten eines Buchs.
 * Der Preis wird in Euro eingegeben (z. B. 12,99) und als Cent (1299) gespeichert.
 */
@Component({
  selector: 'app-book-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './book-form-dialog.html',
  styles: `
    .fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 12px;
      max-width: 640px;
    }
    .full {
      grid-column: 1 / -1;
    }
  `,
})
export class BookFormDialog {
  private fb = inject(FormBuilder);
  private api = inject(MerchantService);
  private ref = inject(MatDialogRef<BookFormDialog>);
  data = inject<BookFormData>(MAT_DIALOG_DATA);
  book = this.data.book;

  form = this.fb.nonNullable.group({
    shopId: [
      this.book?.shopId ?? this.data.shops[0]?.id ?? 0,
      [Validators.required, Validators.min(1)],
    ],
    title: [this.book?.title ?? '', [Validators.required, Validators.maxLength(200)]],
    author: [this.book?.author ?? '', [Validators.required, Validators.maxLength(200)]],
    isbn: [this.book?.isbn ?? '', [Validators.pattern(/^[\d\s-]{10,17}X?$/)]],
    price: [
      this.book ? (this.book.priceCents / 100).toFixed(2).replace('.', ',') : '',
      [Validators.required, Validators.pattern(/^\d{1,4}([.,]\d{1,2})?$/)],
    ],
    stock: [
      this.book?.stock ?? 1,
      [Validators.required, Validators.min(0), Validators.max(100000)],
    ],
    coverUrl: [this.book?.coverUrl ?? '', [Validators.pattern(/^https?:\/\/.+/)]],
    description: [this.book?.description ?? '', [Validators.maxLength(2000)]],
    published: [this.book?.published ?? true],
  });

  saving = signal(false);
  errorMessage = signal<string | null>(null);

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const priceCents = Math.round(Number(v.price.replace(',', '.')) * 100);
    if (priceCents <= 0) {
      this.form.controls.price.setErrors({ pattern: true });
      return;
    }
    const data: BookInput = {
      shopId: Number(v.shopId),
      title: v.title.trim(),
      author: v.author.trim(),
      priceCents,
      stock: Number(v.stock),
      published: v.published,
      ...(v.isbn.trim() ? { isbn: v.isbn.replace(/[\s-]/g, '') } : {}),
      ...(v.coverUrl.trim() ? { coverUrl: v.coverUrl.trim() } : {}),
      ...(v.description.trim() ? { description: v.description.trim() } : {}),
    };

    this.saving.set(true);
    const request = this.book ? this.api.updateBook(this.book.id, data) : this.api.createBook(data);
    request.subscribe({
      next: (saved) => this.ref.close(saved),
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(toErrorMessage(err));
      },
    });
  }
}
