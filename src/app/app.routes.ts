import { Routes } from '@angular/router';
import { RegistrationComponent } from '../Page/registration/registration/registration.component';
import { LoginComponent } from '../Page/login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from '../Page/home/home/home.component';

export const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', loadComponent: () => LoginComponent },
  { path: 'home', loadComponent: () => HomeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
