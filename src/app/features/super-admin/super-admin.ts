import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth';
import { AdminService } from '../../core/services/admin';
import { StudentService } from '../../core/services/student';
import { TeacherService } from '../../core/services/teacher';
import { StaffService } from '../../core/services/staff';
import { AdmissionService } from '../../core/services/admission';
import { ProfileService } from '../../core/services/profile';
import {
  LucideLayoutDashboard,
  LucideSchool,
  LucideUsers,
  LucideLogOut,
  LucideBuilding2,
  LucideGraduationCap,
  LucideChevronRight,
  LucideTrendingUp,
  LucideBookOpen,
  LucideUserCheck,
  LucideAlertCircle,
  LucideCheckCircle,
  LucideClock,
  LucideSearch,
  LucideStar,
  LucideUserCog,
  LucideRefreshCw
} from '@lucide/angular';

type Institution = 'je-academy' | 'kids-academy';
type Page = 'dashboard' | 'class' | 'users' | 'admissions';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [
    CommonModule,
    LucideLayoutDashboard,
    LucideSchool,
    LucideUsers,
    LucideLogOut,
    LucideBuilding2,
    LucideGraduationCap,
    LucideChevronRight,
    LucideTrendingUp,
    LucideBookOpen,
    LucideUserCheck,
    LucideAlertCircle,
    LucideCheckCircle,
    LucideClock,
    LucideSearch,
    LucideStar,
    LucideUserCog,
    LucideRefreshCw
  ],
  templateUrl: './super-admin.html',
  styleUrl: './super-admin.css'
})
export class SuperAdmin implements OnInit {
  private authService    = inject(AuthService);
  private adminService   = inject(AdminService);
  private studentService = inject(StudentService);
  private teacherService = inject(TeacherService);
  private staffService   = inject(StaffService);
  private admissionService = inject(AdmissionService);
  private profileService = inject(ProfileService);
  private router         = inject(Router);

  // Phase control
  selectedInstitution = signal<Institution | null>('je-academy');
  activePage = signal<Page>('dashboard');
  userRoleFilter = signal<string | null>(null);

  currentUser = signal<any>(null);
  userProfile = signal<any>(null);

  // Live stats from /dashboard/super-admin
  liveStats = signal<{
    totalStudents: number;
    totalTeachers: number;
    totalStaff: number;
    totalAdmins: number;
    totalClasses: number;
    pendingAdmissions: number;
  }>({
    totalStudents: 0,
    totalTeachers: 0,
    totalStaff: 0,
    totalAdmins: 0,
    totalClasses: 0,
    pendingAdmissions: 0
  });

  // Live user lists from APIs
  liveUsers = signal<any[]>([]);
  liveAdmissions = signal<any[]>([]);

  isLoadingData = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Get data from live stats
  get data() {
    const stats = this.liveStats();
    return {
      stats: {
        totalStudents: stats.totalStudents,
        totalTeachers: stats.totalTeachers,
        totalClasses: stats.totalClasses,
        pendingAdmissions: stats.pendingAdmissions,
        totalStaff: stats.totalStaff
      },
      classes: [
        { id: 'CS-4A', program: 'Computer Science',        semester: '7th', students: 38, teacher: 'Dr. Sarah Connor',   room: 'CS-301', status: 'active' },
        { id: 'CS-3B', program: 'Computer Science',        semester: '5th', students: 34, teacher: 'Prof. Alan Turing',  room: 'CS-204', status: 'active' },
        { id: 'SE-2A', program: 'Software Engineering',    semester: '3rd', students: 41, teacher: 'Dr. John McCarthy',  room: 'SE-101', status: 'active' },
        { id: 'IT-1B', program: 'Information Technology', semester: '1st', students: 45, teacher: 'Mary Shelley',       room: 'IT-102', status: 'active' },
        { id: 'BBA-2B', program: 'Business Administration', semester: '3rd', students: 36, teacher: 'Prof. Adam Smith', room: 'BBA-201', status: 'active' },
        { id: 'ECO-1A', program: 'Economics',              semester: '1st', students: 30, teacher: 'Dr. Keynes',         room: 'ECO-103', status: 'inactive' },
      ]
    };
  }

  classSearchQuery    = '';
  userSearchQuery     = '';
  admissionSearchQuery = '';

  get filteredClasses() {
    const query = this.classSearchQuery.toLowerCase().trim();
    if (!query) return this.data.classes;
    return this.data.classes.filter(cls =>
      cls.id.toLowerCase().includes(query) ||
      cls.program.toLowerCase().includes(query) ||
      cls.teacher.toLowerCase().includes(query)
    );
  }

