import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserDataService } from '../../../Service/userData/user-data.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LoginService } from '../../../Service/login/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  firstName: string = '';
  lastName: string = '';
  activeMenu: string = '';
  isAdmin: boolean = false; 

  adminMenuItems = [
    { label: 'Dashboard', route: 'dashboard' },
    { label: 'Categories', route: 'categories' },
    { label: 'Plans', route: 'plans' },
  ];

  nonAdminMenuItems = [
    { label: 'Categories', route: 'categories' },
    { label: 'Plans', route: 'plans' },
  ];


  constructor(
    private router: Router,
    private loginService: LoginService,
    private userDataService: UserDataService,
    private socialAuthService: SocialAuthService,

  ) {}

 ngOnInit(): void {
  this.firstName = this.loginService.getFirstName();
  this.lastName = this.loginService.getLastName();
    this.isAdmin = this.loginService.getIsAdmin();

    console.log('isAdmin:', this.isAdmin);
    console.log('Menu items:', this.isAdmin ? this.adminMenuItems : this.nonAdminMenuItems);
  }

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
