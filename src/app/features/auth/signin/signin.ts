import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthBanner } from "../auth-banner/auth-banner";
import { InputText } from "primeng/inputtext";

interface SigninFormValue {
  email: string;
  password: string;
}

@Component({
  selector: 'app-signin',
  imports: [ButtonModule, IconFieldModule, InputIconModule, PasswordModule, CheckboxModule, DividerModule, ReactiveFormsModule, AuthBanner, InputText],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly signinForm = this.fb.nonNullable.group(
    {
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
        },
      ],
      password: ['', [Validators.required]],
    },
  );

  get f() {
    return this.signinForm.controls;
  }

  submit(): void {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    const { email, password } = this.signinForm.getRawValue() as SigninFormValue;

    this.authService
      .login({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigateByUrl('/admin/dashboard'),
        error: (err) => {
          this.submitting.set(false);
          // this.serverError.set(this.resolveErrorMessage(err));
        },
      });
  }
}
