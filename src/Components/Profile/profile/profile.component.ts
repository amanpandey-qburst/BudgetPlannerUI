import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserprofileService } from '../../../Service/userprofile/userprofile.service';


interface Income {
  source: string;
  amount: number;
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
  newIncome: Income = { source: '', amount: 0 }; // New income fields
  isLoading: boolean = true; // Show loading state
  errorMessage: string = ''; // Store any errors

  constructor(private userService: UserprofileService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  // Fetch user profile from the API
  fetchUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = { ...data.user, incomes: data.incomes }; // Combine user and incomes
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
    if (this.newIncome.source && this.newIncome.amount > 0) {
      this.user?.incomes.push({ ...this.newIncome });
      this.newIncome = { source: '', amount: 0 }; // Reset after adding
    }
  }

  // Save the changes
  saveChanges(): void {
    // In a real-world application, you'd save this data to a backend API
    console.log('Changes saved:', this.user);
    this.toggleEditMode(); // Exit edit mode after saving
  }

  showAutoResetDialog = false;
autoResetSettings = {
  isAutoResetEnabled: false,
  autoResetDays: null
};

openAutoResetDialog() {
  this.showAutoResetDialog = true;
}

closeAutoResetDialog() {
  this.showAutoResetDialog = false;
}

saveAutoResetSettings(): void {
  // Optional: Validate input before sending
  if (
    this.autoResetSettings.isAutoResetEnabled &&
    (this.autoResetSettings.autoResetDays === null || this.autoResetSettings.autoResetDays <= 0)
  ) {
    alert("Please enter a valid number of days for auto reset.");
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
