import { Component, OnInit, inject, signal, model } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdmissionService } from '../../../core/services/admission';
import {
  LucideUsers, LucideUserCheck,
  LucideSchool, LucideCreditCard, LucideUpload, LucideCheckCircle,
  LucideXCircle
} from '@lucide/angular';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    LucideUsers, LucideUserCheck,
    LucideSchool, LucideCreditCard, LucideUpload, LucideCheckCircle,
    LucideXCircle
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  private admissionService = inject(AdmissionService);
  private apiUrl = 'http://localhost:8000';

  // Two-way binding from parent sidebar
  activePage = model<string>('dashboard');

  backendMessage = signal<string>('Verifying administrator access...');
  isAuthorized = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Dashboard metrics
  totalUsers = signal<number>(142);
  activeSessions = signal<number>(24);
  serverHealth = signal<string>('99.98%');

  // Students mock data
  students = signal([
    { id: 'S-001', name: 'Alice Smith',   email: 'alice@student.edu',  class: 'CS-4A', status: 'active',   fee: 'Paid' },
    { id: 'S-002', name: 'John Doe',      email: 'jdoe@student.edu',   class: 'CS-3B', status: 'inactive', fee: 'Pending' },
    { id: 'S-003', name: 'Fatima Noor',   email: 'fatima@student.edu', class: 'SE-2A', status: 'active',   fee: 'Paid' },
    { id: 'S-004', name: 'Ali Hassan',    email: 'ali@student.edu',    class: 'CS-4A', status: 'active',   fee: 'Overdue' },
    { id: 'S-005', name: 'Sara Malik',    email: 'sara@student.edu',   class: 'IT-1B', status: 'active',   fee: 'Paid' }
  ]);

  // Teachers mock data
  teachers = signal([
    { id: 'T-001', name: 'Dr. Sarah Connor',   subject: 'Database Systems',    email: 'sconnor@je.edu',   status: 'active',   todayPresent: true },
    { id: 'T-002', name: 'Prof. Alan Turing',  subject: 'Linear Algebra',      email: 'aturing@je.edu',   status: 'active',   todayPresent: true },
    { id: 'T-003', name: 'Dr. John McCarthy',  subject: 'Artificial Intelligence', email: 'jmccarthy@je.edu', status: 'active', todayPresent: false },
    { id: 'T-004', name: 'Mary Shelley',       subject: 'Creative Writing',    email: 'mshelley@je.edu',  status: 'on-leave', todayPresent: false }
  ]);

  // Staff mock data
  staff = signal([
    { id: 'ST-001', name: 'Imran Butt',    role: 'Lab Technician',  email: 'imran@je.edu',   status: 'active' },
    { id: 'ST-002', name: 'Nadia Iqbal',   role: 'Librarian',       email: 'nadia@je.edu',   status: 'active' },
    { id: 'ST-003', name: 'Zaid Qureshi',  role: 'Security Guard',  email: 'zaid@je.edu',    status: 'active' },
    { id: 'ST-004', name: 'Amna Raza',     role: 'Admin Officer',   email: 'amna@je.edu',    status: 'inactive' }
  ]);

  // Classes mock data
  classes = signal([
    { id: 'CS-4A', program: 'Computer Science',     semester: '7th', students: 32, teacher: 'Dr. Sarah Connor',  room: 'CS-301' },
    { id: 'CS-3B', program: 'Computer Science',     semester: '5th', students: 28, teacher: 'Prof. Alan Turing', room: 'CS-204' },
    { id: 'SE-2A', program: 'Software Engineering', semester: '3rd', students: 35, teacher: 'Dr. John McCarthy', room: 'SE-101' },
    { id: 'IT-1B', program: 'Information Technology', semester: '1st', students: 40, teacher: 'Mary Shelley',   room: 'IT-102' }
  ]);

  // Fee records mock data
  feeRecords = signal([
    { id: 'S-001', name: 'Alice Smith',  class: 'CS-4A', amount: 45000, paid: 45000, due: 0,     status: 'Paid',    dueDate: 'Jan 15, 2026' },
    { id: 'S-002', name: 'John Doe',     class: 'CS-3B', amount: 45000, paid: 0,     due: 45000, status: 'Pending', dueDate: 'Jan 15, 2026' },
    { id: 'S-003', name: 'Fatima Noor', class: 'SE-2A', amount: 42000, paid: 42000, due: 0,     status: 'Paid',    dueDate: 'Jan 15, 2026' },
    { id: 'S-004', name: 'Ali Hassan',   class: 'CS-4A', amount: 45000, paid: 20000, due: 25000, status: 'Overdue', dueDate: 'Dec 31, 2025' },
    { id: 'S-005', name: 'Sara Malik',   class: 'IT-1B', amount: 38000, paid: 38000, due: 0,     status: 'Paid',    dueDate: 'Jan 15, 2026' }
  ]);

  uploadCategory = signal<string>('students');
  uploadFile = signal<File | null>(null);
  uploadSuccess = signal<boolean>(false);
  uploadError = signal<string | null>(null);

  users = signal([
    { name: 'Dr. Sarah Connor', email: 'sconnor@institution.edu', role: 'teacher', status: 'active' },
    { name: 'Alice Smith',      email: 'asmith@student.edu',      role: 'student', status: 'active' },
    { name: 'John Doe',         email: 'jdoe@student.edu',        role: 'student', status: 'inactive' },
    { name: 'Haris Khan',       email: 'haris@admin.edu',         role: 'admin',   status: 'active' }
  ]);

  systemLogs = signal([
    { event: 'User register successful',              user: 'jdoe@student.edu', time: '10 mins ago',  severity: 'info' },
    { event: 'Database backup completed',             user: 'System Cron',      time: '1 hour ago',   severity: 'success' },
    { event: 'Unauthorized endpoint request blocked', user: 'Anonymous',        time: '3 hours ago',  severity: 'warning' }
  ]);

  pendingAdmissions = signal<any[]>([]);
  toastMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/dashboard/admin`).subscribe({
      next: (res) => {
        this.backendMessage.set(res.message || 'Access granted!');
        this.isAuthorized.set(true);
        this.isLoading.set(false);
        this.loadPendingAdmissions();
      },
      error: (err) => {
        this.backendMessage.set(err.error?.detail || 'Unauthorized administrator access!');
        this.isAuthorized.set(false);
        this.isLoading.set(false);
      }
    });
  }

  loadPendingAdmissions(): void {
    this.admissionService.getPendingAdmissions().subscribe({
      next: (data) => {
        this.pendingAdmissions.set(data);
      },
      error: (err) => {
        console.error('Failed to load pending admissions', err);
      }
    });
  }

  approveAdmission(userId: string): void {
    this.admissionService.approveAdmission(userId).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Admission approved successfully!');
        this.loadPendingAdmissions();
      },
      error: (err) => {
        this.showToast(err.error?.detail || 'Failed to approve admission');
        console.error('Approve admission error:', err);
      }
    });
  }

  rejectAdmission(userId: string): void {
    this.admissionService.rejectAdmission(userId).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Admission rejected.');
        this.loadPendingAdmissions();
      },
      error: (err) => {
        this.showToast(err.error?.detail || 'Failed to reject admission');
        console.error('Reject admission error:', err);
      }
    });
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  toggleUserStatus(index: number): void {
    const currentUsers = [...this.users()];
    currentUsers[index].status = currentUsers[index].status === 'active' ? 'inactive' : 'active';
    this.users.set(currentUsers);
  }
}

