import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UserDashboardService } from '../../../Service/userdashboard/user-dashboard.service';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../Service/category/category.service';

Chart.register(...registerables);

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  isAllocationModalOpen: boolean = false;
  isManageCategoriesModalOpen: boolean = false;
  categories: any[] = [];
  allCategories: any[] = []; 
  existingselectedCategories: any[] = []; 
  searchText: string = ''; 
  remainingCategories: any[] = [];
  totalAllocation: number = 0;
  planName: string = '';
  userIncome: number = 0;
  totalExpenditure: number = 0;
  remainingMoney: number = 0;
  predefinedColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF',
  ];
  colors: string[] = [];
  newCategory = { name: '', allocation: 0 }; 
 

  constructor(private dashboardService: UserDashboardService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    this.fetchAllCategories();
    this.filterRemainingCategories();
  }

  fetchDashboardData(): void {
    this.dashboardService.getUserPlanDetails().subscribe(
      (response) => {
        // Map API data to component properties
        this.planName = response.planName || 'Default Plan';
        this.userIncome = response.income || 0;
        this.totalExpenditure = response.totalExpense || 0;
        this.remainingMoney = this.userIncome - this.totalExpenditure;

        // Map allocations to categories
        this.categories = response.allocations.map((allocation: any, index: number) => ({
          categoryID: allocation.categoryId,
          name: allocation.categoryName,
          allocation: allocation.allocation,
          spent: allocation.expense,
          color: this.getCategoryColor(index),
        }));

        this.existingselectedCategories = [...this.categories]; 

        // Render the chart
        this.renderPieChart();
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }


  getCategoryColor(index: number): string {
    if (index < this.predefinedColors.length) {
      return this.predefinedColors[index];
    }
    return this.generateRandomLightColor();
  }

  generateRandomLightColor(): string {
    const r = Math.floor(200 + Math.random() * 55); // Light R
    const g = Math.floor(200 + Math.random() * 55); // Light G
    const b = Math.floor(200 + Math.random() * 55); // Light B
    return `rgb(${r}, ${g}, ${b})`;
  }

  renderPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!ctx) return;

    const chartData = {
      labels: this.categories.map((c) => c.name),
      datasets: [
        {
          data: this.categories.map((c) => c.allocation),
          backgroundColor: this.categories.map((c) => c.color),
          borderWidth: 1,
        },
      ],
    };

    new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        plugins: {
          legend: { display: false },
        },
      },
    });
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
  

  filterCategories(): any[] {
    if (!this.searchText.trim()) return this.allCategories;
    return this.allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }




  
  openAllocationModal(): void {
    this.isManageCategoriesModalOpen = false; // Close other modal
    this.isAllocationModalOpen = true;
    console.log("open allocartion");
  }
  
  

closeAllocationModal(): void {
  this.isAllocationModalOpen = false;
  console.log("hitallocation");
}

saveAllocationChanges(): void {
  let totalAllocation = this.categories.reduce((sum, cat) => sum + cat.allocation, 0);
  if (totalAllocation > 100) {
      alert("Total allocation cannot exceed 100%");
      return;
  }

  const categoryAllocations = this.categories.map(category => ({
    categoryId: category.categoryID,
    allocation: category.allocation
  }));

  this.dashboardService.editCategoryAllocation("b42c484a-2305-4286-9959-160b39f1527e", categoryAllocations).subscribe(
    () => {
      alert("Allocations updated successfully!");
      // Handle further UI updates like closing modals or refreshing data
    },
    (error) => {
      console.error("Error updating allocations:", error);
    }
  );
}




openManageCategoriesModal(): void {
  this.isAllocationModalOpen = false; // Close other modal
  this.isManageCategoriesModalOpen = true;
  console.log("open mange");
}

closeManageCategoriesModal(): void {
  this.isManageCategoriesModalOpen = false;
  console.log("hitmanage");
}

// Add Category
addCategory(category: any): void {
  if (!this.categories.some((cat) => cat.categoryID === category.id)) {
    this.categories.push({ ...category, allocation: 0, categoryID: category.id });
    this.existingselectedCategories.push({ ...category, allocation: 0, categoryID: category.id });
    this.filterRemainingCategories(); // Refilter remaining categories after adding
  }
}

// Remove Category
removeCategory(index: number): void {
  // Get the category to be removed
  const categoryToRemove = this.categories[index];

  // Remove from the categories list (UI update)
  this.categories.splice(index, 1);

  // Remove from the selected category list (selectedCategoryIds)
  const categoryIndex = this.existingselectedCategories.findIndex(
    (cat) => cat.categoryID === categoryToRemove.categoryID
  );
  if (categoryIndex !== -1) {
    this.existingselectedCategories.splice(categoryIndex, 1);
  }

  // Optionally, you could log to see the updated lists
  console.log("Updated Categories List:", this.categories);
  console.log("Updated Selected Categories List:", this.existingselectedCategories);
}


// Save Changes to API
saveCategoryChanges(): void {
  // Find the current selected categories based on categoryID
  const selectedCategoryIds = this.existingselectedCategories.map(cat => cat.categoryID);

  // Compare with the categories array to check which ones are removed
  const removedCategories = this.categories
    .filter(cat => !selectedCategoryIds.includes(cat.categoryID))
    .map(cat => cat.categoryID);

  console.log('Selected Category IDs:', selectedCategoryIds);
  console.log('Removed Categories:', removedCategories);

  // Now only send the selected categories (added/remaining categories)
  this.dashboardService.updateCategories("abfd7851-bfb7-44b8-9a91-de700aab888d", selectedCategoryIds).subscribe(
    () => {
      alert("Categories updated successfully!");
      // Handle further UI updates like closing modals or refreshing data
    },
    (error) => {
      console.error("Error updating categories:", error);
    }
  );
}






}