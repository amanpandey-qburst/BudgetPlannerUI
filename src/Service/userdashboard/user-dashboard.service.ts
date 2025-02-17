import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {

  private apiUrl = 'https://localhost:7156/api/UserPlan';  // Base URL for all user plan-related APIs

  constructor(private http: HttpClient, private loginService: LoginService) {}

  // Helper function to get authorization headers
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not available');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Method to get user plan details
  getUserPlanDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`, { headers: this.getHeaders() });
  }

  // Method to edit category allocation (update allocation for existing categories)
  editCategoryAllocation(userId: string, categoryAllocations: any[]): Observable<any> {
    const url = `https://localhost:7156/api/User/updateCategoryAllocation/${userId}`;
    return this.http.put(url, categoryAllocations, { headers: this.getHeaders() });
  }

  // Method to update categories (add/remove categories from user plan)
  updateCategories(userId: string, categoryIds: any[]): Observable<any> {
    const url = `https://localhost:7156/api/User/updateCategories/${userId}`;
    return this.http.put(url, categoryIds, { headers: this.getHeaders() });
  }
}
