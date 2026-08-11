import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentClassService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getStudentClass(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student-class/`);
  }
}
