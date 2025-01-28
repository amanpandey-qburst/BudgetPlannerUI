import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AdminDashboardService, GraphDataResponse, CategoryExpense } from '../../../Service/admindashboard/admin-dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  chart: any;
  graphData: any[] = [];
  distinctCategories: any[] = [];
  expensesData: CategoryExpense[] = [];
  colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A1"];

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.fetchGraphData(7); // Default to 30 days
  }

  ngAfterViewInit() {
    window.addEventListener('resize', this.onResize.bind(this)); // Listen for resize events
  }

  onResize() {
    if (this.chart) {
      this.chart.resize(); // Resize chart when window is resized
    }
  }

  fetchGraphData(lastDays: number) {
    this.adminDashboardService.getGraphDataForLastDays(lastDays).subscribe(
      (response: GraphDataResponse) => {
        this.graphData = response.graphData;
        this.distinctCategories = response.distinctCategories;
        this.fetchExpensesForLastDays(lastDays); 
        this.createChart(lastDays);
      },
      (error) => {
        console.error('Error fetching graph data:', error);
      }
    );
  }

  fetchExpensesForLastDays(lastDays: number) {
    this.adminDashboardService.getExpensesForLastDays(lastDays).subscribe(
      (expenses: CategoryExpense[]) => {
        this.expensesData = expenses;
        this.createChart(lastDays); // After getting expenses data, create the chart
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  updateChart(days: number) {
    this.fetchGraphData(days);
  }

  createChart(days: number) {
    const labels = this.getAllDatesInRange(days);

    const datasets = this.distinctCategories.map((category, index) => {
      return {
        label: category.categoryName,
        data: labels.map(date => {
          const categoryExpense = this.graphData.find(data => new Date(data.date).toLocaleDateString() === date)
            ?.categoryExpenses.find((exp: CategoryExpense) => exp.categoryId === category.categoryId);
          return categoryExpense ? categoryExpense.totalAmount : 0;
        }),
        backgroundColor: this.colors[index],
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
        maintainAspectRatio: false, // Allow resizing
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

  getAllDatesInRange(lastDays: number): string[] {
    const allDates: string[] = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - lastDays + 1); // Start date for the selected range

    while (currentDate <= today) {
      allDates.push(currentDate.toLocaleDateString());
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return allDates;
  }
}
