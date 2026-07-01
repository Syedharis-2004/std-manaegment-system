import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { StudentDashboard } from './student/student';
import { TeacherDashboard } from './teacher/teacher';
import { AdminDashboard } from './admin/admin';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StudentDashboard, TeacherDashboard, AdminDashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Shell State Management
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  // Computed signals for user profile info
  currentUser = computed(() => this.authService.currentUser());
  userRole = computed(() => this.currentUser()?.role || 'student');

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  logout(): void {
    this.authService.logout();
    this.showToast('Logged out successfully', 'success');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
