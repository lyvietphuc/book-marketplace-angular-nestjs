import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout';
import { AdminOverviewPage } from './admin-overview';
import { AdminMerchants } from './admin-merchants';
import { AdminCustomers } from './admin-customers';

/** Adminbereich – lazy geladen */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'uebersicht' },
      { path: 'uebersicht', component: AdminOverviewPage, title: 'Admin – Übersicht' },
      { path: 'haendler', component: AdminMerchants, title: 'Admin – Händler' },
      { path: 'kunden', component: AdminCustomers, title: 'Admin – Kunden' },
    ],
  },
];
