import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { TaxClasses, TaxClassFormValues, TaxRate } from '../dto';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { ListParams, PaginatedResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TaxClassService implements CrudService<TaxClasses, TaxClassFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tax/tax-classes`;

  list(params: ListParams): Observable<PaginatedResponse<TaxClasses>> {
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

    return this.http.get<PaginatedResponse<TaxClasses>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  create(values: TaxClassFormValues): Observable<TaxClasses> {
    return this.http.post<TaxClasses>(`${this.apiUrl}/`, values).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  update(id: any, values: TaxClassFormValues): Observable<TaxClasses> {
    return this.http.patch<TaxClasses>(`${this.apiUrl}/${id}/`, values).pipe(
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

  getById(id: any): Observable<TaxClasses> {
    return this.http.get<TaxClasses>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

}
