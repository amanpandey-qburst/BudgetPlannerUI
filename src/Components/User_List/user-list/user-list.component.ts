import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminDashboardService, UserDetail } from '../../../Service/admindashboard/admin-dashboard.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserDetail[] = [];
  searchText = '';
  currentPage = 1;
  itemsPerPage = 9;
  isUserSelected = false;
  selectedUserFinancialDetails: any;
  
  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.adminDashboardService.getNonAdminUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchUserFinancialDetails(userId: string) {
    this.adminDashboardService.getUserFinancialDetails(
      `https://localhost:7156/api/AdminDashboard/get-user-financial-details/${userId}`
    ).subscribe((response) => {
      this.selectedUserFinancialDetails = this.calculateFinancialSummary(response);
      this.isUserSelected = true;
    });
  }
  
  calculateFinancialSummary(response: any) {
    return {
      totalIncome: response.plans[0].income,
      totalExpenses: response.plans[0].totalExpense,
      categoryExpenses: response.plans[0].userPlanAllocations.map((category: { categoryName: string, expense: number }) => ({
        categoryName: category.categoryName,
        expense: category.expense
      }))
    };
  }
  
  
  closeModal() {
    this.isUserSelected = false;
  }
  

  get totalPages(): number {
    return Math.ceil(this.filteredUsers().length / this.itemsPerPage);
  }

  filteredUsers(): UserDetail[] {
    let filtered = this.users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchText.toLowerCase())
    );

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}