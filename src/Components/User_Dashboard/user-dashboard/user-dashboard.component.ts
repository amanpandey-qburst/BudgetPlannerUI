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
  imports: [CommonModule,FormsModule ],
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
  allocationError: string = '';
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
  selectedCategories: any[] = [];
  availableCategories: any[] = [];
  selectedSearch: string = '';
  availableSearch: string = '';
 

  constructor(private dashboardService: UserDashboardService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    this.fetchAllCategories();
    this.filterRemainingCategories();
    this.fetchUserCategories();
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
  

  // filterCategories(): any[] {
  //   if (!this.searchText.trim()) return this.allCategories;
  //   return this.allCategories.filter((cat) =>
  //     cat.name.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }




  
  openAllocationModal(): void {
    this.isManageCategoriesModalOpen = false; // Close other modal
    this.isAllocationModalOpen = true;
    this.updateTotalAllocation();
  }
  
  

closeAllocationModal(): void {
  this.isAllocationModalOpen = false;
}

updateTotalAllocation(): void {
  this.totalAllocation = this.categories.reduce((sum, cat) => sum + Number(cat.allocation || 0), 0);
  this.allocationError = this.totalAllocation !== 100 ? "Total allocation must be exactly 100%" : "";
}

saveAllocationChanges(): void {
  let totalAllocation = this.categories.reduce((sum, cat) => sum + cat.allocation, 0);

  if (totalAllocation !== 100) {
    this.allocationError = "Total allocation must be exactly 100%";
    return;
}

this.allocationError = '';

  const categoryAllocations = this.categories.map(category => ({
    categoryId: category.categoryID,
    allocation: category.allocation
  }));

  this.dashboardService.editCategoryAllocation( categoryAllocations).subscribe(
    () => {
      this.closeAllocationModal();
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
      this.fetchDashboardData();


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