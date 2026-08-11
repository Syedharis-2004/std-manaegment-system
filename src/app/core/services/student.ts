import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

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
