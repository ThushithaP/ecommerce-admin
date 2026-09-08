import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { PaginatedResponse } from '@shared/interfaces';
import { handleError } from '@shared/utills';
import { catchError, Observable, tap } from 'rxjs';
import { CategoriesPath, CategoryPathListParams, CreateCategoryPathDto, UpdateCategoryPathDto } from '../dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryPathService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/category-path`

  create(payload: CreateCategoryPathDto) {
    return this.http.post(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params_: CategoryPathListParams = {}): Observable<PaginatedResponse<CategoriesPath>> {
    let params = new HttpParams();
    if (params_.page !== undefined) {
      params = params.set('page', params_.page + 1);
    }

    if (params_.pageSize !== undefined) {
      params = params.set('page_size', params_.pageSize);
    }

    // if (params_.isActive !== undefined) {
    //   params = params.set('is_active', params_.isActive);
    // }

    if (params_.search) {
      params = params.set('search', params_.search);
    }

    if (params_.ordering) {
      params = params.set('ordering', params_.ordering);
    }

    return this.http.get<PaginatedResponse<CategoriesPath>>(`${this.apiUrl}/`, { params }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: number): Observable<CategoriesPath> {
    return this.http.get<CategoriesPath>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: number, payload: UpdateCategoryPathDto): Observable<CategoriesPath> {
    return this.http.patch<CategoriesPath>(`${this.apiUrl}/${id}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }
}
