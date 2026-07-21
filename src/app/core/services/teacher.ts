import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teachers/`);
  }

  getTeacherDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teachers/${userId}`);
  }

  addTeacher(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/teachers/`, formData);
  }

  updateTeacherStatus(userId: string, status: string): Observable<any> {
    const formData = new FormData();
    formData.append('teacher_status', status);
    return this.http.put<any>(`${this.apiUrl}/teachers/status/${userId}`, formData);
  }
}
