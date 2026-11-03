import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration } from 'chart.js';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EuroPipe } from '../core/euro.pipe';
import { toErrorMessage } from '../auth/auth.service';
import { MerchantService } from './merchant.service';
import { MerchantStats } from './merchant.models';

const BAR_COLOR = '#2563eb'; // eine Farbe = eine Datenreihe (keine Legende nötig)
const GRID_COLOR = 'rgba(0, 0, 0, 0.06)';
const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

/** Händler-Dashboard: Kennzahlen, Umsatz pro Tag, Umsatz pro Buch */
@Component({
  selector: 'app-merchant-dashboard',
  imports: [
    RouterLink,
    BaseChartDirective,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    EuroPipe,
  ],
  templateUrl: './merchant-dashboard.html',
  styleUrl: './merchant-dashboard.scss',
})
export class MerchantDashboard {
  private api = inject(MerchantService);

  days = signal(30);
  stats = signal<MerchantStats | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const sub = this.api.getStats(this.days()).subscribe({
        next: (s) => this.stats.set(s),
        error: (err) => this.errorMessage.set(toErrorMessage(err)),
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  /** Umsatz pro Tag als Säulendiagramm */
  perDayChart = computed<ChartConfiguration<'bar'>['data']>(() => {
    const perDay = this.stats()?.perDay ?? [];
    return {
      labels: perDay.map((d) => formatDay(d.date)),
      datasets: [
        {
          label: 'Umsatz',
          data: perDay.map((d) => d.revenueCents / 100),
          backgroundColor: BAR_COLOR,
          borderRadius: 4,
          maxBarThickness: 18,
        },
      ],
    };
  });

  /** Top 10 Bücher nach Umsatz als liegende Balken */
  perBookChart = computed<ChartConfiguration<'bar'>['data']>(() => {
    const top = (this.stats()?.perBook ?? []).slice(0, 10);
    return {
      labels: top.map((b) => b.title),
      datasets: [
        {
          label: 'Umsatz',
          data: top.map((b) => b.revenueCents / 100),
          backgroundColor: BAR_COLOR,
          borderRadius: 4,
          maxBarThickness: 16,
        },
      ],
    };
  });

  perBookHeight = computed(() =>
    Math.max(160, Math.min(10, this.stats()?.perBook.length ?? 0) * 32 + 40),
  );

  readonly dayOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${euro.format(Number(ctx.raw))}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 } },
      y: {
        beginAtZero: true,
        grid: { color: GRID_COLOR },
        border: { display: false },
        ticks: { callback: (v) => euro.format(Number(v)).replace(',00', '') },
      },
    },
  };

  readonly bookOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${euro.format(Number(ctx.raw))}` } },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: GRID_COLOR },
        border: { display: false },
        ticks: { callback: (v) => euro.format(Number(v)).replace(',00', '') },
      },
      y: { grid: { display: false } },
    },
  };
}

function formatDay(isoDate: string): string {
  const [, m, d] = isoDate.split('-');
  return `${d}.${m}.`;
}
