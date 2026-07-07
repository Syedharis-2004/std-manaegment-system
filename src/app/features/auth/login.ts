import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (response) => {
        if (response.access_token) {
          // Fetch additional profile details for name mapping
          this.authService.getMe().subscribe({
            next: (profile) => {
              this.isLoading.set(false);
              const fullName = `${profile.first_name} ${profile.last_name}`;
              const sessionUser = {
                email: profile.email || email!,
                name: fullName,
                role: profile.role
              };
              localStorage.setItem('edu_user', JSON.stringify(sessionUser));
              this.authService.currentUser.set(sessionUser);

              this.successMessage.set('Login Successful! Redirecting...');
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 1200);
            },
            error: () => {
              this.isLoading.set(false);
              this.successMessage.set('Login Successful! Redirecting...');
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 1200);
            }
          });
        } else {
          this.isLoading.set(false);
          this.errorMessage.set(response.message || 'Invalid email or password');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.detail || err.error?.message || 'Connection error. Make sure the backend is running.');
      }
    });
  }
}
