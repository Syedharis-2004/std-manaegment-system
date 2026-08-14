import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdmissionService } from '../../core/services/admission';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admission-form.html',
  styleUrls: ['./admission-form.css']
})
// Component for Jamia Educational Academy Admission Form
export class AdmissionForm implements OnInit {
  private fb = inject(FormBuilder);
  private admissionService = inject(AdmissionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() formSubmitted = new EventEmitter<string>();

  admissionForm: FormGroup;
  isSubmitted = false;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor() {
    const today = new Date().toISOString().split('T')[0];
    this.admissionForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      fatherProfession: [''],
      fatherMobile: ['', Validators.required],
      studentClass: ['11th', Validators.required],
      section: ['A'],
      schoolName: [''],
      lastQualification: ['Matric'],
      address: ['', Validators.required],
      whatsappNumber: [''],
      dateOfAdmission: [today, Validators.required],
      docsCnic: [null],
      docsPhoto: [null],
      docsResultCard: [null],
      docsBForm: [null],
      docsCharacterCertificate: [null],
      groupSelection: ['Pre. Eng', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (profile) => {
        if (profile) {
          const fullName = `${profile.first_name || ''} ${profile.middle_name || ''} ${profile.last_name || ''}`.replace(/\s+/g, ' ').trim();
          this.admissionForm.patchValue({
            name: fullName || this.admissionForm.get('name')?.value,
            fatherName: profile.father_name || this.admissionForm.get('fatherName')?.value,
            fatherMobile: profile.mobile_number || this.admissionForm.get('fatherMobile')?.value,
            whatsappNumber: profile.mobile_number || this.admissionForm.get('whatsappNumber')?.value
          });

          // If previous admission exists (e.g. rejected state), pre-fill previous admission data
          if (profile.id) {
            this.admissionService.getAdmissionDetails(profile.id).subscribe({
              next: (details) => {
                if (details) {
                  this.admissionForm.patchValue({
                    studentClass: details.class_name || this.admissionForm.get('studentClass')?.value,
                    section: details.section || this.admissionForm.get('section')?.value,
                    schoolName: details.school_college || this.admissionForm.get('schoolName')?.value,
                    lastQualification: details.last_qualification || this.admissionForm.get('lastQualification')?.value,
                    address: details.address || this.admissionForm.get('address')?.value,
                    whatsappNumber: details.whatsapp || this.admissionForm.get('whatsappNumber')?.value,
                    groupSelection: details.department || this.admissionForm.get('groupSelection')?.value
                  });
                }
              },
              error: () => {
                // Ignore if no prior admission details exist
              }
            });
          }
        }
      },
      error: (err) => console.error('Failed to prefill admission form profile:', err)
    });
  }

  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.admissionForm.patchValue({
        [controlName]: file
      });
      this.admissionForm.get(controlName)?.updateValueAndValidity();
    }
  }

  getFileName(controlName: string): string {
    const file = this.admissionForm.get(controlName)?.value as File;
    return file ? file.name : '';
  }

  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.admissionForm.invalid) {
      this.errorMessage = 'Please fill all required fields (Full Name, Father Name, Mobile Number, Class, Address, and Date of Admission).';
      Object.values(this.admissionForm.controls).forEach(control => {
        control.markAsTouched();
      });
      // Scroll to top of card so user sees the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    
    // Append form fields:
    formData.append('class_name', this.admissionForm.get('studentClass')?.value || '11th');
    formData.append('section', this.admissionForm.get('section')?.value || 'A');
    formData.append('school_college', this.admissionForm.get('schoolName')?.value || 'JE College');
    formData.append('last_qualification', this.admissionForm.get('lastQualification')?.value || 'Matric');
    formData.append('address', this.admissionForm.get('address')?.value || '');
    
    // Ensure whatsapp number is passed or fallback to fatherMobile
    const rawWhatsapp = this.admissionForm.get('whatsappNumber')?.value || this.admissionForm.get('fatherMobile')?.value || '';
    formData.append('whatsapp', rawWhatsapp);
    formData.append('department', this.admissionForm.get('groupSelection')?.value || 'Pre. Eng');
    
    // Only append files if user selected them (backend handles defaults automatically)
    if (this.admissionForm.get('docsPhoto')?.value) {
      formData.append('photo', this.admissionForm.get('docsPhoto')?.value);
    }
    if (this.admissionForm.get('docsBForm')?.value) {
      formData.append('b_form', this.admissionForm.get('docsBForm')?.value);
    }
    if (this.admissionForm.get('docsCnic')?.value) {
      formData.append('father_cnic', this.admissionForm.get('docsCnic')?.value);
    }
    if (this.admissionForm.get('docsResultCard')?.value) {
      formData.append('last_result_card', this.admissionForm.get('docsResultCard')?.value);
    }
    if (this.admissionForm.get('docsCharacterCertificate')?.value) {
      formData.append('character_certificate', this.admissionForm.get('docsCharacterCertificate')?.value);
    }

    this.admissionService.submitAdmission(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Admission form submitted successfully!';
        const newStatus = res.status || 'PENDING';
        this.formSubmitted.emit(newStatus);
        setTimeout(() => {
          if (this.router.url === '/admission') {
            this.router.navigate(['/dashboard']);
          }
        }, 500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || err.message || 'Failed to submit admission form. Please check your inputs and try again.';
        console.error('Admission submit error:', err);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
