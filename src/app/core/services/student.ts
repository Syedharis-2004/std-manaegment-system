import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  name: string;
  age: number;
  grade: string;
  department: string;
  email: string;
  [key: string]: any; // Allow other properties if returned by backend
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }

  addStudent(student: Student): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/students`, student);
  }
}
