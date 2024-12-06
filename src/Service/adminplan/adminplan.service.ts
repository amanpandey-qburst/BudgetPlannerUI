import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminplanService {
  private apiUrl = 'https://localhost:7156/api/AdminPlan';

  constructor(private http: HttpClient) {}

  getPlans(page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }

  addPlan(plan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, plan);
  }

  getPlanDetails(planId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${planId}`);
  }
}
