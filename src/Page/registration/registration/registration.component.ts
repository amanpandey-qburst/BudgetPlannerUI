import { Component, inject, OnInit } from '@angular/core';
import { UserDataService } from '../../../Service/userData/user-data.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface IncomeSource {
  amount: number;
  source: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  userData: any;
  router = inject(Router);
  errorMessages: string[] = [];
  showSecondForm: boolean = false;
  incomeSources: IncomeSource[] = [{ amount: 0, source: '' }];

  private apiUrl = 'https://localhost:7156/api/User/registerUser';

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
    this.errorMessages = []; // Clear previous error messages

    // Validate form fields
    if (!this.userData.firstName) {
      this.errorMessages.push('First Name is required.');
    }
    if (!this.userData.lastName) {
      this.errorMessages.push('Last Name is required.');
    }
    if (!this.userData.email) {
      this.errorMessages.push('Email is required.');
    }
    if (!this.userData.gender) {
      this.errorMessages.push('Gender is required.');
    }
    if (!this.userData.dateOfBirth) {
      this.errorMessages.push('Date of Birth is required.');
    } else {
      const today = new Date();
      const selectedDate = new Date(this.userData.dateOfBirth);
      if (selectedDate > today) {
        this.errorMessages.push('Date of Birth cannot be in the future.');
      }
    }

    // If there are any errors, stop the submission
    if (this.errorMessages.length > 0) {
      return;
    }

    const dateOfBirthISO = new Date(this.userData.dateOfBirth).toISOString();
    const registrationData = {
      authId: this.userData.id,
      idToken: this.userData.idToken,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      emailId: this.userData.email,
      dateOfBirth: dateOfBirthISO,
      gender: this.userData.gender,
      photoURL: this.userData.photoUrl,
    };

    // Post the data to the API
    this.http
      .post(this.apiUrl, registrationData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.showSecondForm = true;
        },
        error: (error) => {
          console.error('Error during registration', error);
        },
      });
  }

  skip() {
    this.router.navigate(['/home']);
  }

  addIncomeSource() {
    this.incomeSources.push({ amount: 0, source: '' });
  }

  submitIncomeDetails() {
    console.log('Income Sources:', this.incomeSources);
  }
}
