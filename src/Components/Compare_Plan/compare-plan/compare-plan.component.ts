import { Component, OnInit } from '@angular/core';
import { ComparePlanService } from '../../../Service/compareplan/compareplan.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-compare-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compare-plan.component.html',
  styleUrl: './compare-plan.component.css'
})
export class ComparePlanComponent implements OnInit {
  planName: string = '';
  income: number = 0;
  totalExpense: number = 0;
  userAllocations: any[] = [];
  adminOnlyAllocations: any[] = [];

  constructor(private comparePlanService: ComparePlanService) {}

  ngOnInit(): void {
    this.comparePlanService.compareUserPlan().subscribe({
      next: (response) => {
        this.planName = response.planName;
        this.income = response.income;
        this.totalExpense = response.totalExpense;
        this.userAllocations = response.userAllocations;
        this.adminOnlyAllocations = response.adminOnlyAllocations;
      },
      error: (err) => {
        console.error('Error fetching comparison:', err);
      }
    });
  }
}
