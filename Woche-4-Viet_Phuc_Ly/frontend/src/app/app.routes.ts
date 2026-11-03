import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { BookDetail } from './catalog/book-detail';
import { ShopList } from './shops/shop-list';
import { ShopDetail } from './shops/shop-detail';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Profile } from './profile/profile';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';
import { CartPage } from './cart/cart-page';
import { Checkout } from './cart/checkout';
import { MyOrders } from './orders/my-orders';

export const routes: Routes = [
  // öffentlich
  { path: '', component: Catalog, title: 'Amazing – Bücher entdecken' },
  { path: 'buch/:id', component: BookDetail, title: 'Buch – Amazing' },
  { path: 'shops', component: ShopList, title: 'Shops – Amazing' },
  { path: 'shops/:id', component: ShopDetail, title: 'Shop – Amazing' },
  { path: 'login', component: Login, title: 'Login – Amazing' },
  { path: 'register', component: Register, title: 'Registrieren – Amazing' },
  { path: 'warenkorb', component: CartPage, title: 'Warenkorb – Amazing' },

  // nur Kunden
  {
    path: 'kasse',
    component: Checkout,
    canActivate: [roleGuard('CUSTOMER')],
    title: 'Kasse – Amazing',
  },
  {
    path: 'bestellungen',
    component: MyOrders,
    canActivate: [roleGuard('CUSTOMER')],
    title: 'Meine Bestellungen – Amazing',
  },

  // eingeloggt (alle Rollen)
  { path: 'profile', component: Profile, canActivate: [authGuard], title: 'Mein Profil – Amazing' },

  // Händlerbereich (Lazy Loading: Code wird erst bei Bedarf geladen)
  {
    path: 'haendler',
    canActivate: [roleGuard('MERCHANT')],
    loadChildren: () => import('./merchant/merchant.routes').then((m) => m.MERCHANT_ROUTES),
  },

  // Adminbereich
  {
    path: 'admin',
    canActivate: [roleGuard('ADMIN')],
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  { path: '**', redirectTo: '' },
];
