import { inject, Injectable } from '@angular/core';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { OrderFormValues, OrderPayment, Orders, Payments } from '../dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements CrudService<Orders, OrderFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders/admin`;
  private readonly paymentApiUrl = `${environment.apiUrl}/payments`;

  create(payload: OrderFormValues): Observable<Orders> {
    return this.http.post<Orders>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params: ListParams): Observable<PaginatedResponse<Orders>> {
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

    return this.http.get<PaginatedResponse<Orders>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: string): Observable<Orders> {
    return this.http.get<Orders>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: string, payload: OrderFormValues): Observable<Orders> {
    return this.http.patch<Orders>(`${this.apiUrl}/${id}/`, payload).pipe(
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

  getPaymentByOrderId(id: string): Observable<OrderPayment[]> {
    return this.http.get<OrderPayment[]>(`${this.paymentApiUrl}/order/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  confirmPaymentOfOrder(paymentId: string, transactionReference?: string | null): Observable<any> {
    const body = {
      transactionReference: transactionReference ?? null,
    };
    return this.http.post<any>(`${this.paymentApiUrl}/${paymentId}/confirm/`, body, { withCredentials: true }).pipe(
      catchError((err) => handleError(err))
    );
  }

  listPayments(params: ListParams): Observable<PaginatedResponse<Payments>> {
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

    return this.http.get<PaginatedResponse<Payments>>(`${this.paymentApiUrl}/list/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }
}
