import { Component, OnInit, inject, signal, model, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { AdmissionService } from '../../../core/services/admission';
import { StudentService } from '../../../core/services/student';
import { ClassService } from '../../../core/services/class';
import { StaffService } from '../../../core/services/staff';
import { TeacherService } from '../../../core/services/teacher';
import {
  LucideUsers, LucideUserCheck,
  LucideSchool, LucideCreditCard, LucideUpload, LucideCheckCircle,
  LucideXCircle, LucideUserCog, LucideClock, LucideSearch,
  LucideEye, LucideCheck, LucideX, LucideSmartphone,
  LucideUser, LucidePhone, LucideFileText
} from '@lucide/angular';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    LucideUsers, LucideUserCheck,
    LucideSchool, LucideCreditCard, LucideUpload, LucideCheckCircle,
    LucideXCircle, LucideUserCog, LucideClock, LucideSearch,
    LucideEye, LucideCheck, LucideX, LucideSmartphone,
    LucideUser, LucidePhone, LucideFileText
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  private admissionService = inject(AdmissionService);
  private studentService = inject(StudentService);
  private classService = inject(ClassService);
  private staffService = inject(StaffService);
  private teacherService = inject(TeacherService);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8000';

  // Two-way binding from parent sidebar
  activePage = model<string>('dashboard');

  backendMessage = signal<string>('Verifying administrator access...');
  isAuthorized = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Dashboard metrics
  totalUsers = signal<number>(0);
  activeSessions = signal<number>(24);
  serverHealth = signal<string>('99.98%');

  // Signals for dynamic data
  students = signal<any[]>([]);
  teachers = signal<any[]>([]);
  staff = signal<any[]>([]);
  classes = signal<any[]>([]);

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

  studentSearchQuery = '';
  teacherSearchQuery = '';
  staffSearchQuery = '';
  classSearchQuery = '';

  get filteredStudents() {
    const query = this.studentSearchQuery.toLowerCase().trim();
    if (!query) return this.students();
    return this.students().filter(s => 
      (s.name || '').toLowerCase().includes(query) || 
      (s.id || '').toLowerCase().includes(query) || 
      (s.class || '').toLowerCase().includes(query)
    );
  }

  get filteredTeachers() {
    const query = this.teacherSearchQuery.toLowerCase().trim();
    if (!query) return this.teachers();
    return this.teachers().filter(t => 
      (t.name || '').toLowerCase().includes(query) || 
      (t.id || '').toLowerCase().includes(query) || 
      (t.subject || '').toLowerCase().includes(query)
    );
  }

  get filteredStaff() {
    const query = this.staffSearchQuery.toLowerCase().trim();
    if (!query) return this.staff();
    return this.staff().filter(s => 
      (s.name || '').toLowerCase().includes(query) || 
      (s.id || '').toLowerCase().includes(query) || 
      (s.role || '').toLowerCase().includes(query)
    );
  }

  get filteredClasses() {
    const query = this.classSearchQuery.toLowerCase().trim();
    if (!query) return this.classes();
    return this.classes().filter(c => 
      (c.id || '').toLowerCase().includes(query) || 
      (c.program || '').toLowerCase().includes(query) || 
      (c.teacher || '').toLowerCase().includes(query)
    );
  }

  onStudentSearch(event: Event): void { this.studentSearchQuery = (event.target as HTMLInputElement).value; }
  onTeacherSearch(event: Event): void { this.teacherSearchQuery = (event.target as HTMLInputElement).value; }
  onStaffSearch(event: Event): void { this.staffSearchQuery = (event.target as HTMLInputElement).value; }
  onClassSearch(event: Event): void { this.classSearchQuery = (event.target as HTMLInputElement).value; }

  // Create modals
  showCreateModal = signal<boolean>(false);
  createUserRole = signal<'student' | 'teacher' | 'staff' | 'class'>('student');

  // Student create form
  newStudent = {
    first_name: '', middle_name: '', last_name: '',
    father_name: '', mobile_number: '', email: '',
    password: '', confirm_password: '', role: 'student' as const
  };

  // Teacher create form
  newTeacher = {
    first_name: '', middle_name: '', last_name: '',
    father_name: '', mobile_number: '', email: '',
    password: '', confirm_password: '',
    cnic: '', qualification: '', experience: '', subject: '', address: ''
  };

  // Staff create form
  newStaff = {
    first_name: '', middle_name: '', last_name: '',
    father_name: '', mobile_number: '', email: '',
    cnic: '', designation: '', address: ''
  };

  // Class create form
  newClass = {
    class_name: '', section_name: '', starting_gr: '',
    start_time: '', end_time: '', status: 'ACTIVE'
  };

  // Class edit modal
  showEditClassModal = signal<boolean>(false);
  editingClass = signal<any | null>(null);
  editClassForm = { start_time: '', end_time: '', status: 'ACTIVE' };

  // Detail modals
  showStudentDetail = signal<boolean>(false);
  selectedStudent = signal<any | null>(null);
  showTeacherDetail = signal<boolean>(false);
  selectedTeacher = signal<any | null>(null);
  showStaffDetail = signal<boolean>(false);
  selectedStaffMember = signal<any | null>(null);

  openCreateModal(role: 'student' | 'teacher' | 'staff' | 'class') {
    this.createUserRole.set(role);
    this.newStudent = { first_name: '', middle_name: '', last_name: '', father_name: '', mobile_number: '', email: '', password: '', confirm_password: '', role: 'student' };
    this.newTeacher = { first_name: '', middle_name: '', last_name: '', father_name: '', mobile_number: '', email: '', password: '', confirm_password: '', cnic: '', qualification: '', experience: '', subject: '', address: '' };
    this.newStaff = { first_name: '', middle_name: '', last_name: '', father_name: '', mobile_number: '', email: '', cnic: '', designation: '', address: '' };
    this.newClass = { class_name: '', section_name: '', starting_gr: '', start_time: '', end_time: '', status: 'ACTIVE' };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  onCreateUserSubmit() {
    const role = this.createUserRole();

    if (role === 'student') {
      this.authService.register(this.newStudent).subscribe({
        next: () => {
          this.showToast('Student registered successfully!');
          this.loadDashboardData();
          this.closeCreateModal();
        },
        error: (err) => {
          this.showToast(err.message || 'Failed to register student');
        }
      });
      return;
    }

    if (role === 'teacher') {
      const formData = new FormData();
      Object.entries(this.newTeacher).forEach(([k, v]) => formData.append(k, v));
      this.teacherService.addTeacher(formData).subscribe({
        next: () => { this.showToast('Teacher created successfully!'); this.loadDashboardData(); this.closeCreateModal(); },
        error: (err) => { this.showToast(err.error?.detail || 'Failed to create teacher'); }
      });
    } else if (role === 'staff') {
      const formData = new FormData();
      Object.entries(this.newStaff).forEach(([k, v]) => formData.append(k, v));
      this.staffService.addStaff(formData).subscribe({
        next: () => { this.showToast('Staff member created successfully!'); this.loadDashboardData(); this.closeCreateModal(); },
        error: (err) => { this.showToast(err.error?.detail || 'Failed to create staff'); }
      });
    } else if (role === 'class') {
      const formData = new FormData();
      Object.entries(this.newClass).forEach(([k, v]) => formData.append(k, v));
      this.classService.addClass(formData).subscribe({
        next: () => { this.showToast('Class created successfully!'); this.loadDashboardData(); this.closeCreateModal(); },
        error: (err) => { this.showToast(err.error?.detail || 'Failed to create class'); }
      });
    }
  }

  // Edit class
  openEditClassModal(cls: any): void {
    this.editingClass.set(cls);
    this.editClassForm = { start_time: cls.start_time || '', end_time: cls.end_time || '', status: cls.status || 'ACTIVE' };
    this.showEditClassModal.set(true);
  }

  closeEditClassModal(): void {
    this.showEditClassModal.set(false);
    setTimeout(() => this.editingClass.set(null), 200);
  }

  onEditClassSubmit(): void {
    const cls = this.editingClass();
    if (!cls) return;
    const formData = new FormData();
    Object.entries(this.editClassForm).forEach(([k, v]) => formData.append(k, v));
    this.classService.updateClass(cls.id, formData).subscribe({
      next: () => { this.showToast('Class updated successfully!'); this.loadDashboardData(); this.closeEditClassModal(); },
      error: (err) => { this.showToast(err.error?.detail || 'Failed to update class'); }
    });
  }

  // View details
  viewStudentDetail(id: string): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        const s = data.find((x: any) => x.user_id === id);
        if (s) { this.selectedStudent.set(s); this.showStudentDetail.set(true); }
      }
    });
  }

  closeStudentDetail(): void {
    this.showStudentDetail.set(false);
    setTimeout(() => this.selectedStudent.set(null), 200);
  }

  viewTeacherDetail(id: string): void {
    this.teacherService.getTeacherDetails(id).subscribe({
      next: (data) => { this.selectedTeacher.set(data); this.showTeacherDetail.set(true); },
      error: (err) => { this.showToast(err.error?.detail || 'Failed to load teacher details'); }
    });
  }

  closeTeacherDetail(): void {
    this.showTeacherDetail.set(false);
    setTimeout(() => this.selectedTeacher.set(null), 200);
  }

  viewStaffDetail(id: string): void {
    this.staffService.getStaffDetails(id).subscribe({
      next: (data) => { this.selectedStaffMember.set(data); this.showStaffDetail.set(true); },
      error: (err) => { this.showToast(err.error?.detail || 'Failed to load staff details'); }
    });
  }

  closeStaffDetail(): void {
    this.showStaffDetail.set(false);
    setTimeout(() => this.selectedStaffMember.set(null), 200);
  }

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

  // --- Admission Queue Enhanced State ---
  admissionSearchQuery = signal<string>('');
  admissionDeptFilter = signal<string>('');
  selectedAdmission = signal<any | null>(null);
  showAdmissionDetail = signal<boolean>(false);

  filteredAdmissions = computed(() => {
    const q = this.admissionSearchQuery().toLowerCase().trim();
    const dept = this.admissionDeptFilter().trim();
    return this.pendingAdmissions().filter(a => {
      const fullName = `${a.first_name || ''} ${a.middle_name || ''} ${a.last_name || ''}`.toLowerCase();
      const matchSearch = !q ||
        fullName.includes(q) ||
        (a.class_name || '').toLowerCase().includes(q) ||
        (a.department || '').toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q);
      const matchDept = !dept || (a.department || '') === dept;
      return matchSearch && matchDept;
    });
  });

  getUniqueAdmissionDepts(): number {
    const depts = new Set(this.pendingAdmissions().map(a => a.department).filter(Boolean));
    return depts.size;
  }

  onAdmissionSearch(event: Event): void {
    this.admissionSearchQuery.set((event.target as HTMLInputElement).value);
  }

  onAdmissionDeptFilter(event: Event): void {
    this.admissionDeptFilter.set((event.target as HTMLSelectElement).value);
  }

  openAdmissionDetail(admission: any): void {
    this.selectedAdmission.set(admission);
    this.showAdmissionDetail.set(true);
  }

  closeAdmissionDetail(): void {
    this.showAdmissionDetail.set(false);
    setTimeout(() => this.selectedAdmission.set(null), 300);
  }

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/dashboard/admin`).subscribe({
      next: (res) => {
        this.backendMessage.set(res.message || 'Access granted!');
        this.isAuthorized.set(true);
        this.isLoading.set(false);
        this.loadPendingAdmissions();
        this.loadDashboardData();
      },
      error: (err) => {
        this.backendMessage.set(err.error?.detail || 'Unauthorized administrator access!');
        this.isAuthorized.set(false);
        this.isLoading.set(false);
      }
    });
  }

  loadDashboardData(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students.set(data.map(s => ({
          id: s.user_id,
          name: `${s.first_name} ${s.middle_name || ''} ${s.last_name}`.replace(/\s+/g, ' ').trim(),
          email: s.email || 'N/A',
          class: `${s.class_name || ''}-${s.section || ''}`,
          status: (s.student_status || 'active').toLowerCase(),
          fee: 'Paid'
        })));
      },
      error: (err) => console.error('Failed to load students:', err)
    });

    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers.set(data.map(t => ({
          id: t.user_id,
          name: `${t.first_name} ${t.middle_name || ''} ${t.last_name}`.replace(/\s+/g, ' ').trim(),
          subject: t.subject || 'N/A',
          email: t.email || 'N/A',
          status: (t.teacher_status || 'active').toLowerCase(),
          todayPresent: true
        })));
      },
      error: (err) => console.error('Failed to load teachers:', err)
    });

    this.staffService.getStaff().subscribe({
      next: (data) => {
        this.staff.set(data.map(s => ({
          id: s.staff_id,
          name: `${s.first_name} ${s.middle_name || ''} ${s.last_name}`.replace(/\s+/g, ' ').trim(),
          role: s.designation || 'N/A',
          email: s.email || 'N/A',
          status: (s.staff_status || 'active').toLowerCase()
        })));
      },
      error: (err) => console.error('Failed to load staff:', err)
    });

    this.classService.getClasses().subscribe({
      next: (data) => {
        this.classes.set(data.map(c => ({
          id: c.class_id,
          program: c.class_name,
          semester: c.section_name,
          students: 0,
          teacher: 'Not Assigned',
          room: 'N/A'
        })));
      },
      error: (err) => console.error('Failed to load classes:', err)
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
        this.loadDashboardData();
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
        this.loadDashboardData();
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

  toggleStudentStatus(id: string, currentStatus: string): void {
    const newStatus = currentStatus.toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.studentService.updateStudentStatus(id, newStatus).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Student status updated successfully!');
        this.loadDashboardData();
      },
      error: (err) => {
        this.showToast(err.error?.detail || 'Failed to update student status');
      }
    });
  }

  toggleTeacherStatus(id: string, currentStatus: string): void {
    const newStatus = currentStatus.toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.teacherService.updateTeacherStatus(id, newStatus).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Teacher status updated successfully!');
        this.loadDashboardData();
      },
      error: (err) => {
        this.showToast(err.error?.detail || 'Failed to update teacher status');
      }
    });
  }

  toggleStaffStatus(id: string, currentStatus: string): void {
    const newStatus = currentStatus.toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.staffService.updateStaffStatus(id, newStatus).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Staff status updated successfully!');
        this.loadDashboardData();
      },
      error: (err) => {
        this.showToast(err.error?.detail || 'Failed to update staff status');
      }
    });
  }

  deleteClass(classId: string): void {
    if (confirm('Are you sure you want to delete this class?')) {
      this.classService.deleteClass(classId).subscribe({
        next: (res) => {
          this.showToast(res.message || 'Class deleted successfully!');
          this.loadDashboardData();
        },
        error: (err) => {
          this.showToast(err.error?.detail || 'Failed to delete class');
        }
      });
    }
  }
}

