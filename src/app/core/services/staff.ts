import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getStaff(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/staff/`);
  }

  getStaffDetails(staffId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/staff/${staffId}`);
  }

  addStaff(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/staff/`, formData);
  }

  updateStaffStatus(staffId: string, status: string): Observable<any> {
    const formData = new FormData();
    formData.append('staff_status', status);
    return this.http.put<any>(`${this.apiUrl}/staff/status/${staffId}`, formData);
  }
}
