import { inject, Injectable } from '@angular/core';
import { Roles, RoleFormValues } from '../dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { CrudService } from '@shared/base/pages/base-list-page.component';

@Injectable({
  providedIn: 'root',
})
export class RoleService implements CrudService<Roles, RoleFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rbac/roles`;

  create(payload: RoleFormValues): Observable<Roles> {
    return this.http.post<Roles>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params: ListParams): Observable<PaginatedResponse<Roles>> {
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

    return this.http.get<PaginatedResponse<Roles>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: number): Observable<Roles> {
    return this.http.get<Roles>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: number, payload: RoleFormValues): Observable<Roles> {
    return this.http.patch<Roles>(`${this.apiUrl}/${id}/`, payload).pipe(
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
