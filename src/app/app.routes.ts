import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './features/auth/login';
import { Register } from './features/auth/register';
import { Dashboard } from './features/dashboard/dashboard';
import { AdmissionForm } from './features/admission/admission-form';
import { SuperAdmin } from './features/super-admin/super-admin';
import { authGuard } from './core/guards/auth';
import { studentAdmissionGuard } from './core/guards/student-admission.guard';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    // /admission is accessible when logged in but NOT yet APPROVED.
    // studentAdmissionGuard redirects approved students back to /dashboard.
    path: 'admission',
    component: AdmissionForm,
    canActivate: [studentAdmissionGuard]
  },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'super-admin', component: SuperAdmin, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
