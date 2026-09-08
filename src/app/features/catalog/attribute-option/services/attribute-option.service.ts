import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, map, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { PaginatedResponse, ListParams } from '@shared/interfaces';
import {
  AttributeOptions,
  AttributeOptionFormValues,
  AttributeOptionRow,
} from '../dto';

@Injectable({
  providedIn: 'root',
})
export class AttributeOptionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/attribute-options`;

  list(params: ListParams): Observable<PaginatedResponse<AttributeOptions>> {
    let httpParams = new HttpParams()
      .set('page', params.page + 1)
      .set('page_size', params.pageSize)
      .set('search', params.search)
      .set('ordering', params.ordering);

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }

    return this.http.get<PaginatedResponse<AttributeOptions>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  // getById(id: number): Observable<AttributeOptions> {
  //   return this.http.get<AttributeOptions>(`${this.apiUrl}/${id}/`).pipe(
  //     catchError((err) => handleError(err))
  //   );
  // }

  // create(payload: AttributeOptionFormValues): Observable<AttributeOptions> {
  //   return this.http.post<AttributeOptions>(`${this.apiUrl}/`, payload).pipe(
  //     tap(),
  //     catchError((err) => handleError(err))
  //   );
  // }

  // update(id: number, payload: AttributeOptionFormValues): Observable<AttributeOptions> {
  //   return this.http.patch<AttributeOptions>(`${this.apiUrl}/${id}/`, payload).pipe(
  //     tap(),
  //     catchError((err) => handleError(err))
  //   );
  // }

  // delete(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
  //     tap(),
  //     catchError((err) => handleError(err))
  //   );
  // }

  // /** All options for one attribute, unpaginated — used by the option-list editor to preload the FormArray */
  listByAttribute(attributeId: number): Observable<AttributeOptionRow[]> {
    const params = new HttpParams().set('attribute', attributeId).set('page_size', 1000);
    return this.http.get<PaginatedResponse<AttributeOptionRow>>(`${this.apiUrl}/`, { params }).pipe(
      map((res) => res.results),
      catchError((err) => handleError(err))
    );
  }

  /** Core save operation for the option-list editor — reconciles create/update/delete server-side in one call */
  bulkSync(payload: AttributeOptionFormValues): Observable<AttributeOptions[]> {
    return this.http.post<AttributeOptions[]>(`${this.apiUrl}/bulk-sync/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  // listGrouped(): Observable<AttributeOptionGroup[]> {
  //   return this.http.get<AttributeOptionGroup[]>(`${this.apiUrl}/grouped/`).pipe(
  //     catchError((err) => handleError(err))
  //   );
  // }
}