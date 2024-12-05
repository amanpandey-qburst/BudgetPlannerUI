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

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<Category[]> {
    const token = sessionStorage.getItem('authToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<Category[]>(this.apiUrl, { headers });
  }

  // Add a new category
  addCategory(category: CategoryCreateDto): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCategory(
    id: string,
    category: Partial<Category>
  ): Observable<Category> {
    return this.http.put<Category>(
      `https://localhost:7156/api/Category/${id}`,
      category
    );
  }
}
