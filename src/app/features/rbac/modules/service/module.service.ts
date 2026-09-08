import { inject, Injectable } from '@angular/core';
import { CreateModuleDto, Module, ModuleListParams, UpdateModuleDto } from '../dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { PaginatedResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rbac/modules`

  create(payload:CreateModuleDto) {
    return this.http.post(`${this.apiUrl}/`,payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    ) 
  }

  list(params_:ModuleListParams ={}):Observable<PaginatedResponse<Module>> {
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

    return this.http.get<PaginatedResponse<Module>>(`${this.apiUrl}/`,{params}).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id:string): Observable<Module> {
    return this.http.get<Module>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id:string, payload: UpdateModuleDto): Observable<Module> {
    return this.http.patch<Module>(`${this.apiUrl}/${id}/`,payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  delete(id:string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }
}
