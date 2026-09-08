import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, map } from 'rxjs';
import { handleError } from '@shared/utills';
import { PaginatedResponse } from '@shared/interfaces';
import { CategoryAttributeBulkSyncPayload, CategoryAttributeItem } from '../dto';

interface CategoryAttributeRow {
  id: number;
  category: number;
  attribute: number;
  required: boolean;
  sortOrder: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryAttributeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/category-attributes`;

  listByCategory(categoryId: number): Observable<CategoryAttributeItem[]> {
    const params = new HttpParams().set('category', categoryId).set('page_size', 1000);
    return this.http.get<PaginatedResponse<CategoryAttributeRow>>(`${this.apiUrl}/`, { params }).pipe(
      map((res) => res.results.map((r) => ({ id: r.id, attribute: r.attribute, required: r.required, sortOrder: r.sortOrder }))),
      catchError((err) => handleError(err))
    );
  }

  bulkSync(payload: CategoryAttributeBulkSyncPayload): Observable<CategoryAttributeItem[]> {
    return this.http.post<CategoryAttributeItem[]>(`${this.apiUrl}/bulk-sync/`, payload).pipe(
      catchError((err) => handleError(err))
    );
  }
}