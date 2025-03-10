import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AdminDashboardService, GraphDataResponse, CategoryExpense } from '../../../Service/admindashboard/admin-dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  startDate: string = "";
  endDate: string = "";

  chart: any;
  graphData: any[] = [];
  distinctCategories: any[] = [];
  expensesData: CategoryExpense[] = [];
  colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A1"];

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.updateChart(7); // Default to last 7 days
  }

  ngAfterViewInit() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  /** 
   * Convert dates to YYYY-MM-DD format (backend expects standard date format)
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Extract only YYYY-MM-DD
  }

  fetchCustomDateRange() {
    if (this.startDate && this.endDate) {
      this.fetchGraphData(this.startDate, this.endDate);
    } else {
      console.error('Please select both start and end dates.');
    }
  }


  /** 
   * Fetch graph data for a specific date range
   */
  fetchGraphData(startDate: string, endDate: string) {
    this.adminDashboardService.getGraphDataForDateRange(startDate, endDate).subscribe(
      (response: GraphDataResponse) => {
        this.graphData = response.graphData;
        this.distinctCategories = response.distinctCategories;
        this.fetchExpensesForDateRange(startDate, endDate);
        this.createChart(startDate, endDate);
      },
      (error) => {
        console.error('Error fetching graph data:', error);
      }
    );
  }

  /** 
   * Fetch category-wise expense data for a specific date range
   */
  fetchExpensesForDateRange(startDate: string, endDate: string) {
    this.adminDashboardService.getExpensesForDateRange(startDate, endDate).subscribe(
      (expenses: CategoryExpense[]) => {
        this.expensesData = expenses;
        this.createChart(startDate, endDate);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  /** 
   * Updates chart based on selected number of days
   * It calculates the start date and calls `fetchGraphData()`
   */
  updateChart(days: number) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1); // Calculate start date

    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(today);

    this.fetchGraphData(formattedStartDate, formattedEndDate);
  }

  /**
   * Create the bar chart for graph data
   */
  createChart(startDate: string, endDate: string) {
    const labels = this.getAllDatesInRange(startDate, endDate);

    const datasets = this.distinctCategories.map((category, index) => {
      return {
        label: category.categoryName,
        data: labels.map(date => {
          const categoryExpense = this.graphData.find(data => new Date(data.date).toLocaleDateString() === date)
            ?.categoryExpenses.find((exp: CategoryExpense) => exp.categoryId === category.categoryId);
          return categoryExpense ? categoryExpense.totalAmount : 0;
        }),
        backgroundColor: this.colors[index % this.colors.length],
        stack: 'stack1',
      };
    });

    // Destroy previous chart before creating a new one
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("barChart", {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Expenses by Category and Date'
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    });
  }

  /**
   * Get all dates between start and end date in 'MM/DD/YYYY' format
   */
  getAllDatesInRange(startDate: string, endDate: string): string[] {
    const allDates: string[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      allDates.push(currentDate.toLocaleDateString());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return allDates;
  }
}
