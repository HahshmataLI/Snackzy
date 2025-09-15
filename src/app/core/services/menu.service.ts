import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants';
import { Category } from '../shared/model/category.model';
import { Item } from '../shared/model/item.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService{
  private url = `${API_BASE_URL}/menu`;

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.url}/items`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}/categories`);
  }

  addItem(item: FormData): Observable<Item> {
  return this.http.post<Item>(`${this.url}/item`, item);
}


  addCategory(category: { name: string }): Observable<Category> {
    return this.http.post<Category>(`${this.url}/categories`, category);
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.url}/items/${id}`);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.url}/categories/${id}`);
  }
}

