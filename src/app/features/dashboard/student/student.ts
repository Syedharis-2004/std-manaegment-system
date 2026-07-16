import { Component, OnInit, inject, signal, model } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

import {
  LucideCheckCircle,
  LucideBookOpen,
  LucideClock,
  LucideUser,
  LucideCreditCard,
  LucideBell,
  LucideClipboardList,
  LucideAlertCircle,
  LucideCheckSquare,
  LucideCalendar,
  LucideInfo,
  LucideAlertTriangle
} from '@lucide/angular';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    CommonModule,
    LucideCheckCircle,
    LucideBookOpen,
    LucideClock,
    LucideUser,
    LucideCreditCard,
    LucideBell,
    LucideClipboardList,
    LucideAlertCircle,
    LucideCheckSquare,
    LucideCalendar,
    LucideInfo,
    LucideAlertTriangle
  ],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class StudentDashboard implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8000';

  // Active page passed from parent dashboard (two-way binding model)
  activePage = model<string>('dashboard');

  backendMessage = signal<string>('Verifying student access...');
  isAuthorized = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Admission reminder modal
  showAdmissionModal = signal<boolean>(false);

  // Selected teacher for info panel
  selectedTeacher = signal<any>(null);

  // Simulated premium interactive student metrics
  attendedClasses = signal<number>(86);
  totalClasses = signal<number>(92);
  attendance = signal<number>(94);
  
  courses = signal([
    { code: 'CS-301', name: 'Database Systems', instructor: 'Dr. Sarah Connor', progress: 75, grade: 'A-' },
    { code: 'MATH-202', name: 'Linear Algebra', instructor: 'Prof. Alan Turing', progress: 90, grade: 'A' },
    { code: 'CS-310', name: 'Artificial Intelligence', instructor: 'Dr. John McCarthy', progress: 60, grade: 'B+' },
    { code: 'ENG-150', name: 'Creative Writing', instructor: 'Mary Shelley', progress: 100, grade: 'A+' }
  ]);

  assignments = signal([
    { title: 'Project Proposal', course: 'CS-310', due: 'Tomorrow', status: 'pending', urgent: true },
    { title: 'Homework 4: Vector Spaces', course: 'MATH-202', due: 'In 3 days', status: 'completed', urgent: false },
    { title: 'SQL Lab 3', course: 'CS-301', due: 'In 5 days', status: 'pending', urgent: false },
    { title: 'Essay Draft — Gothic Novel', course: 'ENG-150', due: 'In 7 days', status: 'pending', urgent: false },
    { title: 'AI Midterm Report', course: 'CS-310', due: 'In 10 days', status: 'pending', urgent: false },
    { title: 'Linear Algebra Quiz 2', course: 'MATH-202', due: 'Completed', status: 'completed', urgent: false }
  ]);

  // Class Detail — Subjects
  subjects = signal([
    { name: 'Database Systems', code: 'CS-301', time: 'Mon / Wed  08:00–09:30', room: 'Lab B-12', status: 'Ongoing', credits: 3 },
    { name: 'Linear Algebra', code: 'MATH-202', time: 'Tue / Thu  10:00–11:30', room: 'Hall 204', status: 'Ongoing', credits: 3 },
    { name: 'Artificial Intelligence', code: 'CS-310', time: 'Mon / Fri  12:00–13:30', room: 'Lab C-08', status: 'Ongoing', credits: 3 },
    { name: 'Creative Writing', code: 'ENG-150', time: 'Wed  14:00–16:00', room: 'Arts 105', status: 'Completed', credits: 2 }
  ]);

  // Class Detail — Teachers
  teachers = signal([
    { name: 'Dr. Sarah Connor', subject: 'Database Systems', email: 'sarah.connor@je.edu', status: 'Available', office: 'CS Building, Room 310', todayPresent: true },
    { name: 'Prof. Alan Turing', subject: 'Linear Algebra', email: 'alan.turing@je.edu', status: 'In Lecture', office: 'Math Block, Room 204', todayPresent: true },
    { name: 'Dr. John McCarthy', subject: 'Artificial Intelligence', email: 'j.mccarthy@je.edu', status: 'Available', office: 'CS Building, Room 405', todayPresent: true },
    { name: 'Mary Shelley', subject: 'Creative Writing', email: 'm.shelley@je.edu', status: 'On Leave', office: 'Arts Wing, Room 108', todayPresent: false }
  ]);

  // Attendance Detail Mock Data
  subjectAttendance = signal([
    { code: 'CS-301', name: 'Database Systems', attended: 19, total: 20, percentage: 95 },
    { code: 'MATH-202', name: 'Linear Algebra', attended: 18, total: 20, percentage: 90 },
    { code: 'CS-310', name: 'Artificial Intelligence', attended: 17, total: 18, percentage: 94 },
    { code: 'ENG-150', name: 'Creative Writing', attended: 12, total: 12, percentage: 100 }
  ]);

  dailyAttendanceLog = signal([
    { date: 'July 15, 2026', subject: 'Database Systems', code: 'CS-301', time: '08:00 - 09:30', status: 'Present' },
    { date: 'July 15, 2026', subject: 'Linear Algebra', code: 'MATH-202', time: '10:00 - 11:30', status: 'Present' },
    { date: 'July 14, 2026', subject: 'Artificial Intelligence', code: 'CS-310', time: '12:00 - 13:30', status: 'Present' },
    { date: 'July 13, 2026', subject: 'Database Systems', code: 'CS-301', time: '08:00 - 09:30', status: 'Present' },
    { date: 'July 13, 2026', subject: 'Linear Algebra', code: 'MATH-202', time: '10:00 - 11:30', status: 'Excused' },
    { date: 'July 12, 2026', subject: 'Artificial Intelligence', code: 'CS-310', time: '12:00 - 13:30', status: 'Present' },
    { date: 'July 10, 2026', subject: 'Database Systems', code: 'CS-301', time: '08:00 - 09:30', status: 'Present' },
    { date: 'July 10, 2026', subject: 'Linear Algebra', code: 'MATH-202', time: '10:00 - 11:30', status: 'Present' },
    { date: 'July 09, 2026', subject: 'Artificial Intelligence', code: 'CS-310', time: '12:00 - 13:30', status: 'Absent' }
  ]);

  // Fee History
  feeHistory = signal([
    { id: 'INV-2026-04', semester: 'Spring 2026', amount: 45000, paid: 45000, date: 'Jan 15, 2026', status: 'Paid', method: 'Bank Transfer' },
    { id: 'INV-2025-08', semester: 'Fall 2025', amount: 45000, paid: 45000, date: 'Aug 10, 2025', status: 'Paid', method: 'Online Portal' },
    { id: 'INV-2025-02', semester: 'Spring 2025', amount: 42000, paid: 42000, date: 'Jan 12, 2025', status: 'Paid', method: 'Bank Transfer' },
    { id: 'INV-2024-08', semester: 'Fall 2024', amount: 42000, paid: 30000, date: 'Aug 08, 2024', status: 'Partial', method: 'Online Portal' },
    { id: 'INV-2024-02', semester: 'Spring 2024', amount: 38000, paid: 38000, date: 'Jan 11, 2024', status: 'Paid', method: 'Bank Transfer' }
  ]);

  // Notices
  notices = signal([
    {
      id: 1,
      title: 'Mid-Semester Examination Schedule Released',
      category: 'Exam',
      date: 'July 14, 2026',
      priority: 'high',
      body: 'The mid-semester examination schedule for Spring 2026 has been officially released. All students are required to check their subject-wise slots on the student portal. Exams will commence from July 28, 2026.'
    },
    {
      id: 2,
      title: 'Library Hours Extended During Exam Period',
      category: 'Facility',
      date: 'July 13, 2026',
      priority: 'normal',
      body: 'The university library will remain open until 11:00 PM from July 20 to August 10, 2026 to support students during the examination period. Study rooms can be booked via the library portal.'
    },
    {
      id: 3,
      title: 'Fee Submission Deadline — Spring 2026',
      category: 'Finance',
      date: 'July 10, 2026',
      priority: 'high',
      body: 'Last date for semester fee submission is July 20, 2026. Students who fail to pay by the deadline will incur a late fine of PKR 500/day. Contact the accounts office for payment plans.'
    },
    {
      id: 4,
      title: 'Guest Lecture: AI in Healthcare — Dr. Fei-Fei Li',
      category: 'Event',
      date: 'July 8, 2026',
      priority: 'normal',
      body: 'A guest lecture titled "AI in Modern Healthcare" will be held on July 22, 2026 in Auditorium Hall A. All CS and related department students are encouraged to attend. Registration opens tomorrow.'
    },
    {
      id: 5,
      title: 'Campus Maintenance — Water Supply Shutdown',
      category: 'Facility',
      date: 'July 6, 2026',
      priority: 'low',
      body: 'Due to scheduled maintenance, water supply will be temporarily unavailable on July 17, 2026 from 9:00 AM to 1:00 PM in Blocks A and B. Plan accordingly and carry water bottles.'
    }
  ]);

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/dashboard/student`).subscribe({
      next: (res) => {
        this.backendMessage.set(res.message || 'Access granted!');
        this.isAuthorized.set(true);
        this.isLoading.set(false);
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

  viewAttendanceDetails(): void {
    this.activePage.set('attendance-detail');
  }

  getTeacherForSubject(subjectName: string): any {
    return this.teachers().find(t => t.subject === subjectName) || null;
  }

  selectTeacher(subjectName: string): void {
    const teacher = this.getTeacherForSubject(subjectName);
    this.selectedTeacher.set(teacher);
  }

  closeTeacherPanel(): void {
    this.selectedTeacher.set(null);
  }

  getTeacherInitials(name: string): string {
    return name.split(' ').slice(-2).map(n => n[0]).join('');
  }

  getTotalFees(): number {
    return this.feeHistory().reduce((sum, f) => sum + f.amount, 0);
  }

  getTotalPaid(): number {
    return this.feeHistory().reduce((sum, f) => sum + f.paid, 0);
  }

  getPendingAssignments(): number {
    return this.assignments().filter(a => a.status === 'pending').length;
  }

  getCompletedAssignments(): number {
    return this.assignments().filter(a => a.status === 'completed').length;
  }
}
