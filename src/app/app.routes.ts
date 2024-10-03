import { Routes } from '@angular/router';
import { RegistrationComponent } from '../Page/registration/registration/registration.component';
import { LoginComponent } from '../Page/login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', loadComponent: () => LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
