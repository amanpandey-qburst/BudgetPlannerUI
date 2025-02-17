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
  isEditModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  editableExpense: any = null;
  selectedExpense: any = null;
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
  sortColumn: string = 'createdDate'; // Default sorting column
  sortDirection: 'asc' | 'desc' = 'desc';

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
    console.log("hitttt modal");
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

  toggleMenu(expense: any, event: Event): void {
    event.stopPropagation(); // Prevents clicks from closing immediately
  
    this.expenses.forEach(e => {
      if (e !== expense) e.showMenu = false; // Close other menus
    });
  
    expense.showMenu = !expense.showMenu; // Toggle current menu
  }
  
  openEditExpenseModal(expense: any): void {
    this.editableExpense = { ...expense };
    this.isEditModalOpen = true;
    console.log("is edit modal open true");
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editableExpense = null;
  }

  updateExpense(): void {
    // this.expenseService.updateExpense(this.editableExpense).subscribe({
    //   next: () => {
    //     const index = this.expenses.findIndex(e => e.id === this.editableExpense.id);
    //     if (index !== -1) this.expenses[index] = { ...this.editableExpense };
    //     this.closeEditModal();
    //   },
    //   error: () => alert('Failed to update expense'),
    // });
  }

  openDeleteConfirmation(expense: any): void {
    this.selectedExpense = expense;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedExpense = null;
  }

  deleteExpense(): void {
    // this.expenseService.deleteExpense(this.selectedExpense.id).subscribe({
    //   next: () => {
    //     this.expenses = this.expenses.filter(e => e.id !== this.selectedExpense.id);
    //     this.closeDeleteModal();
    //   },
    //   error: () => alert('Failed to delete expense'),
    // });
  }




sortExpenses(column: string): void {
  if (this.sortColumn === column) {
    // Toggle between ascending and descending
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new column and default to ascending
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  // Sorting logic
  this.expenses.sort((a, b) => {
    let valueA = a[column];
    let valueB = b[column];

    // Convert date to timestamp for comparison
    if (column === 'createdDate') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }

    // Convert string to lowercase for case-insensitive sorting
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

// Function to display sorting arrows
getSortIcon(column: string): string {
  if (this.sortColumn !== column) return ''; 
  return this.sortDirection === 'asc' ? '&#9650;' : '&#9660;'; 
}

}
