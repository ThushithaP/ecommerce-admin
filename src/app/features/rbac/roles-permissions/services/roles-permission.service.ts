import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { PaginatedResponse } from '@shared/interfaces';
import { CreateRolesPermissionDto, ReadRolesPermission, RolesPermission, RolesPermissionListParams, UpdateRolesPermissionDto } from '../dto';

@Injectable({
  providedIn: 'root',
})
export class RolesPermissionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rbac/role-permissions`

  save(payload: CreateRolesPermissionDto) {
    return this.http.post(`${this.apiUrl}/save/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params_: RolesPermissionListParams = {}): Observable<PaginatedResponse<RolesPermission>> {
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

    return this.http.get<PaginatedResponse<RolesPermission>>(`${this.apiUrl}/`, { params }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: string): Observable<ReadRolesPermission> {
    return this.http.get<ReadRolesPermission>(`${this.apiUrl}/role/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: string, payload: UpdateRolesPermissionDto): Observable<RolesPermission> {
    return this.http.patch<RolesPermission>(`${this.apiUrl}/${id}/`, payload).pipe(
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
