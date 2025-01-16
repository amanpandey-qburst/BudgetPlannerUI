import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UserDashboardService } from '../../../Service/userdashboard/user-dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  planName: string = '';
  userIncome: number = 0;
  totalExpenditure: number = 0;
  remainingMoney: number = 0;
  categories: any[] = [];
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

  constructor(private dashboardService: UserDashboardService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
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
          name: allocation.categoryName,
          allocation: allocation.allocation,
          spent: allocation.expense,
          color: this.getCategoryColor(index),
        }));

        // Render the chart
        this.renderPieChart();
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }

  getCategoryColor(index: number): string {
    // Use predefined colors, and generate additional colors if necessary
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
}
