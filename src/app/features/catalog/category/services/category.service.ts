import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Categories, CategoryFormValues, CategoryListParams, CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { CrudService } from '@shared/base/pages/base-list-page.component';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements CrudService<Categories, CategoryFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/category`

  create(payload: CategoryFormValues): Observable<Categories> {
    return this.http.post<Categories>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params: ListParams): Observable<PaginatedResponse<Categories>> {
    let httpParams = new HttpParams()
      .set('page', params.page + 1)
      .set('page_size', params.pageSize)
      .set('search', params.search)
      .set('ordering', params.ordering);

    for (const [key, value] of Object.entries(params.filters ?? {})) {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    }

    return this.http.get<PaginatedResponse<Categories>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  update(id: any, payload: CategoryFormValues): Observable<Categories> {
    return this.http.patch<Categories>(`${this.apiUrl}/${id}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  delete?(id: any): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById?(id: any): Observable<Categories> {
    return this.http.get<Categories>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  getByIds(ids: number[]): Observable<PaginatedResponse<Categories>> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<PaginatedResponse<Categories>>(this.apiUrl, { params }).pipe(
      catchError((err) => handleError(err))
    );
  }
}
