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
  private token: string | null = null;

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

  getToken(): string | null {
    return this.token;
  }

  checkUserEmail(email: string): Observable<any> {
    const apiUrl = `https://localhost:7156/api/User/getUserWithEmail?email=${email}`;
    
    return new Observable((subscriber) => {
      this.http.get(apiUrl).subscribe({
        next: (response: any) => {
          if (response.emailExist) {
            // Decode and set user details
            if (response.token) {
              const decodedToken: any = jwtDecode(response.token);
              this.firstName = response.user.firstName;
              this.lastName = response.user.lastName;
              this.isAdmin = decodedToken.isAdmin === 'True';
              this.token = response.token;
            }
            subscriber.next(response); // Pass response to the subscriber
          } else {
            // Email does not exist, still pass the response for the caller to handle
            subscriber.next(response);
          }
        },
        error: (err) => {
          console.error('LoginService: Error while calling API:', err);
          subscriber.error(err); // Pass API call error to the subscriber
        },
      });
    });
  }
  
}
