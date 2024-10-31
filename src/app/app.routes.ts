import { Routes } from '@angular/router';
import { RegistrationComponent } from '../Page/registration/registration/registration.component';
import { LoginComponent } from '../Page/login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from '../Page/home/home/home.component';
import { AdminDashboardComponent } from '../Components/Admin_Dashboard/admin-dashboard/admin-dashboard.component';
import { CategoriesComponent } from '../Components/Categories/categories/categories.component';
import { PlansComponent } from '../Components/Plans/plans/plans.component';
import { CategoryDetailComponent } from '../Page/category_Detail/category-detail/category-detail.component';

export const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', loadComponent: () => LoginComponent },
  {
    path: 'home',
    loadComponent: () => HomeComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'plans', component: PlansComponent },
      { path: 'categorydetails', component: CategoryDetailComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default child route
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
