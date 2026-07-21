import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students/`);
  }

  getStudentDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${userId}`);
  }

  updateStudentStatus(userId: string, status: string): Observable<any> {
    const formData = new FormData();
    formData.append('status', status);
    return this.http.put<any>(`${this.apiUrl}/students/status/${userId}`, formData);
  }
}
