import { Routes } from '@angular/router';
import { Login } from './features/auth/login';
import { Register } from './features/auth/register';
import { Dashboard } from './features/dashboard/dashboard';
import { AdmissionForm } from './features/admission/admission-form';
import { authGuard } from './core/guards/auth';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'admission', component: AdmissionForm },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
