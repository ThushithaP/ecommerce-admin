import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Categories, CategoryListParams, CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { PaginatedResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/category`

  create(payload:CreateCategoryDto) {
    return this.http.post(`${this.apiUrl}/`,payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    ) 
  }

  list(params_:CategoryListParams ={}):Observable<PaginatedResponse<Categories>> {
    let params = new HttpParams();
    if (params_.page !== undefined) {
      params = params.set('page', params_.page + 1);
    }

    if (params_.pageSize !== undefined) {
      params = params.set('page_size', params_.pageSize);
    }

    if (params_.isActive !== undefined) {
      params = params.set('is_active', params_.isActive);
    }

    if (params_.search) {
      params = params.set('search', params_.search);
    }

    if (params_.ordering) {
      params = params.set('ordering', params_.ordering);
    }

    return this.http.get<PaginatedResponse<Categories>>(`${this.apiUrl}/`,{params}).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id:number): Observable<Categories> {
    return this.http.get<Categories>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id:number, payload: UpdateCategoryDto): Observable<Categories> {
    return this.http.patch<Categories>(`${this.apiUrl}/${id}/`,payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  delete(id:number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }
}
