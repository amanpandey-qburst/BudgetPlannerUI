import { Component } from '@angular/core';
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
export class HomeComponent {
  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private socialAuthService: SocialAuthService
  ) {}

  activeMenu: string = '';

  setActive(menu: string): void {
    this.activeMenu = menu;
    this.navigateTo(menu);
  }

  logout() {
    this.userDataService.clearUserData();
    this.socialAuthService.signOut();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/home/${route}`]);
  }
}
