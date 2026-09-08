import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { GoodsReceiptFormValues, GoodsReceipts } from '../dto';

@Injectable({
  providedIn: 'root',
})
export class GoodsReceiptService implements CrudService<GoodsReceipts, GoodsReceiptFormValues> {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/procurement/goods-receipts`;

  list(params: ListParams): Observable<PaginatedResponse<GoodsReceipts>> {
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

    return this.http.get<PaginatedResponse<GoodsReceipts>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: string): Observable<GoodsReceipts> {
    return this.http.get<GoodsReceipts>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  create(payload: GoodsReceiptFormValues): Observable<GoodsReceipts> {
    return this.http.post<GoodsReceipts>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  update(id: any, values: GoodsReceiptFormValues): Observable<GoodsReceipts> {
    throw new Error('Method not implemented.');
  }

}
