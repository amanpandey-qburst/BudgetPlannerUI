import { Component, OnInit } from '@angular/core';
import { ComparePlanService } from '../../../Service/compareplan/compareplan.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDashboardService } from '../../../Service/userdashboard/user-dashboard.service';
import { CategoryService } from '../../../Service/category/category.service';


@Component({
  selector: 'app-compare-plan',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './compare-plan.component.html',
  styleUrl: './compare-plan.component.css'
})
export class ComparePlanComponent implements OnInit {
  planName: string = '';
  income: number = 0;
  totalExpense: number = 0;
  userAllocations: any[] = [];
  adminOnlyAllocations: any[] = [];
  isManageCategoriesModalOpen: boolean = false;
  categories: any[] = [];
  allCategories: any[] = []; 
  existingselectedCategories: any[] = []; 
  searchText: string = ''; 
  remainingCategories: any[] = [];
  selectedCategories: any[] = [];
  availableCategories: any[] = [];
  selectedSearch: string = '';
  availableSearch: string = '';

  constructor(private comparePlanService: ComparePlanService,private dashboardService: UserDashboardService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    
    this.fetchComparisonData();
    this.fetchAllCategories();
    this.filterRemainingCategories();
    this.fetchUserCategories();
  }

  fetchComparisonData(): void {
    this.comparePlanService.compareUserPlan().subscribe({
      next: (response) => {
        this.planName = response.planName;
        this.income = response.income;
        this.totalExpense = response.totalExpense;
        this.userAllocations = response.userAllocations;
        this.adminOnlyAllocations = response.adminOnlyAllocations;
      },
      error: (err) => {
        console.error('Error fetching comparison:', err);
      }
    });

  }

 
  fetchUserCategories(): void {
    this.dashboardService.getUserCategories().subscribe(
      (response) => {
        this.selectedCategories = response.selectedCategories;
        this.availableCategories = response.availableCategories;
      },
      (error) => {
        console.error('Error fetching user categories:', error);
      }
    );
  }

  fetchAllCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.allCategories = categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
        }));
       
      },
      (error) => console.error('Error fetching categories:', error)
    );
  }

  filterRemainingCategories(): void {
    this.remainingCategories = this.allCategories.filter(
      (category) =>
        !this.existingselectedCategories.some(
          (selected) => selected.categoryID === category.id
        )
    );
    console.log('Remaining Categories:', this.remainingCategories);
  }
  

  onSearchTextChanged(): void {
    this.allCategories = this.allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );

    console.log(this.allCategories);
  }

  selectCategory(category: any): void {
    const alreadySelected = this.existingselectedCategories.find((c) => c.id === category.id);
    if (!alreadySelected) {
      this.existingselectedCategories.push({ ...category, allocation: 0 });
    }
  }

  

openManageCategoriesModal(): void {
  this.isManageCategoriesModalOpen = true;
  console.log("open mange");
}

closeManageCategoriesModal(): void {
  this.isManageCategoriesModalOpen = false;
  console.log("hitmanage");
}



// Save Changes to API
saveCategoryChanges(): void {
  // Use the latest selectedCategories instead of existingselectedCategories
  const selectedCategoryIds = this.selectedCategories.map(cat => cat.categoryId);

  // Compare with the categories array to check which ones are removed
  const removedCategories = this.categories
    .filter(cat => !selectedCategoryIds.includes(cat.categoryId))
    .map(cat => cat.categoryId);


  // Send only the latest selected categories (not the old existing ones)
  this.dashboardService.updateCategories( selectedCategoryIds).subscribe(
    () => {

      // Handle further UI updates like closing modals or refreshing data

      this.fetchComparisonData();
      this.closeManageCategoriesModal();
    },
    (error) => {
      console.error("Error updating categories:", error);
    }
  );
}


moveToAvailable(category: any) {
  this.selectedCategories = this.selectedCategories.filter(c => c.categoryId !== category.categoryId);
  this.availableCategories.push(category);
}

// Move category from available to selected
moveToSelected(category: any) {
  this.availableCategories = this.availableCategories.filter(c => c.categoryId !== category.categoryId);
  this.selectedCategories.push(category);
  console.log('Selected Categories after move:', this.selectedCategories);

}

// Filter selected categories based on search
filteredSelectedCategories() {
  return this.selectedCategories.filter(cat =>
    cat.categoryName.toLowerCase().includes(this.selectedSearch.toLowerCase())
  );
}

// Filter available categories based on search
filteredAvailableCategories() {
  return this.availableCategories.filter(cat =>
    cat.categoryName.toLowerCase().includes(this.availableSearch.toLowerCase())
  );
}

}
