import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthService, EMAIL_PATTERN, toErrorMessage } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  templateUrl: './register.html',
  styleUrl: '../auth-form.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    role: ['CUSTOMER' as 'CUSTOMER' | 'MERCHANT', [Validators.required]],
    name: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
  });

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  submit() {
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { role, name, email, password } = this.form.getRawValue();
    this.loading.set(true);
    // leeren Namen nicht mitschicken (Backend erwartet dann gar kein Feld)
    this.auth
      .register({ email, password, role, ...(name.trim() ? { name: name.trim() } : {}) })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/login'], { queryParams: { registered: 1 } });
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(toErrorMessage(err));
        },
      });
  }
}
