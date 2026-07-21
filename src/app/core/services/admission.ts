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
    const formData = new FormData();
    formData.append('status', 'APPROVED');
    formData.append('remarks', 'Approved by administrator');
    return this.http.put<any>(`${this.apiUrl}/admission/review/${userId}`, formData);
  }

  rejectAdmission(userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('status', 'REJECTED');
    formData.append('remarks', 'Rejected by administrator');
    return this.http.put<any>(`${this.apiUrl}/admission/review/${userId}`, formData);
  }
}
