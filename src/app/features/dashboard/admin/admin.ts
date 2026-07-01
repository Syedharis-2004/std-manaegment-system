import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  backendMessage = signal<string>('Verifying administrator access...');
  isAuthorized = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Simulated premium interactive admin metrics
  totalUsers = signal<number>(142);
  activeSessions = signal<number>(24);
  serverHealth = signal<string>('99.98%');
  
  users = signal([
    { name: 'Dr. Sarah Connor', email: 'sconnor@institution.edu', role: 'teacher', status: 'active' },
    { name: 'Alice Smith', email: 'asmith@student.edu', role: 'student', status: 'active' },
    { name: 'John Doe', email: 'jdoe@student.edu', role: 'student', status: 'inactive' },
    { name: 'Haris Khan', email: 'haris@admin.edu', role: 'admin', status: 'active' }
  ]);

  systemLogs = signal([
    { event: 'User register successful', user: 'jdoe@student.edu', time: '10 mins ago', severity: 'info' },
    { event: 'Database backup completed', user: 'System Cron', time: '1 hour ago', severity: 'success' },
    { event: 'Unauthorized endpoint request blocked', user: 'Anonymous', time: '3 hours ago', severity: 'warning' }
  ]);

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/dashboard/admin`).subscribe({
      next: (res) => {
        this.backendMessage.set(res.message || 'Access granted!');
        this.isAuthorized.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.backendMessage.set(err.error?.detail || 'Unauthorized administrator access!');
        this.isAuthorized.set(false);
        this.isLoading.set(false);
      }
    });
  }

  toggleUserStatus(index: number): void {
    const currentUsers = [...this.users()];
    currentUsers[index].status = currentUsers[index].status === 'active' ? 'inactive' : 'active';
    this.users.set(currentUsers);
  }
}
