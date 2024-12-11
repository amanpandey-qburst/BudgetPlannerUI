import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminplanService } from '../../../Service/adminplan/adminplan.service';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatSliderModule],
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css'],
})
export class PlanDetailComponent implements OnInit {
  plan: any;
  isEditing: boolean = false; // Tracks edit mode

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
  }

  saveChanges() {
    // this.planService.updatePlan(this.plan).subscribe(
    //   (response) => {
    //     console.log('Plan updated successfully:', response);
    //     this.isEditing = false; // Exit edit mode
    //   },
    //   (error) => {
    //     console.error('Error saving changes:', error);
    //   }
    // );
  }

  cancelEdit() {
    this.planService.getPlanDetails(this.plan.id).subscribe((data) => {
      this.plan = data;
    });
    this.isEditing = false;
  }

  deletePlan() {
    // this.planService.deletePlan(this.plan.id).subscribe(
    //   () => {
    //     console.log('Plan deleted successfully');
    //     this.router.navigate(['home/plans']);
    //   },
    //   (error) => {
    //     console.error('Error deleting plan:', error);
    //   }
    // );
  }

  deleteCategory(category: any) {
    const index = this.plan.categories.indexOf(category);
    if (index > -1) {
      this.plan.categories.splice(index, 1);
    }
  }
}
