import { Component, OnInit } from '@angular/core';
import { AdminplanService } from '../../../Service/adminplan/adminplan.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
})
export class PlansComponent implements OnInit {
  plans: any[] = [];
  filteredPlans: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  isAddPlanPopupOpen: boolean = false;
  newPlan: any = { name: '', minimumIncome: 0 };

  constructor(private planService: AdminplanService, private router: Router) {}

  ngOnInit() {
    this.getPlans();
  }

  getPlans() {
    this.planService.getPlans(this.currentPage).subscribe(
      (data: any) => {
        // Assuming data is an array of plans
        this.plans = data;
        this.filteredPlans = this.plans; // Initialize filtered plans with all plans
        this.totalPages = 1; // Set totalPages manually if not provided
      },
      (error) => {
        console.error('Error fetching plans:', error);
      }
    );
  }

  // Filter the plans based on the search query
  filterPlans() {
    if (!this.searchQuery.trim()) {
      this.filteredPlans = this.plans; // If no search query, show all plans
    } else {
      this.filteredPlans = this.plans.filter((plan) =>
        plan.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  // Navigate to the plan details page
  navigateToPlanDetails(plan: any) {
    this.router.navigate(['home/plandetails'], { state: { plan } });
  }

  openAddPlanPopup() {
    this.isAddPlanPopupOpen = true;
  }

  closeAddPlanPopup() {
    this.isAddPlanPopupOpen = false;
  }

  submitPlan() {
    this.planService.addPlan(this.newPlan).subscribe(() => {
      this.closeAddPlanPopup();
      this.getPlans();
    });
  }

  // Watch the searchQuery and update filteredPlans accordingly
  ngOnChanges() {
    this.filterPlans();
  }
}
