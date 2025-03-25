import { Routes } from '@angular/router';
import { RegistrationComponent } from '../Page/registration/registration/registration.component';
import { LoginComponent } from '../Page/login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from '../Page/home/home/home.component';
import { AdminDashboardComponent } from '../Components/Admin_Dashboard/admin-dashboard/admin-dashboard.component';
import { CategoriesComponent } from '../Components/Categories/categories/categories.component';
import { PlansComponent } from '../Components/Plans/plans/plans.component';
import { CategoryDetailComponent } from '../Page/category_Detail/category-detail/category-detail.component';
import { PlanDetailComponent } from '../Page/plan_Detail/plan-detail/plan-detail.component';
import { UserDashboardComponent } from '../Components/User_Dashboard/user-dashboard/user-dashboard.component';
import { ProfileComponent } from '../Components/Profile/profile/profile.component';
import { ExpenseComponent } from '../Components/Expense/expense/expense.component';
import { ComparePlanComponent } from '../Components/Compare_Plan/compare-plan/compare-plan.component';
import { UserListComponent } from '../Components/User_List/user-list/user-list.component';

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
      { path: 'plandetails', component: PlanDetailComponent },
      { path: 'user-dashboard', component: UserDashboardComponent },
      { path: 'expense', component: ExpenseComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'compare-plan', component: ComparePlanComponent },
      { path: 'user-list', component: UserListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
