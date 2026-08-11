import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentTeacherService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getStudentTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student-teachers/`);
  }
}
