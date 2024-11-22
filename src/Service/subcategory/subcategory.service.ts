import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private baseUrl = 'https://localhost:7156/api/SubCategory';

  constructor(private http: HttpClient) {}

  createSubCategory(subCategoryDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, subCategoryDto);
  }

  getSubCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getSubCategoriesByCategoryId(categoryId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/${categoryId}`);
  }

  deleteSubCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
