import { Routes } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MerchantDashboard } from './merchant-dashboard';
import { MerchantOrders } from './merchant-orders';
import { MerchantLayout } from './merchant-layout';
import { MerchantBooks } from './merchant-books';
import { MerchantShops } from './merchant-shops';

/** Händlerbereich – wird erst geladen, wenn ein Händler /haendler öffnet (Lazy Loading) */
export const MERCHANT_ROUTES: Routes = [
  {
    path: '',
    component: MerchantLayout,
    // Chart.js nur im Händlerbereich registrieren (wird mit lazy geladen)
    providers: [provideCharts(withDefaultRegisterables())],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: MerchantDashboard, title: 'Dashboard – Amazing' },
      { path: 'bestellungen', component: MerchantOrders, title: 'Bestellungen – Amazing' },
      { path: 'buecher', component: MerchantBooks, title: 'Meine Bücher – Amazing' },
      { path: 'shops', component: MerchantShops, title: 'Meine Shops – Amazing' },
    ],
  },
];
