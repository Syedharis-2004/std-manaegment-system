import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface UpdateProfileData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  father_name?: string;
  mobile_number?: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/`);
  }

  updateProfile(data: UpdateProfileData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/`, data);
  }

  changePassword(data: ChangePasswordData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/change-password`, data);
  }
}
