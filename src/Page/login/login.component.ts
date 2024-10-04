import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from '../../Service/userData/user-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  socialAuthService = inject(SocialAuthService);
  router = inject(Router);
  userDataService = inject(UserDataService);
  http = inject(HttpClient); // Injecting HttpClient

  ngOnInit() {
    this.socialAuthService.authState.subscribe({
      next: (result) => {
        console.log(result);

        // Save user data in UserDataService
        this.userDataService.setUserData({
          firstName: result.firstName,
          lastName: result.lastName,
          photoUrl: result.photoUrl,
          id: result.id,
          idToken: result.idToken,
          email: result.email,
        });

        // Call the API to check if the user exists by email
        this.checkUserEmail(result.email);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  checkUserEmail(email: string) {
    const apiUrl = `https://localhost:7156/api/User/getUserWithEmail?email=${email}`;

    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);

        if (response.emailExist) {
          // Redirect to the home page if the email exists
          this.router.navigate(['/home']);
        } else {
          // Redirect to the registration page if the email doesn't exist
          this.router.navigate(['/registration']);
        }
      },
      error: (err) => {
        console.log('Error calling API:', err);
      },
    });
  }
}
