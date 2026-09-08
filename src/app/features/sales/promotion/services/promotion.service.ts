import { inject, Injectable } from '@angular/core';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { PromotionPayload, Promotions } from '../dto';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { catchError, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { handleError } from '@shared/utills';

@Injectable({
  providedIn: 'root',
})
export class PromotionService implements CrudService<Promotions, PromotionPayload> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/promotions`;

  list(params: ListParams): Observable<PaginatedResponse<Promotions>> {
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

    return this.http.get<PaginatedResponse<Promotions>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  create(payload: PromotionPayload): Observable<Promotions> {
    return this.http.post<Promotions>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  update(id: any, values: PromotionPayload): Observable<Promotions> {
    throw new Error('Method not implemented.');
  }

  delete?(id: any): Observable<void> {
    throw new Error('Method not implemented.');
  }

  getById?(id: any): Observable<Promotions> {
    throw new Error('Method not implemented.');
  }
}
