import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getActivityLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activity-logs/`);
  }

  getUserActivityLogs(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activity-logs/user/${userId}`);
  }
}
