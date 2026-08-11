import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface GenerateVoucher {
  gr_number: string;
  month: string;
  year: number;
  amount: number;
}

export interface ConfirmPayment {
  gr_number: string;
}

@Injectable({
  providedIn: 'root'
})

export class FeeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  generateVoucher(data: GenerateVoucher): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fees/generate-voucher`, data);
  }

  confirmPayment(data: ConfirmPayment): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/fees/confirm-payment`, data);
  }

  getAllVouchers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fees/all`);
  }

  getVoucherDetails(voucherNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fees/details/${voucherNumber}`);
  }

  getVoucherHistory(grNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fees/history/${grNumber}`);
  }

  getStudentHistory(grNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fees/student-history/${grNumber}`);
  }
}

