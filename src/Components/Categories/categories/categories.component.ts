import { Component, OnInit } from '@angular/core';
import {
  Category,
  CategoryCreateDto,
  CategoryService,
} from '../../../Service/category/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isAddCategoryPopupOpen = false;
  newCategory: Category = {
    id: '',
    name: '',
    description: '',
    isBasic: false,
    isDeleted: false,
  };

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  currentPage: number = 1;
  itemsPerPage: number = 8;

  // Compute the total number of pages
  get totalPages(): number {
    return Math.ceil(this.categories.length / this.itemsPerPage);
  }

  // Get the categories to display on the current page
  get paginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.categories.slice(startIndex, endIndex);
  }

  addCategory(): void {
    console.log('Add Category card clicked');
  }

  openAddCategoryPopup(): void {
    this.isAddCategoryPopupOpen = true;
  }

  // Close the add category popup
  closeAddCategoryPopup(): void {
    this.isAddCategoryPopupOpen = false;
  }

  navigateToCategoryDetails(category: any): void {
    this.router.navigate(['home/categorydetails'], { state: { category } });
  }

  submitCategory(): void {
    // Ensure only name and description are sent
    const newCategoryData: CategoryCreateDto = {
      name: this.newCategory.name,
      description: this.newCategory.description,
    };

    // Send the new category to your API
    this.categoryService.addCategory(newCategoryData).subscribe(
      (response) => {
        // Add the newly created category to the local list
        this.categories.push(response);

        // Close the popup after adding the category
        this.closeAddCategoryPopup();
      },
      (error) => {
        console.error('Error adding category', error);
      }
    );
  }
}
