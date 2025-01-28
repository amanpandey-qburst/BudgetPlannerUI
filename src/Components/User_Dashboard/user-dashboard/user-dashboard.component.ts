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
  isEditModalOpen: boolean = false;
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

  // selectCategory(categoryId: number, categoryName: string): void {
  //   const existing = this.selectedCategories.find((cat) => cat.id === categoryId);
  //   if (!existing) {
  //     this.selectedCategories.push({
  //       id: categoryId,
  //       name: categoryName,
  //       allocation: 0,
  //     });
  //   }
  // }

  

  saveChanges(): void {
    // this.totalAllocation = this.selectedCategories.reduce((sum, cat) => sum + cat.allocation, 0);
    // if (this.totalAllocation > 100) {
    //   alert('Total allocation cannot exceed 100%. Please adjust your categories.');
    //   return;
    // }

    // // API logic to save categories (e.g., `dashboardService.updateCategories()`)
    // console.log('Selected Categories:', this.selectedCategories);
    // this.isEditModalOpen = false;
  }

  closeModal(): void {
    this.isEditModalOpen = false;
  }

  
  editCategories(): void {
    this.isEditModalOpen = true;
    console.log(this.categories);
    console.log(this.existingselectedCategories);
    console.log(this.allCategories);
    console.log(this.remainingCategories);
  }


  addCategory(): void {
    if (this.newCategory.name && this.newCategory.allocation > 0) {
      const newCategory = {
        ...this.newCategory,
        spent: 0,
        color: this.getCategoryColor(this.categories.length),
      };
      this.categories.push(newCategory);
      this.newCategory = { name: '', allocation: 0 }; // Reset input fields
    } else {
      alert('Please fill in both the category name and allocation.');
    }
  }

  removeCategory(index: number): void {
    this.categories.splice(index, 1);
  }

  



}