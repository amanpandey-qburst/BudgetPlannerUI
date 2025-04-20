import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserDataService } from '../../../Service/userData/user-data.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LoginService } from '../../../Service/login/login.service';
import { CommonModule } from '@angular/common';
import { UserDashboardService } from '../../../Service/userdashboard/user-dashboard.service';

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
    { label: 'User List', route: 'user-list' },
  ];

  nonAdminMenuItems = [
    { label: 'Plan', route: 'user-dashboard' },
    { label: 'Expense', route: 'expense' },
    { label: 'Profile', route: 'profile' },
    { label: 'Compare Plan', route: 'compare-plan' },
  ];


  constructor(
    private router: Router,
    private loginService: LoginService,
    private userDataService: UserDataService,
    private socialAuthService: SocialAuthService,
    private dashboardService: UserDashboardService,

  ) {}

 ngOnInit(): void {
  this.firstName = this.loginService.getFirstName();
  this.lastName = this.loginService.getLastName();
  const storedAdminStatus = sessionStorage.getItem('isAdmin');
    if (storedAdminStatus !== null) {
      this.isAdmin = storedAdminStatus === 'true';
    } else {
      this.isAdmin = this.loginService.getIsAdmin();
      sessionStorage.setItem('isAdmin', String(this.isAdmin)); 
    }


      // ✅ Check and reset user plan if needed
  this.dashboardService.checkAndResetUserPlan().subscribe({
    next: (res) => {
      console.log('Auto reset check complete:', res);
    },
    error: (err) => {
      console.error('Auto reset check failed:', err);
    }
  });


    const defaultRoute = this.getDefaultMenuRoute(); 
    this.activeMenu = defaultRoute;
    this.router.navigate([`/home/${defaultRoute}`]); 

  }

  getDefaultMenuRoute(): string {
    const menu = this.isAdmin ? this.adminMenuItems : this.nonAdminMenuItems;
    return menu[0].route; 
  }

  setActive(menu: string): void {
    this.activeMenu = menu;
    this.navigateTo(menu);
  }

  logout() {
    this.userDataService.clearUserData();
    this.socialAuthService.signOut();
    this.router.navigate(['/login']);
    sessionStorage.removeItem('isAdmin'); 
  }

  navigateTo(route: string) {
    this.router.navigate([`/home/${route}`]);
  }
}
