import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { BrandFormValues, Brands } from '../dto';
import { CrudService } from '@shared/base/pages/base-list-page.component';


@Injectable({
  providedIn: 'root',
})
export class BrandService implements CrudService<Brands, BrandFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/brand`

  list(params: ListParams): Observable<PaginatedResponse<Brands>> {
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

    return this.http.get<PaginatedResponse<Brands>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }
  create(payload: BrandFormValues): Observable<Brands> {
    return this.http.post<Brands>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  update(id: any, payload: BrandFormValues): Observable<Brands> {
    return this.http.patch<Brands>(`${this.apiUrl}/${id}/`, payload).pipe(
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

  getById(id: number): Observable<Brands> {
    return this.http.get<Brands>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  getByIds(ids: number[]): Observable<PaginatedResponse<Brands>> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<PaginatedResponse<Brands>>(this.apiUrl, { params }).pipe(
      catchError((err) => handleError(err))
    );
  }
}
