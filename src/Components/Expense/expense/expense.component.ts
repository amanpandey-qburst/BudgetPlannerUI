import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent {
  expenses: any[] = [
    {
      expenseName: 'Groceries',
      amount: 1500,
      subCategoryId: '1',
      createdDate: new Date('2025-01-10T14:30:00'),
    },
    {
      expenseName: 'Electricity Bill',
      amount: 2500,
      subCategoryId: '2',
      createdDate: new Date('2025-01-12T09:15:00'),
    },
    {
      expenseName: 'Internet Subscription',
      amount: 1000,
      subCategoryId: '3',
      createdDate: new Date('2025-01-14T18:45:00'),
    },
  ];

  isModalOpen: boolean = false;
  newExpense: any = {
    expenseName: '',
    amount: null,
    subCategoryId: '',
    createdDate: new Date(),
  };

  openAddExpenseModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetNewExpense();
  }

  addExpense() {
    if (this.newExpense.expenseName && this.newExpense.amount && this.newExpense.subCategoryId) {
      this.newExpense.createdDate = new Date();
      this.expenses.unshift({ ...this.newExpense });
      this.closeModal();
    }
  }

  resetNewExpense() {
    this.newExpense = {
      expenseName: '',
      amount: null,
      subCategoryId: '',
      createdDate: new Date(),
    };
  }
}
