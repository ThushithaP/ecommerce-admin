import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable, tap } from 'rxjs';
import { handleError } from '@shared/utills';
import { TaxRate } from '../dto';

@Injectable({ providedIn: 'root' })
export class TaxRateService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tax/tax-rates`;

  create(payload: any): Observable<TaxRate> {
    return this.http.post<TaxRate>(`${this.apiUrl}/`, payload).pipe(
      tap(), catchError((err) => handleError(err))
    );
  }

  update(id: number, payload: any): Observable<TaxRate> {
    return this.http.patch<TaxRate>(`${this.apiUrl}/${id}/`, payload).pipe(
      tap(), catchError((err) => handleError(err))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(), catchError((err) => handleError(err))
    );
  }
}