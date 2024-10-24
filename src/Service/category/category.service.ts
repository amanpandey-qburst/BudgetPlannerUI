import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  description: string;
  isBasic: boolean;
  isDeleted: boolean;
}

export interface CategoryCreateDto {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://localhost:7156/api/Category';
  private addCategoryUrl = 'https://localhost:7156/api/Category';

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Add a new category
  addCategory(category: CategoryCreateDto): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
}
