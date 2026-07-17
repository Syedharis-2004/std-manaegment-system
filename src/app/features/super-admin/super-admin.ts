import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
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
  LucideFilter,
  LucideMoreVertical,
  LucideStar,
  LucideUserCog
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
    LucideFilter,
    LucideMoreVertical,
    LucideStar,
    LucideUserCog
  ],
  templateUrl: './super-admin.html',
  styleUrl: './super-admin.css'
})
export class SuperAdmin implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Phase control: select institution first, then show dashboard
  selectedInstitution = signal<Institution | null>(null);
  activePage = signal<Page>('dashboard');
  userRoleFilter = signal<string | null>(null);

  currentUser = signal<any>(null);

  // ── Mock Data: J.E Academy ─────────────────────────────────────────────────
  jeData = {
    stats: {
      totalStudents: 842,
      totalTeachers: 64,
      totalClasses: 24,
      pendingAdmissions: 12,
      totalStaff: 18
    },
    classes: [
      { id: 'CS-4A', program: 'Computer Science', semester: '7th', students: 38, teacher: 'Dr. Sarah Connor', room: 'CS-301', status: 'active' },
      { id: 'CS-3B', program: 'Computer Science', semester: '5th', students: 34, teacher: 'Prof. Alan Turing', room: 'CS-204', status: 'active' },
      { id: 'SE-2A', program: 'Software Engineering', semester: '3rd', students: 41, teacher: 'Dr. John McCarthy', room: 'SE-101', status: 'active' },
      { id: 'IT-1B', program: 'Information Technology', semester: '1st', students: 45, teacher: 'Mary Shelley', room: 'IT-102', status: 'active' },
      { id: 'BBA-2B', program: 'Business Administration', semester: '3rd', students: 36, teacher: 'Prof. Adam Smith', room: 'BBA-201', status: 'active' },
      { id: 'ECO-1A', program: 'Economics', semester: '1st', students: 30, teacher: 'Dr. Keynes', room: 'ECO-103', status: 'inactive' },
    ],
    users: [
      { id: 'U-001', name: 'Dr. Sarah Connor',   email: 'sconnor@je.edu',     role: 'teacher', status: 'active',   joined: 'Jan 2023' },
      { id: 'U-002', name: 'Prof. Alan Turing',  email: 'aturing@je.edu',     role: 'teacher', status: 'active',   joined: 'Mar 2022' },
      { id: 'U-003', name: 'Haris Zaidi',        email: 'haris@je.edu',       role: 'admin',   status: 'active',   joined: 'Jul 2024' },
      { id: 'U-004', name: 'Alice Smith',         email: 'asmith@je.edu',     role: 'student', status: 'active',   joined: 'Sep 2024' },
      { id: 'U-005', name: 'John Doe',            email: 'jdoe@je.edu',       role: 'student', status: 'inactive', joined: 'Sep 2024' },
      { id: 'U-006', name: 'Fatima Noor',         email: 'fnoor@je.edu',      role: 'student', status: 'active',   joined: 'Jan 2025' },
      { id: 'U-007', name: 'Mary Shelley',        email: 'mshelley@je.edu',   role: 'teacher', status: 'active',   joined: 'Aug 2021' },
      { id: 'U-008', name: 'Taha Waseem',         email: 'taha@je.edu',       role: 'student', status: 'active',   joined: 'Feb 2025' },
      { id: 'U-009', name: 'Robert Brown',        email: 'rbrown@je.edu',     role: 'staff',   status: 'active',   joined: 'Jan 2020' },
      { id: 'U-010', name: 'Emily Davis',         email: 'edavis@je.edu',     role: 'staff',   status: 'active',   joined: 'Mar 2021' },
    ],
    admissions: [
      { id: 'APP-001', name: 'Zainab Ali', class: 'BSc Computer Science', date: 'Jul 15, 2026', status: 'pending' },
      { id: 'APP-002', name: 'Omar Khan', class: 'BBA', date: 'Jul 16, 2026', status: 'pending' }
    ]
  };

  // ── Mock Data: Kids Academy ────────────────────────────────────────────────
  kidsData = {
    stats: {
      totalStudents: 320,
      totalTeachers: 28,
      totalClasses: 12,
      pendingAdmissions: 5,
      totalStaff: 8
    },
    classes: [
      { id: 'KG-A', program: 'Kindergarten', semester: 'Year 1', students: 22, teacher: 'Ms. Emma Watson', room: 'KG-01', status: 'active' },
      { id: 'G1-A', program: 'Grade 1', semester: 'Year 2', students: 26, teacher: 'Ms. Laura Perez', room: 'G1-02', status: 'active' },
      { id: 'G2-B', program: 'Grade 2', semester: 'Year 3', students: 24, teacher: 'Mr. Tom Hanks', room: 'G2-03', status: 'active' },
      { id: 'G3-A', program: 'Grade 3', semester: 'Year 4', students: 28, teacher: 'Ms. Zara Ali', room: 'G3-01', status: 'active' },
      { id: 'G4-A', program: 'Grade 4', semester: 'Year 5', students: 25, teacher: 'Mr. Jake Ryan', room: 'G4-02', status: 'inactive' },
      { id: 'G5-B', program: 'Grade 5', semester: 'Year 6', students: 20, teacher: 'Ms. Nina Patel', room: 'G5-03', status: 'active' },
    ],
    users: [
      { id: 'K-001', name: 'Ms. Emma Watson',   email: 'emma@kids.edu',    role: 'teacher', status: 'active',   joined: 'Jan 2022' },
      { id: 'K-002', name: 'Ms. Laura Perez',   email: 'laura@kids.edu',   role: 'teacher', status: 'active',   joined: 'Mar 2022' },
      { id: 'K-003', name: 'Admin Kids',         email: 'admin@kids.edu',   role: 'admin',   status: 'active',   joined: 'Jun 2021' },
      { id: 'K-004', name: 'Ali Hassan',         email: 'ali@kids.edu',     role: 'student', status: 'active',   joined: 'Sep 2024' },
      { id: 'K-005', name: 'Sara Malik',         email: 'sara@kids.edu',    role: 'student', status: 'active',   joined: 'Jan 2025' },
      { id: 'K-006', name: 'Bilal Ahmed',        email: 'bilal@kids.edu',   role: 'student', status: 'inactive', joined: 'Sep 2023' },
      { id: 'K-007', name: 'John Smith',         email: 'jsmith@kids.edu',  role: 'staff',   status: 'active',   joined: 'Feb 2022' },
    ],
    admissions: [
      { id: 'APP-101', name: 'Ayesha Raza', class: 'Grade 1', date: 'Jul 10, 2026', status: 'pending' },
      { id: 'APP-102', name: 'Hamza Tariq', class: 'Kindergarten', date: 'Jul 12, 2026', status: 'pending' }
    ]
  };

  get data() {
    return this.selectedInstitution() === 'kids-academy' ? this.kidsData : this.jeData;
  }

  classSearchQuery = '';
  userSearchQuery = '';
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
    let users = this.data.users;
    
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
    const query = this.admissionSearchQuery.toLowerCase().trim();
    if (!query) return this.data.admissions;
    return this.data.admissions.filter(adm => 
      adm.name.toLowerCase().includes(query) ||
      adm.id.toLowerCase().includes(query) ||
      adm.class.toLowerCase().includes(query)
    );
  }

  onClassSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.classSearchQuery = input.value;
  }

  onUserSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.userSearchQuery = input.value;
  }

  onAdmissionSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.admissionSearchQuery = input.value;
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
