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

// userprofile.service.ts
@Injectable({
  providedIn: 'root',
})
export class UserprofileService {
  private profileApiUrl = 'https://localhost:7156/api/UserPlan/GetUserWithIncomeDetails';
  private autoResetApiUrl = 'https://localhost:7156/api/UserPlan/update-auto-reset-settings';
  private updateProfileApiUrl = 'https://localhost:7156/api/User/updateProfile';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<{ user: User; incomes: Income[] }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
    });
    return this.http.get<{ user: User; incomes: Income[] }>(this.profileApiUrl, { headers });
  }

  updateAutoResetSettings(settings: { isAutoResetEnabled: boolean; autoResetDays: number | null }): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.autoResetApiUrl, settings, { headers });
  }

  removeAutoResetSettings(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
    });
  
    return this.http.post('https://localhost:7156/api/UserPlan/remove-auto-reset-settings', {}, { headers });
  }


  updateUserProfile(user: User): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(this.updateProfileApiUrl, user, { headers });
  }


  
}
