import { inject, Injectable } from '@angular/core';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { StockTransferFormValues, StockTransfers } from '../dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { handleError } from '@shared/utills';

@Injectable({
  providedIn: 'root',
})
export class StockTransferService implements CrudService<StockTransfers, StockTransferFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/inventory/transfers`;

  create(payload: StockTransferFormValues): Observable<StockTransfers> {
    return this.http.post<StockTransfers>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params: ListParams): Observable<PaginatedResponse<StockTransfers>> {

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

    return this.http.get<PaginatedResponse<StockTransfers>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: number): Observable<StockTransfers> {
    return this.http.get<StockTransfers>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: number, payload: StockTransferFormValues): Observable<StockTransfers> {
    return this.http.patch<StockTransfers>(`${this.apiUrl}/${id}/`, payload).pipe(
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

  complete(id: string): Observable<StockTransfers> {
    return this.http.post<StockTransfers>(`${this.apiUrl}/${id}/complete/`, {}).pipe(
      catchError((err) => handleError(err))
    );
  }
}
