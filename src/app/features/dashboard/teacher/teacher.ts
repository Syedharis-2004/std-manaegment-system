import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { LucideBookOpen, LucideEdit, LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [CommonModule, LucideBookOpen, LucideEdit, LucideStar],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class TeacherDashboard implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  backendMessage = signal<string>('Verifying teacher access...');
  isAuthorized = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Simulated premium interactive teacher metrics
  activeClassesCount = signal<number>(4);
  pendingGradingCount = signal<number>(18);
  averageRating = signal<number>(4.9);
  
  classes = signal([
    { code: 'CS-301', name: 'Database Systems', studentsCount: 42, nextLecture: 'Today, 2:00 PM', room: 'Lab 4' },
    { code: 'CS-405', name: 'Advanced Algorithms', studentsCount: 28, nextLecture: 'Tomorrow, 10:00 AM', room: 'Hall B' },
    { code: 'CS-101', name: 'Introduction to CS', studentsCount: 85, nextLecture: 'Friday, 9:00 AM', room: 'Main Auditorium' }
  ]);

  pendingSubmissions = signal([
    { student: 'Alice Smith', course: 'CS-301', assignment: 'SQL Lab 3', submittedAt: '2 hours ago' },
    { student: 'Bob Johnson', course: 'CS-405', assignment: 'Greedy Algorithms Essay', submittedAt: '4 hours ago' },
    { student: 'Charlie Brown', course: 'CS-301', assignment: 'SQL Lab 3', submittedAt: 'Yesterday' }
  ]);

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/dashboard/teacher`).subscribe({
      next: (res) => {
        this.backendMessage.set(res.message || 'Access granted!');
        this.isAuthorized.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.backendMessage.set(err.error?.detail || 'Unauthorized teacher access!');
        this.isAuthorized.set(false);
        this.isLoading.set(false);
      }
    });
  }
}
