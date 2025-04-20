import { Component, inject, OnInit } from '@angular/core';
import { UserDataService } from '../../../Service/userData/user-data.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface IncomeSource {
  amount: number;
  source: string;
  creditOn: number; 
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
  userId: string | null = null;
  router = inject(Router);
  errorMessages: string[] = [];
  incomeSources: IncomeSource[] = [{ amount: 0, source: '', creditOn: 0 }];
  showUserForm: boolean = true;
showIncomeForm: boolean = false;
showPlanSelection: boolean = false;



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
      .post(this.apiUrl, registrationData, { responseType: 'json' }) // Changed responseType to 'json'
      .subscribe({
        next: (response: any) => {
          console.log('Registration successful', response);

          // Store the userId from the response
          this.userId = response.data; // Assuming response.data contains the userId

          this.showUserForm = false;
          this.showIncomeForm = true; // Show the second form
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
    this.incomeSources.push({ amount: 0, source: '', creditOn: 0 });
  }
  

  removeIncomeSource(index: number) {
    this.incomeSources.splice(index, 1);
  }

  submitIncomeDetails() {
    if (!this.userId) {
      console.error('UserId not found. Cannot submit income details.');
      return;
    }
  
    const apiUrl = `https://localhost:7156/api/User/addIncome/${this.userId}`;
  
    this.http.post(apiUrl, this.incomeSources, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text',
    })
    .subscribe({
      next: (response) => {
        console.log('Income details submitted successfully', response);
  
        // Now load eligible plans instead of navigating to home
        this.loadEligiblePlans(); 
      },
      error: (error) => {
        console.error('Error submitting income details', error);
      },
    });
  }
  

  eligiblePlans: any[] = [];

  loadEligiblePlans() {
    const plansUrl = `https://localhost:7156/api/User/getEligiblePlans/${this.userId}`;
    this.http.get<any[]>(plansUrl).subscribe({
      next: (plans) => {
        this.eligiblePlans = plans;
        this.showPlanSelection = true; // Show plan list
        this.showIncomeForm = false;   // Hide income form
        console.log('Eligible plans loaded:', plans);
      },
      error: (err) => {
        console.error('Failed to load eligible plans', err);
      }
    });
  }
  


selectedPlanId: string | null = null;

submitSelectedPlan(planId: string) {
  if (!this.userId) return;

  const body = {
    userId: this.userId,
    adminPlanId: planId
  };

  this.http.post('https://localhost:7156/api/User/submitSelectedPlan', body)
    .subscribe({
      next: () => {
        console.log('Plan saved successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error submitting plan', err);
      }
    });
}

}
