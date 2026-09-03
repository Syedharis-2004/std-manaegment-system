import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface SchoolSettingsData {
  school_name: string;
  address: string;
  phone_number: string;
  email: string;
  logo?: string;
}

export interface AcademicSettingsData {
  academic_session: string;
  school_start_time: string;
  school_end_time: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/settings/`);
  }

  updateSchoolSettings(data: SchoolSettingsData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/settings/school`, data);
  }

  updateAcademicSettings(data: AcademicSettingsData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/settings/academic`, data);
  }
}
