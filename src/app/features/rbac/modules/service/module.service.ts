import { inject, Injectable } from '@angular/core';
import { ModuleFormValues, Modules } from '../dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { ListParams, PaginatedResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rbac/modules`

  create(payload: ModuleFormValues): Observable<Modules> {
    return this.http.post<Modules>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params: ListParams): Observable<PaginatedResponse<Modules>> {
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

    return this.http.get<PaginatedResponse<Modules>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: string): Observable<Modules> {
    return this.http.get<Modules>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: string, payload: ModuleFormValues): Observable<Modules> {
    return this.http.patch<Modules>(`${this.apiUrl}/${id}/`, payload).pipe(
      tap(),
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
