import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComparePlanService {
  private apiUrl = 'https://localhost:7156/api/User/compareUserPlan';

  constructor(private http: HttpClient) {}

  compareUserPlan(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`, // Get JWT token from session storage
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
