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
  styleUrls: ['./category-detail.component.css'],
})
export class CategoryDetailComponent implements OnInit {
  // Current category and its subcategories
  category: any;
  subcategories: any[] = [];

  // Modal states
  isEditModalOpen = false;
  isCreateSubcategoryModalOpen = false;
  isConfirmDeleteModalOpen = false;

  // Dynamic modal data
  editData: { id: string; name: string; description: string } = {
    id: '',
    name: '',
    description: '',
  };
  editType: 'category' | 'subcategory' = 'category';

  // New subcategory form data
  newSubcategoryData = { name: '', description: '' };

  // Confirm deletion
  confirmMessage = '';
  itemToDelete: { type: 'category' | 'subcategory'; id: string } | null = null;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.category = history.state.category;
    if (!this.category) {
      this.router.navigate(['home/categories']);
    } else {
      this.fetchSubcategories();
    }
  }

  // Fetch subcategories for the current category
  fetchSubcategories(): void {
    this.subcategoryService
      .getSubCategoriesByCategoryId(this.category.id)
      .subscribe(
        (data) => {
          this.subcategories = data;
        },
        (error) => {
          console.error('Error fetching subcategories:', error);
          this.subcategories = []; // Reset subcategories on error
        }
      );
  }

  // Open edit modal for category or subcategory
  openEditModal(item: any, type: 'category' | 'subcategory'): void {
    this.editType = type;
    this.editData = {
      id: item.id,
      name: item.name,
      description: item.description,
    };
    this.isEditModalOpen = true;
  }

  // Close the edit modal
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editData = { id: '', name: '', description: '' };
  }

  // Submit edit form for category or subcategory
  submitEdit(): void {
    if (this.editType === 'category') {
      const updatedCategory = { ...this.category, ...this.editData };
      this.categoryService
        .updateCategory(updatedCategory.id, updatedCategory)
        .subscribe(
          () => {
            this.category = updatedCategory;
            this.closeEditModal();
          },
          (error) => {
            console.error('Error updating category:', error);
          }
        );
    } else if (this.editType === 'subcategory') {
      this.subcategoryService
        .editSubCategory(this.editData.id, this.editData)
        .subscribe(
          () => {
            const index = this.subcategories.findIndex(
              (s) => s.id === this.editData.id
            );
            if (index !== -1) {
              this.subcategories[index] = { ...this.editData };
            }
            this.closeEditModal();
          },
          (error) => {
            console.error('Error updating subcategory:', error);
          }
        );
    }
  }

  // Open modal to create a new subcategory
  openCreateSubcategoryModal(): void {
    this.isCreateSubcategoryModalOpen = true;
    this.newSubcategoryData = { name: '', description: '' }; // Reset form
  }

  // Close create subcategory modal
  closeCreateSubcategoryModal(): void {
    this.isCreateSubcategoryModalOpen = false;
  }

  // Submit new subcategory creation
  submitCreateSubcategory(): void {
    const subcategoryToCreate = {
      ...this.newSubcategoryData,
      categoryId: this.category.id,
    };
    this.subcategoryService.createSubCategory(subcategoryToCreate).subscribe(
      (newSubcategory) => {
        this.subcategories.push(newSubcategory);
        this.closeCreateSubcategoryModal();
      },
      (error) => {
        console.error('Error creating subcategory:', error);
      }
    );
  }

  // Confirm deletion modal
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

  // Perform deletion for category or subcategory
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
            console.error('Error deleting category:', error);
          }
        );
      } else if (type === 'subcategory') {
        this.subcategoryService.deleteSubCategory(id).subscribe(
          () => {
            this.fetchSubcategories();
            this.closeConfirmModal();
          },
          (error) => {
            console.error('Error deleting subcategory:', error);
          }
        );
      }
    }
  }
}
