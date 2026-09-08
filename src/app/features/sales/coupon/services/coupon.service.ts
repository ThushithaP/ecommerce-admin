import { inject, Injectable } from '@angular/core';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { Coupons, CouponPayload } from '../dto';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';

@Injectable({
  providedIn: 'root',
})
export class CouponService implements CrudService<Coupons, CouponPayload> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/promotions/coupons`;

  list(params: ListParams): Observable<PaginatedResponse<Coupons>> {
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

    return this.http.get<PaginatedResponse<Coupons>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }
  create(payload: CouponPayload): Observable<Coupons> {
    return this.http.post<Coupons>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  update(id: any, payload: CouponPayload): Observable<Coupons> {
    return this.http.patch<Coupons>(`${this.apiUrl}/${id}/`, payload).pipe(
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

  getById?(id: any): Observable<Coupons> {
    return this.http.get<Coupons>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

}
