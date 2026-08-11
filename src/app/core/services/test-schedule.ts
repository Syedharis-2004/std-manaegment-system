import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface CreateTestSchedule {
  class_id: string;
  month: string;
  year: number;
  test_type: string;
}

export interface SaveTestSchedule {
  tests: Array<{
    day: string;
    period_no: number;
    subject: string;
    topic: string;
    teacher_id: string;
    teacher_name: string;
    total_marks: number;
    date: string;
  }>;
}

export interface SaveTestResult {
  schedule_id: string;
  subject: string;
  date: string;
  results: Array<{
    student_id: string;
    gr_number: string;
    student_name: string;
    obtained_marks: number;
    status: 'PASS' | 'FAIL' | 'ABSENT';
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class TestScheduleService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllSchedules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tests/`);
  }

  getSchedule(scheduleId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tests/${scheduleId}`);
  }

  generateSchedule(data: CreateTestSchedule): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tests/generate`, data);
  }

  updateSchedule(scheduleId: string, data: SaveTestSchedule): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tests/${scheduleId}`, data);
  }

  updateResult(data: SaveTestResult): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tests/result`, data);
  }
}

