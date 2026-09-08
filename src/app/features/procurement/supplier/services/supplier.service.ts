import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { SupplierFormValues, Suppliers } from '../dto';

@Injectable({
  providedIn: 'root',
})
export class SupplierService implements CrudService<Suppliers,SupplierFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/procurement/suppliers`;

  list(params: ListParams): Observable<PaginatedResponse<Suppliers>> {
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

    return this.http.get<PaginatedResponse<Suppliers>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  create(payload: SupplierFormValues): Observable<Suppliers> {
    return this.http.post<Suppliers>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  update(id: string, values: SupplierFormValues): Observable<Suppliers> {
    return this.http.patch<Suppliers>(`${this.apiUrl}/${id}/`, values).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }
  
  delete(id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  getById?(id: string): Observable<Suppliers> {
    return this.http.get<Suppliers>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }
}
