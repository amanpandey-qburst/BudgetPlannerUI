import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminplanService } from '../../../Service/adminplan/adminplan.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css'],
})
export class PlanDetailComponent implements OnInit {
  plan: any;
  isEditing: boolean = false; // Tracks edit mode
  errorMessage: string = '';

  constructor(private router: Router, private planService: AdminplanService) {}

  ngOnInit(): void {
    this.plan = history.state.plan;
    if (!this.plan) {
      this.router.navigate(['home/plans']);
    } else {
      this.planService.getPlanDetails(this.plan.id).subscribe(
        (data) => {
          this.plan = data;
        },
        (error) => {
          console.error('Error fetching plan details:', error);
          this.router.navigate(['home/plans']);
        }
      );
    }
  }

  toggleEditMode() {
    this.isEditing = true;
    this.errorMessage = ''; // Clear any previous validation errors
    console.log('Edit mode enabled:', this.isEditing);
  }

  validateAllocations(): boolean {
    const totalPercentage = this.plan.categories.reduce(
      (sum: number, category: any) => sum + category.allocationPercentage,
      0
    );
    if (totalPercentage !== 100) {
      this.errorMessage =
        'Total allocation percentage for categories must equal 100%.';
      return false;
    }
    return true;
  }

  saveChanges() {
    console.log('clicked saveChanges');
    if (!this.validateAllocations()) {
      return; // Abort saving if validation fails
    }

    // Map categories to expected format for the API
    const categoriesToSend = this.plan.categories.map((category: any) => ({
      id: category.categoryId, // Category ID for API
      percentage: category.allocationPercentage, // Percentage for API
    }));

    // Prepare the updated plan object to send to the API
    const updatedPlan = {
      name: this.plan.name,
      minimumIncome: this.plan.minimumIncome,
      categories: categoriesToSend, // Send the transformed categories
    };

    this.planService.updatePlan(this.plan.id, updatedPlan).subscribe(
      (response) => {
        console.log('Plan updated successfully:', response);
        this.isEditing = false; // Exit edit mode
        this.errorMessage = ''; // Clear validation errors
      },
      (error) => {
        console.error('Error saving changes:', error);
        this.errorMessage = 'Failed to save changes. Please try again.';
      }
    );

    this.isEditing = false;
  }


  cancelEdit() {
    this.planService.getPlanDetails(this.plan.id).subscribe((data) => {
      this.plan = data;
    });
    this.isEditing = false;
  }

  deletePlan() {
    this.planService.deletePlan(this.plan.id).subscribe(
      (response) => {
        console.log('Plan and categories deleted successfully:', response);
        this.router.navigate(['home/plans']);
      },
      (error) => {
        console.error('Error deleting plan:', error);
        this.errorMessage = 'Failed to delete the plan. Please try again.';
      }
    );
  }

  deleteCategory(category: any) {
    const index = this.plan.categories.indexOf(category);
    if (index > -1) {
      this.plan.categories.splice(index, 1);
    }
  }
}
