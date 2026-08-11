import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentAssignmentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUpcomingTests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student-assignment/upcoming-tests`);
  }

  getResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student-assignment/results`);
  }
}
