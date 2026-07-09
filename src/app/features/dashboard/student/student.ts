import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

import { LucideGraduationCap, LucideCheckCircle, LucideBookOpen } from '@lucide/angular';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, RouterLink, LucideGraduationCap, LucideCheckCircle, LucideBookOpen],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class StudentDashboard implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8000';

  backendMessage = signal<string>('Verifying student access...');
  isAuthorized = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Admission reminder modal
  showAdmissionModal = signal<boolean>(false);

  // Simulated premium interactive student metrics
  gpa = signal<number>(3.82);
  attendance = signal<number>(94);
  completedCredits = signal<number>(48);
  totalCredits = signal<number>(120);
  
  courses = signal([
    { code: 'CS-301', name: 'Database Systems', instructor: 'Dr. Sarah Connor', progress: 75, grade: 'A-' },
    { code: 'MATH-202', name: 'Linear Algebra', instructor: 'Prof. Alan Turing', progress: 90, grade: 'A' },
    { code: 'CS-310', name: 'Artificial Intelligence', instructor: 'Dr. John McCarthy', progress: 60, grade: 'B+' },
    { code: 'ENG-150', name: 'Creative Writing', instructor: 'Mary Shelley', progress: 100, grade: 'A+' }
  ]);

  assignments = signal([
    { title: 'Project Proposal', course: 'CS-310', due: 'Tomorrow', status: 'pending', urgent: true },
    { title: 'Homework 4: Vector Spaces', course: 'MATH-202', due: 'In 3 days', status: 'completed', urgent: false },
    { title: 'SQL Lab 3', course: 'CS-301', due: 'In 5 days', status: 'pending', urgent: false }
  ]);

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/dashboard/student`).subscribe({
      next: (res) => {
        this.backendMessage.set(res.message || 'Access granted!');
        this.isAuthorized.set(true);
        this.isLoading.set(false);
        // After auth passes, check admission status
        this.checkAdmissionStatus();
      },
      error: (err) => {
        this.backendMessage.set(err.error?.detail || 'Unauthorized student access!');
        this.isAuthorized.set(false);
        this.isLoading.set(false);
      }
    });
  }

  checkAdmissionStatus(): void {
    this.authService.getMe().subscribe({
      next: (profile) => {
        // Show modal only if student has NOT yet submitted admission form
        if (profile?.admission_status === 'NOT_SUBMITTED') {
          this.showAdmissionModal.set(true);
        }
      },
      error: () => {
        // Silently fail — don't block dashboard
      }
    });
  }

  goToAdmissionForm(): void {
    this.showAdmissionModal.set(false);
    this.router.navigate(['/admission']);
  }

  dismissModal(): void {
    this.showAdmissionModal.set(false);
  }
}

