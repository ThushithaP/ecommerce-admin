import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, Observable } from 'rxjs';
import { handleError } from '@shared/utills';
import {
  SalesSummary, SalesByStatus, TopProduct, SalesByCategory,
  PaymentMethodBreakdown, InventoryValuation, LowStockItem,
  DailyTrendPoint,
} from '../dto'
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reports`;

  private dateParams(start: Date | null, end: Date | null): HttpParams {
    let params = new HttpParams();
    if (start) params = params.set('startDate', start.toISOString());
    if (end) params = params.set('endDate', end.toISOString());
    return params;
  }

  salesSummary(start: Date | null, end: Date | null): Observable<SalesSummary> {
    return this.http.get<SalesSummary>(`${this.apiUrl}/sales-summary/`, { params: this.dateParams(start, end) })
      .pipe(catchError((err) => handleError(err)));
  }

  salesByStatus(start: Date | null, end: Date | null): Observable<SalesByStatus[]> {
    return this.http.get<SalesByStatus[]>(`${this.apiUrl}/sales-by-status/`, { params: this.dateParams(start, end) })
      .pipe(catchError((err) => handleError(err)));
  }

  topProducts(start: Date | null, end: Date | null, limit = 10): Observable<TopProduct[]> {
    const params = this.dateParams(start, end).set('limit', limit);
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products/`, { params })
      .pipe(catchError((err) => handleError(err)));
  }

  salesByCategory(start: Date | null, end: Date | null, limit = 10): Observable<SalesByCategory[]> {
    const params = this.dateParams(start, end).set('limit', limit);
    return this.http.get<SalesByCategory[]>(`${this.apiUrl}/sales-by-category/`, { params })
      .pipe(catchError((err) => handleError(err)));
  }

  paymentMethods(start: Date | null, end: Date | null): Observable<PaymentMethodBreakdown[]> {
    return this.http.get<PaymentMethodBreakdown[]>(`${this.apiUrl}/payment-methods/`, { params: this.dateParams(start, end) })
      .pipe(catchError((err) => handleError(err)));
  }

  inventoryValuation(warehouseId?: number): Observable<InventoryValuation> {
    let params = new HttpParams();
    if (warehouseId) params = params.set('warehouse', warehouseId);
    return this.http.get<InventoryValuation>(`${this.apiUrl}/inventory-valuation/`, { params })
      .pipe(catchError((err) => handleError(err)));
  }

  lowStock(threshold = 10, warehouseId?: number): Observable<LowStockItem[]> {
    let params = new HttpParams().set('threshold', threshold);
    if (warehouseId) params = params.set('warehouse', warehouseId);
    return this.http.get<LowStockItem[]>(`${this.apiUrl}/low-stock/`, { params })
      .pipe(catchError((err) => handleError(err)));
  }

  dailyTrend(days = 7): Observable<DailyTrendPoint[]> {
    return this.http.get<DailyTrendPoint[]>(`${this.apiUrl}/daily-trend/`, { params: { days } }).pipe(
      catchError((err) => handleError(err))
    );
  }
}
