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
  private editExpenseUrl = 'https://localhost:7156/api/UserPlan/edit-expense';
  private deleteExpenseUrl = 'https://localhost:7156/api/UserPlan/delete-expense';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      return new HttpHeaders(); // Return empty headers to avoid null errors
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

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

  editExpense(expenseId: string, updatedExpense: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.editExpenseUrl}/${expenseId}`, updatedExpense, { headers }).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  // Delete an expense
  deleteExpense(expenseId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.deleteExpenseUrl}/${expenseId}`, { headers }).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }
}
