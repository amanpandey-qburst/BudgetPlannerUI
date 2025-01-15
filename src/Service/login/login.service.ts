import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private isAdmin: boolean = false;
  private firstName: string = '';
  private lastName: string = '';

  constructor(private http: HttpClient) {}

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  // Fetch data from the API and set user properties
  checkUserEmail(email: string): Observable<any> {
    const apiUrl = `https://localhost:7156/api/User/getUserWithEmail?email=${email}`;
    return new Observable((subscriber) => {
      this.http.get(apiUrl).subscribe({
        next: (response: any) => {
          if (response.emailExist) {
            // Set the user details directly here
            const decodedToken: any = jwtDecode(response.token);
            this.firstName = response.user.firstName;
            this.lastName = response.user.lastName;
            this.isAdmin = decodedToken.isAdmin === 'True';

            console.log('LoginService: User details set:', {
              firstName: this.firstName,
              lastName: this.lastName,
              isAdmin: this.isAdmin,
            });

            subscriber.next(response);
          } else {
            console.warn('LoginService: Email not found in API response');
            subscriber.error('Email does not exist');
          }
        },
        error: (err) => {
          console.error('LoginService: Error while calling API:', err);
          subscriber.error(err);
        },
      });
    });
  }
}
