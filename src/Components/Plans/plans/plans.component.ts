import { Component, OnInit } from '@angular/core';
import { AdminplanService } from '../../../Service/adminplan/adminplan.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../Service/category/category.service';

interface Category {
  id: string;
  name: string;
  description: string;
  isBasic: boolean;
  isDeleted: boolean;
  percentage?: number; // For plans where percentages are allocated
}

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
  categories: Category[] = []; // Holds fetched categories
  availableCategories: Category[] = []; // Categories available for selection
  selectedCategories: Category[] = []; // Categories added to the new plan
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  isAddPlanPopupOpen: boolean = false;
  newPlan: any = { name: '', minimumIncome: 0, categories: [] };

  constructor(
    private planService: AdminplanService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.getPlans();
    this.fetchCategories(); // Fetch categories when the component loads
  }

  getPlans() {
    this.planService.getPlans(this.currentPage).subscribe(
      (data: any) => {
        this.plans = data;
        this.filteredPlans = this.plans;
        this.totalPages = 1;
      },
      (error) => {
        console.error('Error fetching plans:', error);
      }
    );
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.availableCategories = [...this.categories]; // Copy categories for selection
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  navigateToPlanDetails(plan: any) {
    this.router.navigate(['home/plandetails'], { state: { plan } });
  }

  filterPlans() {
    if (!this.searchQuery.trim()) {
      this.filteredPlans = this.plans;
    } else {
      this.filteredPlans = this.plans.filter((plan) =>
        plan.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  openAddPlanPopup() {
    this.isAddPlanPopupOpen = true;
    this.resetForm();
  }

  closeAddPlanPopup() {
    this.isAddPlanPopupOpen = false;
  }

  addCategoryToPlan(category: Category) {
    // Add category to the selected list with a default percentage of 0
    this.selectedCategories.push({ ...category, percentage: 0 });
    // Remove from available categories
    this.availableCategories = this.availableCategories.filter(
      (cat) => cat.id !== category.id
    );
  }

  removeCategoryFromPlan(index: number) {
    const removedCategory = this.selectedCategories[index];
    this.selectedCategories.splice(index, 1);
    // Add back to available categories
    this.availableCategories.push(removedCategory);
  }

  get totalPercentage(): number {
    return this.selectedCategories.reduce(
      (sum, category) => sum + (category.percentage || 0),
      0
    );
  }

  submitPlan() {
    if (this.totalPercentage !== 100) {
      alert('Total percentage allocation must equal 100%!'); // CHANGE: Enhanced user feedback
      return;
    }
  
    // Prepare plan payload
    this.newPlan.categories = this.selectedCategories.map((category) => ({
      id: category.id,
      percentage: category.percentage, // CHANGE: Removed redundant `name` property
    }));
  
    this.planService.addPlan(this.newPlan).subscribe(
      () => {
        this.closeAddPlanPopup(); // CHANGE: Reset popup after submission
        this.getPlans(); // CHANGE: Refresh the plan list
      },
      (error) => {
        console.error('Error adding plan:', error); // CHANGE: Improved error handling
      }
    );
  }

  resetForm() {
    this.newPlan = { name: '', minimumIncome: 0, categories: [] };
    this.selectedCategories = [];
    this.availableCategories = [...this.categories];
  }
}
