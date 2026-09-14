import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { AttributeSchema, ProductFormValues, Products, ProductVariants } from '../dto';
import { handleError } from '@shared/utills';
import { CrudService } from '@shared/base/pages/base-list-page.component';
import { ListParams, PaginatedResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements CrudService<Products, ProductFormValues> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalog/products`;
  private readonly apiUrlVariants = `${environment.apiUrl}/catalog/product-variants`;

  list(params: ListParams): Observable<PaginatedResponse<Products>> {
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

    return this.http.get<PaginatedResponse<Products>>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }

  create(payload: ProductFormValues): Observable<Products> {
    return this.http.post<Products>(`${this.apiUrl}/`, payload).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  update(id: any, values: ProductFormValues): Observable<Products> {
    return this.http.patch<Products>(`${this.apiUrl}/${id}/`, values).pipe(
      tap(),
      catchError((err) => handleError(err))
    )
  }

  delete(id: any): Observable<void> {
    throw new Error('Method not implemented.');
  }

  getById?(id: any): Observable<Products> {
    return this.http.get<Products>(`${this.apiUrl}/${id}/`).pipe(
      catchError((err) => handleError(err))
    );
  }

  getProductByIds(ids: number[]): Observable<PaginatedResponse<Products>> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<PaginatedResponse<Products>>(this.apiUrl, { params }).pipe(
      catchError((err) => handleError(err))
    );
  }

  getAttributeSchema(categoryIds: number[]): Observable<AttributeSchema[]> {
    return this.http.post<AttributeSchema[]>(`${this.apiUrl}/attribute-schema/`, { categoryIds }).pipe(
      catchError((err) => handleError(err))
    );
  }

  listProductVariants(params: ListParams): Observable<PaginatedResponse<ProductVariants>> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0) + 1)
      .set('page_size', params.pageSize ?? 100)
      .set('search', params.search ?? '')
      .set('ordering', params.ordering ?? 'sku');

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }

    return this.http.get<PaginatedResponse<ProductVariants>>(`${this.apiUrlVariants}/`, { params: httpParams }).pipe(
      tap(),
      catchError((err) => handleError(err))
    );
  }
  
  getProductVarintByIds(ids: number[]): Observable<PaginatedResponse<ProductVariants>> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<PaginatedResponse<ProductVariants>>(this.apiUrlVariants, { params }).pipe(
      catchError((err) => handleError(err))
    );
  }
}
