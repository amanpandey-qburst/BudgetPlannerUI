import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../Service/userData/user-data.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnInit {
  userData: any;

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.userData = this.userDataService.getUserData();

    if (this.userData) {
      console.log('User Data:', this.userData);
    }
  }
}
