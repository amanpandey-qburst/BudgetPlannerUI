import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../Service/userData/user-data.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  userData: any;

  // API endpoint for registering user
  private apiUrl = 'https://localhost:7156/api/User/registeruser';

  constructor(
    private userDataService: UserDataService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userData = this.userDataService.getUserData();

    if (this.userData) {
      console.log('User Data:', this.userData);
    }
  }

  // Function to handle form submission
  submitRegistration() {
    const registrationData = {
      authId: this.userData.id, // Map the authId with user's ID
      idToken: this.userData.idToken,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      emailId: this.userData.email,
      dateOfBirth: new Date().toISOString(), // Default or get this from user input
      gender: 'Male', // You can update this field from user input
      photoURL: this.userData.photoUrl,
    };

    // Post the data to the API
    this.http.post(this.apiUrl, registrationData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        // Optionally redirect to another page after registration
      },
      error: (error) => {
        console.error('Error during registration', error);
      },
    });
  }
}
