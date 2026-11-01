import { Component, ElementRef, OnDestroy, effect, inject, signal, viewChild } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';

import { DashboardService } from './services/dashboard.service';
import { DashboardSummary } from './dto';

import { OrderService } from '@features/sales/order/services/order.service';
import { Orders, Payments } from '@features/sales/order/dto';

import { ReportService } from '@features/report/services/report.service';
import { DailyTrendPoint } from '@features/report/dto';

import { DatePipe } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnDestroy {

  private readonly dashboardService = inject(DashboardService);
  private readonly orderService = inject(OrderService);
  private readonly reportsService = inject(ReportService);
  private readonly router = inject(Router);

  readonly summary = signal<DashboardSummary | null>(null);

  readonly recentOrders = signal<Orders[]>([]);
  readonly awaitingFulfillment = signal<Orders[]>([]);
  readonly pendingPayments = signal<Payments[]>([]);

  readonly trendPoints = signal<DailyTrendPoint[]>([]);

  readonly loading = signal(true);
  readonly today = new Date();

  readonly trendChartRef = viewChild<ElementRef<HTMLCanvasElement>>('trendChart');

  readonly orderStatusChartRef = viewChild<ElementRef<HTMLCanvasElement>>('orderStatusChart');

  readonly topCustomersChartRef = viewChild<ElementRef<HTMLCanvasElement>>('topCustomersChart');

  private trendChart?: Chart;
  private orderStatusChart?: Chart;
  private topCustomersChart?: Chart;

  private readonly chartEffect = effect(() => {

    const trendCanvas = this.trendChartRef()?.nativeElement;
    const statusCanvas = this.orderStatusChartRef()?.nativeElement;
    const customersCanvas = this.topCustomersChartRef()?.nativeElement;

    const trend = this.trendPoints();
    const orders = this.recentOrders();

    if (trendCanvas && trend.length) {
      this.renderTrend(trendCanvas, trend);
    }

    if (statusCanvas && orders.length) {
      this.renderOrderStatus(statusCanvas, orders);
    }

    if (customersCanvas && orders.length) {
      this.renderTopCustomers(customersCanvas, orders);
    }
  });

  ngOnInit(): void {
    this.fetchSummary();
    this.fetchRecentOrders();
    this.fetchAwaitingFulfillment();
    this.fetchPendingPayments();
    this.fetchTrend();
  }

  ngOnDestroy(): void {
    this.trendChart?.destroy();
    this.orderStatusChart?.destroy();
    this.topCustomersChart?.destroy();
  }

  fetchSummary(): void {
    this.dashboardService.summary().subscribe({
      next: (res) => {
        this.summary.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  fetchRecentOrders(): void {
    this.orderService.list({ page: 0, pageSize: 8, search: '', ordering: '-ordered_at', filters: {} }).subscribe({
      next: (res) => {
        this.recentOrders.set(res.results);
      },
    });
  }

  fetchAwaitingFulfillment(): void {
    this.orderService.list({
      page: 0, pageSize: 8, search: '', ordering: '-ordered_at', filters: { status: 'confirmed' },
    }).subscribe({
      next: (res) => {
        this.awaitingFulfillment.set(res.results);
      },
    });
  }

  fetchPendingPayments(): void {
    this.orderService.listPayments({
      page: 0, pageSize: 8, search: '', ordering: '-created_at', filters: { status: 'pending' },
    }).subscribe({
      next: (res) => {
        this.pendingPayments.set(res.results);
      },
    });
  }

  fetchTrend(): void {
    this.reportsService.dailyTrend(7).subscribe({
      next: (points) => {
        this.trendPoints.set(points);
      },
    });
  }

  private renderTrend(canvas: HTMLCanvasElement, points: DailyTrendPoint[]): void {
    this.trendChart?.destroy();
    this.trendChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: points.map((p) =>
          new Date(p.date).toLocaleDateString('en-US', {
            weekday: 'short',
          })
        ),
        datasets: [{
          label: 'Revenue',
          data: points.map((p) => Number(p.revenue)),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.35,
          fill: true,
        }],

      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                ` Revenue: ${this.formatCurrency(context.parsed.y)}`,
            },
          },
        },

        scales: {
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: '#f1f5f9' },
            ticks: {
              callback: (value) =>
                `Rs. ${Number(value).toLocaleString('en-LK')}`,
            },
          },

          x: {
            border: { display: false },
            grid: { display: false },
          },
        },
      },
    });
  }

  private renderOrderStatus(canvas: HTMLCanvasElement, orders: Orders[]): void {
    this.orderStatusChart?.destroy();
    const statusCounts = new Map<string, number>();
    orders.forEach((order) => {
      const status = order.status || 'unknown';
      statusCounts.set(
        status,
        (statusCounts.get(status) ?? 0) + 1,
      );

    });

    const labels = Array.from(statusCounts.keys());
    const values = Array.from(statusCounts.values());
    const colors = ['#2563eb', '#0d9488', '#f59e0b', '#8b5cf6', '#64748b', '#ef4444'];

    this.orderStatusChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels.map((status) =>
          this.formatStatus(status)
        ),
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 0,
          hoverOffset: 5,
        }],

      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 18,
              boxWidth: 8,
              boxHeight: 8,
            },
          },
        },
      },
    });
  }

  private renderTopCustomers(canvas: HTMLCanvasElement, orders: Orders[]): void {
    this.topCustomersChart?.destroy();
    const customerSales = new Map<string, number>();
    orders.forEach((order) => {
      const customer = order.customerName || 'Unknown';
      const amount = Number(order.grandTotal ?? 0);
      customerSales.set(
        customer,
        (customerSales.get(customer) ?? 0) + amount,
      );
    });

    const topCustomers = Array.from(customerSales.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.topCustomersChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: topCustomers.map(([name]) => name),
        datasets: [{
          label: 'Sales',
          data: topCustomers.map(([, amount]) => amount),
          backgroundColor: '#0d9488',
          borderRadius: 6,
          barThickness: 20,
        }],
      },

      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>` Sales: ${this.formatCurrency(context.parsed.x)}`,
            },
          },
        },

        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9',
            },
          },

          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  goToOrder(id: string): void {
    this.router.navigate(['/admin/orders', id]);
  }

  goToPayment(_id: string): void {
    this.router.navigate(['/admin/payments']);
  }

  formatCurrency(
    value: string | number | null | undefined,
  ): string {

    const amount = Number(value ?? 0);

    return `Rs. ${amount.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  formatDate(value: string): string {

    return new Date(value).toLocaleDateString('en-LK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatStatus(status: string): string {

    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
