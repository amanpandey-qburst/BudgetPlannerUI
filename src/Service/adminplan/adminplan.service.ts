import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminplanService {
  private apiUrl = 'https://localhost:7156/api/AdminPlan';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  addPlan(plan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, plan);
  }

  getPlanDetails(planId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${planId}`);
  }

  updatePlan(id: string, plan: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, plan);
  }

  deletePlan(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  

}
