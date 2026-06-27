import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { StudentService, Student } from '../../core/services/student';

interface DepartmentStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private studentService = inject(StudentService);
  private router = inject(Router);

  // Angular Signals for state management
  students = signal<Student[]>([]);
  activeTab = signal<'overview' | 'students'>('overview');
  isDrawerOpen = signal(false);
  searchQuery = signal('');
  selectedDepartment = signal('');
  
  // Dashboard loading & toast alerts
  isLoadingStudents = signal(false);
  isSubmittingStudent = signal(false);
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  // Add Student Form
  studentForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    age: ['', [Validators.required, Validators.min(5), Validators.max(100)]],
    grade: ['', [Validators.required]],
    department: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  // Departments list for dropdown
  departments = [
    'Computer Science',
    'Engineering',
    'Business',
    'Mathematics',
    'Science',
    'Arts'
  ];

  // Colors for department stats representation
  protected deptColors: { [key: string]: string } = {
    'Computer Science': '#6366f1', // Indigo
    'Engineering': '#a855f7',      // Purple
    'Business': '#10b981',         // Emerald
    'Mathematics': '#f59e0b',      // Amber
    'Science': '#06b6d4',          // Cyan
    'Arts': '#f43f5e'              // Rose
  };

  // Get currently logged-in user
  currentUser = computed(() => this.authService.currentUser());

  // Computed signals for live analytical metrics
  totalStudents = computed(() => this.students().length);

  averageAge = computed(() => {
    const list = this.students();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, s) => acc + Number(s.age), 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  departmentStats = computed<DepartmentStat[]>(() => {
    const list = this.students();
    const total = list.length;
    if (total === 0) return [];

    const counts: { [key: string]: number } = {};
    list.forEach(s => {
      counts[s.department] = (counts[s.department] || 0) + 1;
    });

    return Object.keys(counts).map(dept => {
      const count = counts[dept];
      return {
        name: dept,
        count,
        percentage: Math.round((count / total) * 100),
        color: this.deptColors[dept] || '#64748b'
      };
    }).sort((a, b) => b.count - a.count);
  });

  // Computed filter logic for real-time search and filter dropdown
  filteredStudents = computed(() => {
    let list = this.students();
    const search = this.searchQuery().toLowerCase().trim();
    const dept = this.selectedDepartment();

    if (search) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(search) || 
        s.email.toLowerCase().includes(search) ||
        s.grade.toLowerCase().includes(search)
      );
    }

    if (dept) {
      list = list.filter(s => s.department === dept);
    }

    return list;
  });

  ngOnInit(): void {
    // If not logged in, authGuard will handle, but safety check here
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoadingStudents.set(true);
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students.set(data);
        this.isLoadingStudents.set(false);
      },
      error: () => {
        this.showToast('Failed to load students list from backend', 'error');
        this.isLoadingStudents.set(false);
      }
    });
  }

  setTab(tab: 'overview' | 'students'): void {
    this.activeTab.set(tab);
  }

  openDrawer(): void {
    this.studentForm.reset({ department: '' });
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  onSubmitStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isSubmittingStudent.set(true);
    const formVal = this.studentForm.value;
    
    const newStudent: Student = {
      name: formVal.name!,
      age: Number(formVal.age!),
      grade: formVal.grade!,
      department: formVal.department!,
      email: formVal.email!
    };

    this.studentService.addStudent(newStudent).subscribe({
      next: (response) => {
        this.isSubmittingStudent.set(false);
        this.showToast('Student record added successfully!', 'success');
        
        // Refresh local student signals
        this.loadStudents();
        
        // Close drawer with slight delay for UX
        setTimeout(() => {
          this.closeDrawer();
        }, 300);
      },
      error: (err) => {
        this.isSubmittingStudent.set(false);
        this.showToast(err.error?.message || 'Error adding student. Please try again.', 'error');
      }
    });
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
