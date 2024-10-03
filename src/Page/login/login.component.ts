import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  ngOnInit() {
    this.socialAuthService.authState.subscribe({
      next: (result) => {
        console.log(result);
        this.userDataService.setUserData({
          firstName: result.firstName,
          lastName: result.lastName,
          photoUrl: result.photoUrl,
          id: result.id,
          idToken: result.idToken,
        });
        this.router.navigate(['/registration']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
