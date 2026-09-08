import { inject, Injectable } from '@angular/core';
import { CreateRoleDto, Role, RoleListParams, UpdateRoleDto } from '../dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { PaginatedResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rbac/roles`;

  create(payload: CreateRoleDto) {
    return this.http.post(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params_: RoleListParams = {}): Observable<PaginatedResponse<Role>> {

    let params = new HttpParams();
    if (params_.page !== undefined) {
      params = params.set('page', params_.page + 1);
    }

    if (params_.pageSize !== undefined) {
      params = params.set('page_size', params_.pageSize);
    }

    if (params_.isActive !== undefined) {
      params = params.set('is_active', params_.isActive);
    }

    if (params_.search) {
      params = params.set('search', params_.search);
    }

    if (params_.ordering) {
      params = params.set('ordering', params_.ordering);
    }

    return this.http.get<PaginatedResponse<Role>>(`${this.apiUrl}/`, { params }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: string, payload: UpdateRoleDto): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}/`, payload).pipe(
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
