import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { StudentDashboard } from './student/student';
import { TeacherDashboard } from './teacher/teacher';
import { AdminDashboard } from './admin/admin';
import {
  LucideHouse,
  LucidePresentation,
  LucideCheckSquare,
  LucideUsers,
  LucideUserCheck,
  LucideLogOut,
  LucideLayoutDashboard,
  LucideSchool,
  LucideCreditCard,
  LucideBell,
  LucideClipboardList,
  LucideChevronDown,
  LucideChevronRight,
  LucideUserCog,
  LucideUpload
} from '@lucide/angular';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    StudentDashboard,
    TeacherDashboard,
    AdminDashboard,
    LucideHouse,
    LucidePresentation,
    LucideCheckSquare,
    LucideUsers,
    LucideUserCheck,
    LucideLogOut,
    LucideLayoutDashboard,
    LucideSchool,
    LucideCreditCard,
    LucideBell,
    LucideClipboardList,
    LucideChevronDown,
    LucideChevronRight,
    LucideUserCog,
    LucideUpload
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Shell State Management
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  // Student active page state
  studentActivePage = signal<string>('dashboard');
  classMenuOpen = signal<boolean>(false);

  // Admin active page state
  adminActivePage = signal<string>('dashboard');

  // Computed signals for user profile info
  currentUser = computed(() => this.authService.currentUser());
  userRole = computed(() => this.currentUser()?.role || 'student');

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  navigateStudent(page: string): void {
    this.studentActivePage.set(page);
    if (page !== 'class' && page !== 'class-detail') {
      this.classMenuOpen.set(false);
    }
  }

  navigateAdmin(page: string): void {
    this.adminActivePage.set(page);
  }

  toggleClassMenu(): void {
    this.classMenuOpen.update(v => !v);
    if (this.classMenuOpen()) {
      this.studentActivePage.set('class');
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
