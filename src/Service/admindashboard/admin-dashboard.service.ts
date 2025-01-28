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

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private baseUrl = 'https://localhost:7156/api/AdminDashboard';

  constructor(private http: HttpClient) {}

  getGraphDataForLastDays(lastDays: number): Observable<GraphDataResponse> {
    return this.http.get<GraphDataResponse>(
      `${this.baseUrl}/GetGraphDataForLastDays?lastDays=${lastDays}`
    );
  }

  getExpensesForLastDays(lastDays: number): Observable<CategoryExpense[]> {
    return this.http.get<CategoryExpense[]>(
      `${this.baseUrl}/GetExpensesForLastDays?lastDays=${lastDays}`
    );
  }
}
