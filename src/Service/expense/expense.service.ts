import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'https://localhost:7156/api/SubCategory/GetAllSubCategories';
  private addExpenseUrl = 'https://localhost:7156/api/UserPlan/add-expense';
  private getExpensesUrl = 'https://localhost:7156/api/UserPlan/get-expenses';

  constructor(private http: HttpClient) {}

  // Fetch subcategories
  getSubCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add an expense
  addExpense(expense: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      return throwError(() => new Error('Token not available'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.addExpenseUrl, expense, { headers }).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  // Get all expenses for the logged-in user
  getExpenses(): Observable<any[]> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      return throwError(() => new Error('Token not available'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.getExpensesUrl, { headers }).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }
}
