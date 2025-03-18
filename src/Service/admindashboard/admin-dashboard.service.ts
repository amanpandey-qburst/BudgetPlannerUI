import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
}

export interface CategoryExpensesForDate {
  date: string;
  categoryExpenses: CategoryExpense[];
}

export interface GraphDataResponse {
  graphData: CategoryExpensesForDate[];
  distinctCategories: { categoryId: string; categoryName: string }[];
}

export interface UserDetail {
  id: string; 
  firstName: string;
  lastName: string;
  emailId: string;
  dateOfBirth: string;
  gender: string;
  photoURL: string;
}


@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private baseUrl = 'https://localhost:7156/api/AdminDashboard';

  constructor(private http: HttpClient) {}

  getGraphDataForDateRange(startDate: string, endDate: string): Observable<GraphDataResponse> {
    return this.http.get<GraphDataResponse>(
      `${this.baseUrl}/GetGraphDataForDateRange?startDate=${startDate}&endDate=${endDate}`
    );
  }
  

  getExpensesForDateRange(startDate: string, endDate: string): Observable<CategoryExpense[]> {
    return this.http.get<CategoryExpense[]>(
      `${this.baseUrl}/GetExpensesForDateRange?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getNonAdminUsers(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${this.baseUrl}/get-non-admin-users`);
  }
  
  getUserFinancialDetails(apiUrl: string) {
    return this.http.get(apiUrl);
  }
  
}
