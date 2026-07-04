import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admission-form.html',
  styleUrls: ['./admission-form.css']
})
// Component for Jamia Educational Academy Admission Form
export class AdmissionForm {
  admissionForm: FormGroup;
  isSubmitted = false;
  successMessage = '';

  constructor(private fb: FormBuilder) {
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
      docsCnic: [null],
      docsPhoto: [null],
      docsResultCard: [null],
      groupSelection: [''] // Pre. Eng, Pre. Medical, Comp. Science, Commerce
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
    if (this.admissionForm.valid) {
      console.log('Form Submitted', this.admissionForm.value);
      this.successMessage = 'Admission form submitted successfully!';
      window.print();
    } else {
      Object.values(this.admissionForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
