import { Component, OnInit } from '@angular/core';
import {
  Category,
  CategoryCreateDto,
  CategoryService,
} from '../../../Service/category/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TruncatePipe } from '../../../Pipe/truncate.pipe';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  searchQuery: string = ''; 
  categories: Category[] = []; 
  isAddCategoryPopupOpen = false; 
  newCategory: Category = {
    id: '',
    name: '',
    description: '',
    isBasic: false,
    isDeleted: false,
  };

  currentPage: number = 1; 
  itemsPerPage: number = 8; 

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch categories from API
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  // Compute total pages based on filtered results
  get totalPages(): number {
    return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
  }

  // Filter categories based on search query
  get filteredCategories(): Category[] {
    if (!this.searchQuery.trim()) {
      return this.categories; // Return original if no search query
    }
    return this.categories.filter((category) =>
      category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Paginate filtered categories
  get paginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, endIndex);
  }

  // Open the add category popup
  openAddCategoryPopup(): void {
    this.isAddCategoryPopupOpen = true;
  }

  // Close the add category popup
  closeAddCategoryPopup(): void {
    this.isAddCategoryPopupOpen = false;
  }

  // Navigate to category details
  navigateToCategoryDetails(category: any): void {
    this.router.navigate(['home/categorydetails'], { state: { category } });
  }

  // Submit new category to API
  submitCategory(): void {
    const newCategoryData: CategoryCreateDto = {
      name: this.newCategory.name,
      description: this.newCategory.description,
    };

    this.categoryService.addCategory(newCategoryData).subscribe(
      (response) => {
        this.categories.push(response); // Add new category locally
        this.closeAddCategoryPopup(); // Close the popup
      },
      (error) => {
        console.error('Error adding category', error);
      }
    );
  }
}
