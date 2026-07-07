import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    middle_name: [''],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    father_name: ['', [Validators.required, Validators.minLength(2)]],
    mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9+ \-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', [Validators.required]],
    role: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Clear errors if match is successful but watch out not to clear other validators
    if (confirmPassword && confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const val = this.registerForm.value;

    this.authService.register({ 
      first_name: val.first_name!,
      middle_name: val.middle_name || '',
      last_name: val.last_name!,
      father_name: val.father_name!,
      mobile_number: val.mobile_number!,
      email: val.email!,
      password: val.password!,
      confirm_password: val.confirm_password!,
      role: val.role as any
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.message === 'User Registered Successfully') {
          this.successMessage.set('Registration Successful! Redirecting to login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1800);
        } else {
          this.errorMessage.set(response.message || 'Mobile number or email already exists.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.detail || err.error?.message || 'Failed to register. Please try again.');
      }
    });
  }
}
