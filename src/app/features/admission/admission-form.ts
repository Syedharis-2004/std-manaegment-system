import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdmissionService } from '../../core/services/admission';

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admission-form.html',
  styleUrls: ['./admission-form.css']
})
// Component for Jamia Educational Academy Admission Form
export class AdmissionForm {
  private fb = inject(FormBuilder);
  private admissionService = inject(AdmissionService);
  private router = inject(Router);

  admissionForm: FormGroup;
  isSubmitted = false;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor() {
    this.admissionForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      fatherProfession: [''],
      fatherMobile: ['', Validators.required],
      studentClass: ['', Validators.required],
      section: [''],
      schoolName: [''],
      lastQualification: [''],
      address: ['', Validators.required],
      whatsappNumber: [''],
      dateOfAdmission: ['', Validators.required],
      docsCnic: [null, Validators.required],
      docsPhoto: [null, Validators.required],
      docsResultCard: [null, Validators.required],
      docsBForm: [null, Validators.required],
      docsCharacterCertificate: [null, Validators.required],
      groupSelection: ['', Validators.required] // Pre. Eng, Pre. Medical, Comp. Science, Commerce
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

    if (this.admissionForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      
      // Append form fields:
      formData.append('class_name', this.admissionForm.get('studentClass')?.value || '');
      formData.append('section', this.admissionForm.get('section')?.value || '');
      formData.append('school_college', this.admissionForm.get('schoolName')?.value || '');
      formData.append('last_qualification', this.admissionForm.get('lastQualification')?.value || '');
      formData.append('address', this.admissionForm.get('address')?.value || '');
      formData.append('whatsapp', this.admissionForm.get('whatsappNumber')?.value || '');
      formData.append('department', this.admissionForm.get('groupSelection')?.value || '');
      
      // Append files:
      formData.append('photo', this.admissionForm.get('docsPhoto')?.value);
      formData.append('b_form', this.admissionForm.get('docsBForm')?.value);
      formData.append('father_cnic', this.admissionForm.get('docsCnic')?.value);
      formData.append('last_result_card', this.admissionForm.get('docsResultCard')?.value);
      formData.append('character_certificate', this.admissionForm.get('docsCharacterCertificate')?.value);

      this.admissionService.submitAdmission(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Admission form submitted successfully!';
          setTimeout(() => {
            window.print();
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || err.message || 'Failed to submit admission form. Please try again.';
          console.error('Admission submit error:', err);
        }
      });
    } else {
      Object.values(this.admissionForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}

