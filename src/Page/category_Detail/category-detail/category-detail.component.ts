import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../Service/category/category.service';
import { SubcategoryService } from '../../../Service/subcategory/subcategory.service';
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
  isCreateSubcategoryModalOpen = false;
  editCategoryData = { name: '', description: '' };
  editSubcategoryData = { id: '', name: '', description: '' };
  subcategories: any[] = [];
  newSubcategoryData = { name: '', description: '' };

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.category = history.state.category;
    if (!this.category) {
      this.router.navigate(['home/categories']);
    }
    this.fetchSubcategories();
  }

  fetchSubcategories(): void {
    console.log('subcategori fetched');
    this.subcategoryService
      .getSubCategoriesByCategoryId(this.category.id)
      .subscribe(
        (data) => {
          this.subcategories = data;
        },
        (error) => {
          console.error('Error fetching subcategories:', error);
          this.subcategories = []; // Ensure the array is empty on error
        }
      );
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

  deleteCategory(): void {
    this.categoryService.deleteCategory(this.category.id).subscribe(
      () => {
        this.router.navigate(['home/categories']);
      },
      (error) => {
        console.error('Error deleting category', error);
      }
    );
  }

  // Open modal to create new subcategory
  openCreateSubcategoryModal(): void {
    this.isCreateSubcategoryModalOpen = true;
    this.newSubcategoryData = { name: '', description: '' }; // Reset form
  }

  // Close create subcategory modal
  closeCreateSubcategoryModal(): void {
    this.isCreateSubcategoryModalOpen = false;
  }

  // Submit create subcategory form
  submitCreateSubcategory(): void {
    const subcategoryToCreate = {
      ...this.newSubcategoryData,
      categoryId: this.category.id, // Make sure to associate it with the current category
    };

    this.subcategoryService.createSubCategory(subcategoryToCreate).subscribe(
      (newSubcategory) => {
        this.subcategories.push(newSubcategory); // Add the new subcategory to the list
        this.closeCreateSubcategoryModal(); // Close modal
      },
      (error) => {
        console.error('Error creating subcategory:', error);
      }
    );
  }

  editSubcategory(subcategory: any): void {
    this.editCategoryData.name = subcategory.name;
    this.editCategoryData.description = subcategory.description;
    this.isEditCategoryModalOpen = true;
  }
  deleteSubcategory(id: string): void {
    this.subcategoryService.deleteSubCategory(id).subscribe(
      () => {
        this.fetchSubcategories(); // Re-fetch subcategories from the server
      },
      (error) => {
        console.error('Error deleting subcategory:', error);
      }
    );
  }

  isConfirmDeleteModalOpen = false;
  confirmMessage = '';
  itemToDelete: { type: 'category' | 'subcategory'; id: string } | null = null;

  openConfirmModal(itemType: 'category' | 'subcategory', id: string): void {
    this.isConfirmDeleteModalOpen = true;
    this.itemToDelete = { type: itemType, id };
    this.confirmMessage =
      itemType === 'category'
        ? 'Are you sure you want to delete this category?'
        : 'Are you sure you want to delete this subcategory?';
  }

  closeConfirmModal(): void {
    this.isConfirmDeleteModalOpen = false;
    this.itemToDelete = null;
  }

  confirmDeletion(): void {
    if (this.itemToDelete) {
      const { type, id } = this.itemToDelete;
      if (type === 'category') {
        this.categoryService.deleteCategory(id).subscribe(
          () => {
            this.router.navigate(['home/categories']);
            this.closeConfirmModal();
          },
          (error) => {
            console.error('Error deleting category', error);
          }
        );
      } else if (type === 'subcategory') {
        this.subcategoryService.deleteSubCategory(id).subscribe(
          () => {
            this.fetchSubcategories();
            this.closeConfirmModal();
          },
          (error) => {
            console.error('Error deleting subcategory', error);
          }
        );
      }
    }
  }
}
