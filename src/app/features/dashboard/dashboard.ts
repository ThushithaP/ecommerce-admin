import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ElementRef, viewChild } from '@angular/core';

import { DashboardService } from './services/dashboard.service';
import { DashboardSummary } from './dto';

import { OrderService } from '@features/sales/order/services/order.service';
import { Orders, Payments } from '@features/sales/order/dto';
import { ReportService } from '@features/report/services/report.service';
import { DailyTrendPoint } from '@features/report/dto';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly orderService = inject(OrderService);
  private readonly reportsService = inject(ReportService);
  private readonly router = inject(Router);

  readonly summary = signal<DashboardSummary | null>(null);
  readonly recentOrders = signal<Orders[]>([]);
  readonly awaitingFulfillment = signal<Orders[]>([]);
  readonly pendingPayments = signal<Payments[]>([]);
  readonly loading = signal(true);

  readonly trendChartRef = viewChild<ElementRef<HTMLCanvasElement>>('trendChart');
  private trendChart?: Chart;

  ngOnInit(): void {
    this.fetchSummary();
    this.fetchRecentOrders();
    this.fetchAwaitingFulfillment();
    this.fetchPendingPayments();
    this.fetchTrend();
  }

  fetchSummary(): void {
    this.dashboardService.summary().subscribe({
      next: (res) => {
        this.summary.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  fetchRecentOrders(): void {
    this.orderService.list({ page: 0, pageSize: 8, search: '', ordering: '-ordered_at', filters: {} })
      .subscribe({ next: (res) => this.recentOrders.set(res.results) });
  }

  fetchAwaitingFulfillment(): void {
    this.orderService.list({ page: 0, pageSize: 8, search: '', ordering: '-ordered_at', filters: { status: 'confirmed' } })
      .subscribe({ next: (res) => this.awaitingFulfillment.set(res.results) });
  }

  fetchPendingPayments(): void {
    this.orderService.listPayments({ page: 0, pageSize: 8, search: '', ordering: '-created_at', filters: { status: 'pending' } })
      .subscribe({ next: (res) => this.pendingPayments.set(res.results) });
  }

  fetchTrend(): void {
    this.reportsService.dailyTrend(7).subscribe({
      next: (points) => this.renderTrend(points),
    });
  }

  private renderTrend(points: DailyTrendPoint[]): void {
    const canvas = this.trendChartRef()?.nativeElement;
    if (!canvas) return;

    const labels = points.map((p) => new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' }));
    const totals = points.map((p) => p.revenue);

    this.trendChart?.destroy();
    this.trendChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Revenue', data: totals, backgroundColor: '#6C5CE7', borderRadius: 8 }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
      },
    });
  }

  goToOrder(id: string): void {
    this.router.navigate(['/admin/orders', id]);
  }

  goToPayment(id: string): void {
    this.router.navigate(['/admin/payments']);
  }

  formatCurrency(value: string | number | null | undefined): string {
    const amount = Number(value ?? 0);

    return `Rs. ${amount.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  formatDate(v: string): string {
    return new Date(v).toLocaleDateString();
  }
}