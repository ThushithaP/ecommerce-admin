import { Component, ElementRef, inject, OnInit, signal, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { DataTable } from '@shared/components/data-table/data-table';
import { TableColumn } from '@shared/models/table-column.model';
import { Chart, registerables } from 'chart.js';

import { ReportService } from './services/report.service';
import {
  SalesSummary, SalesByStatus, TopProduct, SalesByCategory,
  PaymentMethodBreakdown, InventoryValuation, LowStockItem,
} from './dto';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-report',
  imports: [CommonModule, FormsModule, DatePicker, Button, FormFieldComponent, DataTable],
  templateUrl: './report.html',
  styleUrl: './report.css',
})
export class Report implements OnInit {
  private readonly reportsService = inject(ReportService);

  readonly startDate = signal<Date | null>(this.daysAgo(30));
  readonly endDate = signal<Date | null>(new Date());

  readonly summary = signal<SalesSummary | null>(null);
  readonly byStatus = signal<SalesByStatus[]>([]);
  readonly topProducts = signal<TopProduct[]>([]);
  readonly byCategory = signal<SalesByCategory[]>([]);
  readonly paymentMethods = signal<PaymentMethodBreakdown[]>([]);
  readonly valuation = signal<InventoryValuation | null>(null);
  readonly lowStock = signal<LowStockItem[]>([]);
  readonly loading = signal(false);

  readonly statusChartRef = viewChild<ElementRef<HTMLCanvasElement>>('statusChart');
  readonly categoryChartRef = viewChild<ElementRef<HTMLCanvasElement>>('categoryChart');
  private statusChart?: Chart;
  private categoryChart?: Chart;

  topProductColumns: TableColumn<TopProduct>[] = [
    { key: 'product_name', label: 'Product' },
    { key: 'variant_sku', label: 'SKU' },
    { key: 'unitsSold', label: 'Units Sold', align: 'right' },
    { key: 'revenue', label: 'Revenue', align: 'right', formatter: (v) => this.formatCurrency(v) },
  ];

  lowStockColumns: TableColumn<LowStockItem>[] = [
    { key: 'productName', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'warehouseName', label: 'Warehouse' },
    { key: 'batchNo', label: 'Batch' },
    { key: 'availableQuantity', label: 'Available', align: 'right' },
  ];

  private daysAgo(n: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  }

  formatCurrency(v: number): string {
    return `Rs. ${(v ?? 0).toLocaleString()}`;
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  fetchAll(): void {
    this.loading.set(true);
    const start = this.startDate();
    const end = this.endDate();

    this.reportsService.salesSummary(start, end).subscribe({ next: (res) => this.summary.set(res) });

    this.reportsService.salesByStatus(start, end).subscribe({
      next: (res) => {
        this.byStatus.set(res);
        this.renderStatusChart(res);
      },
    });

    this.reportsService.topProducts(start, end, 10).subscribe({ next: (res) => this.topProducts.set(res) });

    this.reportsService.salesByCategory(start, end, 10).subscribe({
      next: (res) => {
        this.byCategory.set(res);
        this.renderCategoryChart(res);
      },
    });

    this.reportsService.paymentMethods(start, end).subscribe({ next: (res) => this.paymentMethods.set(res) });

    this.reportsService.inventoryValuation().subscribe({ next: (res) => this.valuation.set(res) });

    this.reportsService.lowStock(10).subscribe({
      next: (res) => {
        this.lowStock.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private renderStatusChart(data: SalesByStatus[]): void {
    const canvas = this.statusChartRef()?.nativeElement;
    if (!canvas) return;

    this.statusChart?.destroy();
    this.statusChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.status),
        datasets: [{
          data: data.map((d) => d.total),
          backgroundColor: ['#6C5CE7', '#FF4D6D', '#C6F135', '#7FD8E8', '#16131F'],
        }],
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
    });
  }

  private renderCategoryChart(data: SalesByCategory[]): void {
    const canvas = this.categoryChartRef()?.nativeElement;
    if (!canvas) return;

    this.categoryChart?.destroy();
    this.categoryChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.variant__product__category_path__items__category__name ?? 'Uncategorized'),
        datasets: [{ label: 'Revenue', data: data.map((d) => d.revenue), backgroundColor: '#6C5CE7' }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }
}
