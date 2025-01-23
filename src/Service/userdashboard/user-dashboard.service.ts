import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {

  private apiUrl = 'https://localhost:7156/api/UserPlan/dashboard'; 

  constructor(private http: HttpClient, private loginService: LoginService) {}

  // Method to get user data
  getUserPlanDetails(): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not available');
    }

    // Set the Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }
}
