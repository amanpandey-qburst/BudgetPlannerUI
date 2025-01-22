import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../../Service/expense/expense.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  subCategories: any[] = []; // Full list of subcategories fetched from the API
  filteredSubCategories: any[] = []; // Filtered list based on search text
  expenses: any[] = []; // Expenses fetched from the API
  isModalOpen: boolean = false;
  newExpense: any = {
    expenseName: '',
    amount: null,
    subCategoryId: null,
  };
  searchText: string = ''; // Text input for filtering categories
  selectedSubCategory: string = ''; // Selected subcategory name

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.fetchSubCategories();
    this.fetchExpenses(); // Fetch recent expenses on initialization
  }

  fetchSubCategories(): void {
    this.expenseService.getSubCategories().subscribe({
      next: (data) => {
        this.subCategories = data; // Populate the subcategories array
        this.filteredSubCategories = data; // Initialize filtered list
      },
      error: (error) => {
        console.error('Failed to load subcategories:', error);
      },
    });
  }

  fetchExpenses(): void {
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data; // Populate the expenses array
      },
      error: (error) => {
        console.error('Failed to load expenses:', error);
      },
    });
  }

  onSearchTextChanged(): void {
    if (!this.searchText) {
      this.filteredSubCategories = [...this.subCategories]; // Reset to full list if search is empty
    } else {
      this.filteredSubCategories = this.subCategories.filter((category) =>
        category.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  selectSubCategory(id: string, name: string): void {
    this.newExpense.subCategoryId = id; 
    this.selectedSubCategory = name; 
    this.searchText = name;
    this.filteredSubCategories = [...this.subCategories]; 
  }

  openAddExpenseModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetNewExpense();
  }

  addExpense(): void {
    if (!this.newExpense.expenseName || !this.newExpense.amount || !this.newExpense.subCategoryId) {
      alert('Please fill all the fields.');
      return;
    }

    this.expenseService.addExpense(this.newExpense).subscribe({
      next: () => {
        console.log('Expense added successfully');
        this.expenses.unshift({ ...this.newExpense, createdDate: new Date() }); 
        this.closeModal();
      },
      error: () => {
        console.error('Failed to add expense');
        alert('An error occurred. Please try again later.');
      },
    });
  }

  resetNewExpense(): void {
    this.newExpense = {
      expenseName: '',
      amount: null,
      subCategoryId: null,
    };
    this.selectedSubCategory = '';
    this.searchText = '';
    this.filteredSubCategories = [...this.subCategories];
  }
}
