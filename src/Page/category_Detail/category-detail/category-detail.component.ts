import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../Service/category/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css',
})
export class CategoryDetailComponent implements OnInit {
  category: any;
  isEditCategoryModalOpen = false;
  editCategoryData = { name: '', description: '' };

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.category = history.state.category;
    if (!this.category) {
      this.router.navigate(['home/categories']);
    }
  }

  openEditCategoryModal(): void {
    this.editCategoryData.name = this.category.name;
    this.editCategoryData.description = this.category.description;
    this.isEditCategoryModalOpen = true;
  }

  closeEditCategoryModal(): void {
    this.isEditCategoryModalOpen = false;
  }

  submitEditCategory(): void {
    if (this.category) {
      const updatedCategory = { ...this.category, ...this.editCategoryData };
      this.categoryService
        .updateCategory(updatedCategory.id, updatedCategory)
        .subscribe(
          () => {
            this.category = updatedCategory;
            this.closeEditCategoryModal();
          },
          (error) => {
            console.error('Error updating category', error);
          }
        );
    }
  }
}
