import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface NoticeData {
  title: string;
  description: string;
  target: string; // e.g. "ALL", "STUDENTS", "TEACHERS", "PARENTS", "CLASS"
  class_name?: string;
  section_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getNotices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notices/`);
  }

  getNoticeDetails(noticeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/notices/${noticeId}`);
  }

  createNotice(data: NoticeData): Observable<any> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('target', data.target);
    if (data.class_name) formData.append('class_name', data.class_name);
    if (data.section_name) formData.append('section_name', data.section_name);
    return this.http.post<any>(`${this.apiUrl}/notices/`, formData);
  }

  updateNotice(noticeId: string, data: NoticeData): Observable<any> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('target', data.target);
    if (data.class_name) formData.append('class_name', data.class_name);
    if (data.section_name) formData.append('section_name', data.section_name);
    return this.http.put<any>(`${this.apiUrl}/notices/${noticeId}`, formData);
  }

  deleteNotice(noticeId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/notices/${noticeId}`);
  }
}
