import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Income {
  source: string;
  amount: number;
}

interface User {
  firstName: string;
  lastName: string;
  emailId: string;
  dateOfBirth: string;
  gender: string;
  photoURL: string;
  incomes: Income[];
}

@Injectable({
  providedIn: 'root',
})
export class UserprofileService {
  private apiUrl = 'https://localhost:7156/api/UserPlan/GetUserWithIncomeDetails';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<{ user: User; incomes: Income[] }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`, 
    });
    return this.http.get<{ user: User; incomes: Income[] }>(this.apiUrl, { headers });
  }
}
