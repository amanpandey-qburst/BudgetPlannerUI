import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminplanService } from '../../../Service/adminplan/adminplan.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.css',
})
export class PlanDetailComponent implements OnInit {
  plan: any;
  constructor(private router: Router, private planService: AdminplanService) {}

  ngOnInit(): void {
    this.plan = history.state.plan;
    console.log(this.plan);
    if (!this.plan) {
      this.router.navigate(['home/plans']);
    } else {
      this.planService.getPlanDetails(this.plan.id).subscribe(
        (data) => {
          this.plan = data;
          console.log(this.plan);
        },
        (error) => {
          console.error('Error fetching plan details:', error);
          this.router.navigate(['home/plans']);
        }
      );
    }
  }
}
