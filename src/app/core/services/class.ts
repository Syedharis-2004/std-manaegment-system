import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/classes/`);
  }

  getClassDetails(classId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/classes/${classId}`);
  }

  addClass(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/classes/`, formData);
  }

  updateClass(classId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/classes/${classId}`, formData);
  }

  deleteClass(classId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/classes/${classId}`);
  }
}
