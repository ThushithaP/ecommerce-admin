import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { PurchaseOrderFormValues, PurchaseOrders } from '../dto';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService implements CrudService<PurchaseOrders, PurchaseOrderFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/procurement/purchase-orders`;

  list(params: ListParams): Observable<PaginatedResponse<PurchaseOrders>> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0) + 1)
      .set('page_size', params.pageSize ?? 20)
      .set('search', params.search ?? '')
      .set('ordering', params.ordering ?? '');

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }

    return this.http.get<PaginatedResponse<PurchaseOrders>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: string): Observable<PurchaseOrders> {
    return this.http.get<PurchaseOrders>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  create(payload: PurchaseOrderFormValues): Observable<PurchaseOrders> {
    return this.http.post<PurchaseOrders>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  update(id: string, payload: PurchaseOrderFormValues): Observable<PurchaseOrders> {
    return this.http.patch<PurchaseOrders>(`${this.apiUrl}/${id}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  cancel(id: string): Observable<PurchaseOrders> {
    return this.http.post<PurchaseOrders>(`${this.apiUrl}/${id}/cancel/`, {}).pipe(
      catchError((err) => handleError(err))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }
}
