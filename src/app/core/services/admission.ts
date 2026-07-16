import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  submitAdmission(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admission/`, formData);
  }

  getPendingAdmissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admission/pending`);
  }

  approveAdmission(userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admission/approve/${userId}`, {});
  }

  rejectAdmission(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admission/reject/${userId}`);
  }
}
