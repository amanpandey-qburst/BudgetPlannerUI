import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserDataService } from '../../../Service/userData/user-data.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  userDataService = inject(UserDataService);
  socialAuthService = inject(SocialAuthService);

  ngOnInit() {
    console.log('data cleared');
    this.userDataService.clearUserData();
    this.socialAuthService.signOut();
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
