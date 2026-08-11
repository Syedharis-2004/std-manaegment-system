import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export type TeacherStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
export type ClassStatus = 'ACTIVE' | 'INACTIVE';
export type SlotType = 'Lecture' | 'Test' | 'Practical' | 'Break' | 'Free Period';

export interface Period {
  period_no: number;
  start_time: string;
  end_time: string;
}

export interface ScheduleSlot {
  day: string;
  period_no: number;
  subject: string;
  teacher_id: string;
  teacher_name: string;
  teacher_status?: TeacherStatus;
  class_status?: ClassStatus;
  slot_type: SlotType;
}

export interface TimetableRequest {
  working_days: string[];
  periods: Period[];
  schedule: ScheduleSlot[];
}

export interface UpdateSlot {
  day: string;
  period_no: number;
  subject: string;
  teacher_id: string;
  teacher_name: string;
  teacher_status: TeacherStatus;
  class_status: ClassStatus;
  slot_type: SlotType;
}

export interface CopyTimetable {
  source_class_id: string;
  destination_class_id: string;
  overwrite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

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

  // ── Timetable endpoints ──────────────────────────────────
  getTimetable(classId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/classes/${classId}/timetable`);
  }

  saveTimetable(classId: string, data: TimetableRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/classes/${classId}/timetable`, data);
  }

  deleteTimetable(classId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/classes/${classId}/timetable`);
  }

  updateSlot(classId: string, data: UpdateSlot): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/classes/${classId}/timetable/slot`, data);
  }

  copyTimetable(data: CopyTimetable): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/classes/copy-timetable`, data);
  }
}


