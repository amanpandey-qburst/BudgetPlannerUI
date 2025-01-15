import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { LoginService } from '../../Service/login/login.service';
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
  loginService = inject(LoginService);
  userDataService = inject(UserDataService);

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

        // Call checkUserEmail via LoginService
        this.loginService.checkUserEmail(result.email).subscribe({
          next: (response: any) => {
            console.log('API Response:', response);

            if (response.token) {
              sessionStorage.setItem('authToken', response.token);
            }

         
     

            if (response.emailExist) {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/registration']);
            }
          },
          error: (err) => {
            console.error('Error calling API:', err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
