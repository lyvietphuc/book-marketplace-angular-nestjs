import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MerchantService } from './merchant.service';
import { MerchantShop } from './merchant.models';
import { toErrorMessage } from '../auth/auth.service';

/** Dialog zum Anlegen (data = null) oder Bearbeiten (data = Shop) eines Shops */
@Component({
  selector: 'app-shop-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ shop ? 'Shop bearbeiten' : 'Neuer Shop' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()" novalidate>
      <mat-dialog-content class="fields">
        @if (errorMessage()) {
          <p class="error-box" role="alert">{{ errorMessage() }}</p>
        }
        <mat-form-field appearance="outline">
          <mat-label>Name des Shops</mat-label>
          <input matInput formControlName="name" />
          @if (form.controls.name.hasError('required')) {
            <mat-error>Bitte einen Namen eingeben.</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stadt</mat-label>
          <input matInput formControlName="city" />
          @if (form.controls.city.hasError('required')) {
            <mat-error>Bitte eine Stadt eingeben.</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Beschreibung (optional)</mat-label>
          <textarea matInput rows="3" formControlName="description"></textarea>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Abbrechen</button>
        <button mat-flat-button type="submit" [disabled]="saving()">Speichern</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .fields {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 380px;
    }
  `,
})
export class ShopFormDialog {
  private fb = inject(FormBuilder);
  private api = inject(MerchantService);
  private ref = inject(MatDialogRef<ShopFormDialog>);
  shop = inject<MerchantShop | null>(MAT_DIALOG_DATA);

  form = this.fb.nonNullable.group({
    name: [this.shop?.name ?? '', [Validators.required, Validators.maxLength(80)]],
    city: [this.shop?.city ?? '', [Validators.required, Validators.maxLength(80)]],
    description: [this.shop?.description ?? '', [Validators.maxLength(500)]],
  });

  saving = signal(false);
  errorMessage = signal<string | null>(null);

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const data = {
      name: value.name.trim(),
      city: value.city.trim(),
      description: value.description.trim(),
    };
    this.saving.set(true);
    const request = this.shop ? this.api.updateShop(this.shop.id, data) : this.api.createShop(data);
    request.subscribe({
      next: (saved) => this.ref.close(saved),
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(toErrorMessage(err));
      },
    });
  }
}
