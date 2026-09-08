import { inject, Injectable } from '@angular/core';
import { UpdateWarehouseDto, WarehouseFormValues, Warehouses } from '../dto';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { ListParams, PaginatedResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService implements CrudService<Warehouses,WarehouseFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/warehouse`;

  create(payload: WarehouseFormValues):Observable<Warehouses> {
    return this.http.post<Warehouses>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params : ListParams ): Observable<PaginatedResponse<Warehouses>> {
    
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

    return this.http.get<PaginatedResponse<Warehouses>>(`${this.apiUrl}/`, { params:httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: number): Observable<Warehouses> {
    return this.http.get<Warehouses>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: number, payload: UpdateWarehouseDto): Observable<Warehouses> {
    return this.http.patch<Warehouses>(`${this.apiUrl}/${id}/`, payload).pipe(
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