  get filteredUsers() {
    let users = this.liveUsers();

    const roleFilter = this.userRoleFilter();
    if (roleFilter) {
      users = users.filter(u => u.role === roleFilter);
    }

    const query = this.userSearchQuery.toLowerCase().trim();
    if (query) {
      users = users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
    return users;
  }

  get filteredAdmissions() {
    const admissions = this.liveAdmissions();
    const query = this.admissionSearchQuery.toLowerCase().trim();
    if (!query) return admissions;
    return admissions.filter(adm =>
      adm.name.toLowerCase().includes(query) ||
      adm.id.toLowerCase().includes(query) ||
      adm.class.toLowerCase().includes(query)
    );
  }

  onClassSearch(event: Event): void {
    this.classSearchQuery = (event.target as HTMLInputElement).value;
  }

  onUserSearch(event: Event): void {
    this.userSearchQuery = (event.target as HTMLInputElement).value;
  }

  onAdmissionSearch(event: Event): void {
    this.admissionSearchQuery = (event.target as HTMLInputElement).value;
  }

  get institutionLabel() {
    return this.selectedInstitution() === 'kids-academy' ? 'Kids Academy' : 'J.E Academy';
  }

  get institutionAccent() {
    return this.selectedInstitution() === 'kids-academy' ? 'kids' : 'je';
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser.set(user);
    this.fetchBackendData();
  }

  fetchBackendData(): void {
    this.isLoadingData.set(true);
    this.errorMessage.set(null);

    // Fetch profile (non-blocking)
    this.profileService.getProfile().subscribe({
      next: (profile) => this.userProfile.set(profile),
      error: () => {}
    });

    // Parallel fetch: stats + all user lists + pending admissions
    forkJoin({
      stats:      this.adminService.getSuperAdminDashboard().pipe(catchError(() => of(null))),
      admins:     this.adminService.getAdmins().pipe(catchError(() => of([]))),
      students:   this.studentService.getStudents().pipe(catchError(() => of([]))),
      teachers:   this.teacherService.getTeachers().pipe(catchError(() => of([]))),
      staff:      this.staffService.getStaff().pipe(catchError(() => of([]))),
      admissions: this.admissionService.getPendingAdmissions().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ stats, admins, students, teachers, staff, admissions }) => {
        // Update stats signal
        if (stats) {
          this.liveStats.set({
            totalStudents:    stats.total_students    ?? 0,
            totalTeachers:    stats.total_teachers    ?? 0,
            totalStaff:       stats.total_staff       ?? 0,
            totalAdmins:      stats.total_admins      ?? 0,
            totalClasses:     stats.total_classes     ?? 6,
            pendingAdmissions: (admissions as any[]).length
          });
        }

        // Map admins → unified user format
        const mappedAdmins = (admins as any[]).map((a, i) => ({
          id:     a._id || `A-${i + 1}`.padStart(5, '0'),
          name:   `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'Admin User',
          email:  a.email || '',
          role:   'admin',
          status: (a.status || 'active').toLowerCase() === 'approved' ? 'active' : (a.status || 'active').toLowerCase(),
          joined: a.created_at ? new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'
        }));

        // Map students → unified user format
        const mappedStudents = (students as any[]).map((s, i) => ({
          id:     s._id || `S-${i + 1}`.padStart(5, '0'),
          name:   `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.name || 'Student',
          email:  s.email || '',
          role:   'student',
          status: (s.admission_status || 'active').toLowerCase() === 'approved' ? 'active' : 'active',
          joined: s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Sep 2024'
        }));

        // Map teachers → unified user format
        const mappedTeachers = (teachers as any[]).map((t, i) => ({
          id:     t._id || `T-${i + 1}`.padStart(5, '0'),
          name:   `${t.first_name || ''} ${t.last_name || ''}`.trim() || t.name || 'Teacher',
          email:  t.email || '',
          role:   'teacher',
          status: (t.teacher_status || 'active').toLowerCase() === 'active' ? 'active' : 'inactive',
          joined: t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2023'
        }));

        // Map staff → unified user format
        const mappedStaff = (staff as any[]).map((st, i) => ({
          id:     st._id || `ST-${i + 1}`.padStart(5, '0'),
          name:   `${st.first_name || ''} ${st.last_name || ''}`.trim() || st.name || 'Staff',
          email:  st.email || '',
          role:   'staff',
          status: (st.staff_status || 'active').toLowerCase() === 'active' ? 'active' : 'inactive',
          joined: st.created_at ? new Date(st.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2020'
        }));

        // Combine all users
        this.liveUsers.set([
          ...mappedAdmins,
          ...mappedTeachers,
          ...mappedStaff,
          ...mappedStudents
        ]);

        // Map pending admissions
        const mappedAdmissions = (admissions as any[]).map((adm, i) => ({
          id:     adm._id || `APP-${i + 1}`.padStart(6, '0'),
          name:   `${adm.first_name || ''} ${adm.last_name || ''}`.trim() || adm.name || 'Applicant',
          class:  adm.program || adm.class_applied || adm.class || 'N/A',
          date:   adm.created_at ? new Date(adm.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
          status: adm.admission_status?.toLowerCase() || 'pending'
        }));
        this.liveAdmissions.set(mappedAdmissions);

        // Update pendingAdmissions count in stats from actual list
        const current = this.liveStats();
        this.liveStats.set({ ...current, pendingAdmissions: mappedAdmissions.length });

        this.isLoadingData.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load dashboard data. Please refresh.');
        this.isLoadingData.set(false);
      }
    });
  }

  selectInstitution(inst: Institution): void {
    this.selectedInstitution.set(inst);
    this.activePage.set('dashboard');
  }

  navigate(page: Page, roleFilter: string | null = null): void {
    this.userRoleFilter.set(roleFilter);
    this.userSearchQuery = '';
    this.classSearchQuery = '';
    this.admissionSearchQuery = '';
    this.activePage.set(page);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  backToSelect(): void {
    this.selectedInstitution.set(null);
    this.activePage.set('dashboard');
  }
}
