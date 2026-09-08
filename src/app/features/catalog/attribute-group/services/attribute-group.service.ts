import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AttributeGroups, AttributeGroupListParams, CreateAttributeGroupDto, UpdateAttributeGroupDto, AttributeGroupFormValues } from '../dto';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { ListParams, PaginatedResponse } from '@shared/interfaces';
import { CrudService } from '@shared/base/pages/base-list-page.component';

@Injectable({
  providedIn: 'root',
})
export class AttributeGroupService implements CrudService<AttributeGroups,AttributeGroupFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/attribute-group`

  create(payload: AttributeGroupFormValues):Observable<AttributeGroups> {
    return this.http.post<AttributeGroups>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  list(params : ListParams ): Observable<PaginatedResponse<AttributeGroups>> {
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

    return this.http.get<PaginatedResponse<AttributeGroups>>(`${this.apiUrl}/`, { params:httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  getById(id: number): Observable<AttributeGroups> {
    return this.http.get<AttributeGroups>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  update(id: number, payload: UpdateAttributeGroupDto): Observable<AttributeGroups> {
    return this.http.patch<AttributeGroups>(`${this.apiUrl}/${id}/`, payload).pipe(
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
