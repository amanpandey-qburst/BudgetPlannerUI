import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserprofileService } from '../../../Service/userprofile/userprofile.service';

interface Income {
  source: string;
  amount: number;
  creditOn: number;  // Added creditOn field
}

interface User {
  firstName: string;
  lastName: string;
  emailId: string;
  dateOfBirth: string;
  gender: string;
  photoURL: string;
  incomes: Income[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    emailId: '',
    dateOfBirth: '',
    gender: '',
    photoURL: '',
    incomes: []
  };

  isEditMode: boolean = false; // Toggle between Edit and View modes
  newIncome: Income = { source: '', amount: 0, creditOn: 0 }; // New income fields
  isLoading: boolean = true; // Show loading state
  errorMessage: string = ''; // Store any errors

  showAutoResetDialog = false;
  autoResetSettings = {
    isAutoResetEnabled: false,
    autoResetDays: null
  };

  constructor(private userService: UserprofileService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  // Fetch user profile from the API
  fetchUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        // Ensure each income item has the creditOn property
        this.user = { 
          ...data.user, 
          incomes: data.incomes.map((income: any) => ({
            ...income,
            creditOn: income.creditOn ?? 0  // Default to 0 if creditOn is missing
          }))
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch user profile. Please try again later.';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  // Toggle Edit mode
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  // Add a new income
  addIncome(): void {
    if (this.newIncome.source && this.newIncome.amount > 0 && this.newIncome.creditOn >= 0) {
      this.user.incomes.push({ ...this.newIncome });
      this.newIncome = { source: '', amount: 0, creditOn: 0 }; // Reset after adding
    }
  }

  // Remove an income
  removeIncome(index: number): void {
    this.user.incomes.splice(index, 1);
  }

  // Edit an income
  editIncome(income: Income, index: number): void {
    this.newIncome = { ...income };  // Pre-fill the form with the income to edit
  }

  // Save the changes
  saveChanges() {
    // Call the update API with the user data
    this.userService.updateUserProfile(this.user).subscribe(
      response => {
        console.log('Profile saved successfully:', response);
        this.toggleEditMode(); // Exit edit mode after saving
      },
      error => {
        console.error('Error saving profile:', error);
      }
    );
  }

  openAutoResetDialog(): void {
    this.showAutoResetDialog = true;
  }

  closeAutoResetDialog(): void {
    this.showAutoResetDialog = false;
  }

  saveAutoResetSettings(): void {
    if (
      this.autoResetSettings.isAutoResetEnabled &&
      (this.autoResetSettings.autoResetDays === null || this.autoResetSettings.autoResetDays <= 0)
    ) {
      alert('Please enter a valid number of days for auto reset.');
      return;
    }

    this.userService.updateAutoResetSettings(this.autoResetSettings).subscribe({
      next: (res) => {
        console.log('Auto reset settings updated:', res);
        this.closeAutoResetDialog();
      },
      error: (err) => {
        console.error('Failed to update auto reset settings:', err);
      }
    });
  }

  removeAutoResetSettings() {
    if (confirm('Are you sure you want to remove auto reset settings?')) {
      this.userService.removeAutoResetSettings().subscribe({
        next: (res) => {
          console.log('Auto reset settings removed:', res);
          this.autoResetSettings = {
            isAutoResetEnabled: false,
            autoResetDays: null
          };
          this.closeAutoResetDialog();
        },
        error: (err) => {
          console.error('Failed to remove auto reset settings:', err);
        }
      });
    }
  }
}
