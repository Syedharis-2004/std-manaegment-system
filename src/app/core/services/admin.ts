import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface CreateAdminData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  father_name: string;
  mobile_number: string;
  email?: string;
  password: string;
  confirm_password: string;
}

export interface UpdateAdminData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  father_name?: string;
  mobile_number?: string;
  email?: string;
}

export interface UpdateAdminStatusData {
  status: 'APPROVED' | 'INACTIVE';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admins/`);
  }

  getAdminDetails(adminId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admins/${adminId}`);
  }

  createAdmin(data: CreateAdminData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admins/`, data);
  }

  updateAdmin(adminId: string, data: UpdateAdminData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admins/${adminId}`, data);
  }

  updateAdminStatus(adminId: string, status: 'APPROVED' | 'INACTIVE'): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admins/status/${adminId}`, { status });
  }
}
