import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, catchError, of } from 'rxjs';

/**
 * studentAdmissionGuard
 *
 * Protects the standalone /admission route:
 * - If the student is not logged in → redirect to /login
 * - If the student is already APPROVED → redirect to /dashboard (no need for admission form)
 * - Otherwise (NOT_SUBMITTED, PENDING, REJECTED) → allow access
 */
export const studentAdmissionGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return authService.getMe().pipe(
    map((profile: any) => {
      const status = profile?.admission_status;
      if (status === 'APPROVED') {
        // Already fully admitted — redirect to dashboard
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      // If /auth/me fails, fall back to login
      router.navigate(['/login']);
      return of(false);
    })
  );
};
