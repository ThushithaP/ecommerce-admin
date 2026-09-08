import { inject, Injectable } from '@angular/core';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { AttributeDefinitionFormValues, AttributeDefinitionPayload, AttributeDefinitions } from '../dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { ListParams, PaginatedResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AttributeDefinitionService implements CrudService<AttributeDefinitions,AttributeDefinitionPayload> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/attribute-definition`;

  create(payload: AttributeDefinitionPayload): Observable<AttributeDefinitions> {
    return this.http.post<AttributeDefinitions>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params: ListParams): Observable<PaginatedResponse<AttributeDefinitions>> {
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

    return this.http.get<PaginatedResponse<AttributeDefinitions>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: number): Observable<AttributeDefinitions> {
    return this.http.get<AttributeDefinitions>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: number, payload: AttributeDefinitionPayload): Observable<AttributeDefinitions> {
    return this.http.patch<AttributeDefinitions>(`${this.apiUrl}/${id}/`, payload).pipe(
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
