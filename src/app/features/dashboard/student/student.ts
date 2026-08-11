import { Component, OnInit, inject, signal, model } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { StudentService } from '../../../core/services/student';
import { StudentClassService } from '../../../core/services/student-class';
import { StudentFeeService } from '../../../core/services/student-fee';
import { StudentNoticeService } from '../../../core/services/student-notice';
import { StudentTeacherService } from '../../../core/services/student-teacher';
import { StudentAssignmentService } from '../../../core/services/student-assignment';
import { environment } from '@env/environment';

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
  private studentService = inject(StudentService);
  private studentClassService = inject(StudentClassService);
  private studentFeeService = inject(StudentFeeService);
  private studentNoticeService = inject(StudentNoticeService);
  private studentTeacherService = inject(StudentTeacherService);
  private studentAssignmentService = inject(StudentAssignmentService);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Active page passed from parent dashboard (two-way binding model)
  activePage = model<string>('dashboard');

  backendMessage = signal<string>('Verifying student access...');
  isAuthorized = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Admission reminder modal
  showAdmissionModal = signal<boolean>(false);

  // Real class info
  myClassInfo = signal<{ class_name?: string; section?: string; department?: string; gr_number?: string } | null>(null);

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
  feeHistory = signal<any[]>([]);

  // Notices
  notices = signal<any[]>([]);

  // Upcoming Tests (from API)
  upcomingTests = signal<any[]>([]);

  // Test Results (from API)
  testResults = signal<any[]>([]);

  // Real timetable & today schedule signals
  studentTimetable = signal<any>(null);
  todaySchedule = signal<any[]>([]);
  todayName = signal<string>('');

  getStudentTimetableSlot(day: string, periodNo: number): any {
    const schedule = this.studentTimetable()?.schedule || [];
    return schedule.find((s: any) => s.day === day && s.period_no === periodNo) || null;
  }

  getSlotClass(slot: any): string {
    if (!slot) return '';
    const map: Record<string, string> = {
      'Lecture': 'slot-lecture',
      'Test': 'slot-test',
      'Practical': 'slot-practical',
      'Break': 'slot-break',
      'Free Period': 'slot-free'
    };
    return map[slot.slot_type] || '';
  }

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/dashboard/student`).subscribe({
      next: (res) => {
        this.backendMessage.set(res.message || 'Access granted!');
        this.isAuthorized.set(true);
        this.isLoading.set(false);
        this.loadStudentData();
      },
      error: (err) => {
        this.backendMessage.set(err.error?.detail || 'Unauthorized student access!');
        this.isAuthorized.set(false);
        this.isLoading.set(false);
      }
    });
  }

  loadStudentData(): void {
    this.authService.getMe().subscribe({
      next: (profile) => {
        if (profile?.admission_status === 'NOT_SUBMITTED') {
          this.showAdmissionModal.set(true);
          return;
        }

        if (profile?.admission_status === 'APPROVED') {
          this.studentService.getStudentDetails(profile.id).subscribe({
            next: (details) => {
              this.myClassInfo.set({
                class_name: details.class_name,
                section: details.section,
                department: details.department,
                gr_number: details.gr_number
              });
            },
            error: () => console.error('Could not fetch real class details')
          });

          this.studentClassService.getStudentClass().subscribe({
            next: (data) => {
              if (data) {
                if (data.class_information) {
                  this.myClassInfo.set({
                    class_name: data.class_information.class_name,
                    section: data.class_information.section_name,
                    department: profile.department || '',
                    gr_number: profile.gr_number || ''
                  });
                }
                this.todayName.set(data.today || '');
                this.todaySchedule.set(data.today_schedule || []);
                this.studentTimetable.set(data.timetable || null);
              }
            },
            error: (err) => console.error('Could not fetch student class data', err)
          });

          this.studentFeeService.getFeeHistory().subscribe({
            next: (fees) => {
              this.feeHistory.set(fees.map((fee: any, index: number) => ({
                id: fee.voucher_number || `FEE-${index + 1}`,
                semester: fee.semester || 'N/A',
                amount: fee.amount || 0,
                paid: fee.paid_amount || 0,
                date: fee.paid_date || fee.created_at || 'N/A',
                status: fee.status || 'UNPAID',
                method: fee.payment_method || 'N/A'
              })));
            },
            error: (err) => console.error('Could not fetch fee history', err)
          });

          this.studentNoticeService.getNotices().subscribe({
            next: (notices) => {
              this.notices.set(notices.map((notice: any) => ({
                id: notice.notice_id || notice._id || '',
                title: notice.title || notice.subject || 'Notice',
                category: notice.category || notice.type || 'General',
                date: notice.created_at || notice.date || 'N/A',
                priority: notice.priority || 'normal',
                body: notice.body || notice.description || ''
              })));
            },
            error: (err) => console.error('Could not fetch notices', err)
          });

          this.studentTeacherService.getStudentTeachers().subscribe({
            next: (teachers) => {
              this.teachers.set(teachers.map((teacher: any) => ({
                name: teacher.teacher_name || 'Unknown',
                subject: teacher.subject || 'Unknown',
                email: teacher.email || 'N/A',
                status: teacher.teacher_status || 'Unknown',
                office: teacher.office || 'N/A',
                todayPresent: teacher.teacher_status?.toLowerCase() === 'active'
              })));
            },
            error: (err) => console.error('Could not fetch student teachers', err)
          });

          // Load upcoming tests
          this.studentAssignmentService.getUpcomingTests().subscribe({
            next: (tests) => this.upcomingTests.set(tests),
            error: (err) => console.error('Could not fetch upcoming tests', err)
          });

          // Load test results
          this.studentAssignmentService.getResults().subscribe({
            next: (results) => this.testResults.set(results),
            error: (err) => console.error('Could not fetch test results', err)
          });
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
