//@ts-nocheck
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import AuthFrontend from '../components/user/auth/auth.frontend.vue';
import AdminDashboard from '../components/user/AdminDashboard.vue';
import WaiterDashboard from '../components/user/WaiterDashboard.vue';
import CreateWaiterPage from '../components/create-waiter/CreateWaiterPage.vue';
import AddMenuItemPage from '../components/add-menu-item/AddMenuItemPage.vue';
import EditMenuItemPage from '../components/edit-menu-item/EditMenuItemPage.vue';
import OrderList from '../components/order-list/OrderList.vue';
import HistoryPage from '../components/history/HistoryPage.vue';
import BillsPage from '../components/bills/BillsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: AuthFrontend
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: OrderList
  },
  {
    path: '/admin/history',
    name: 'admin-history',
    component: HistoryPage
  },
  {
    path: '/admin/bills',
    name: 'admin-bills',
    component: BillsPage
  },
  {
    path: '/admin/create-waiter',
    name: 'admin-create-waiter',
    component: CreateWaiterPage
  },
  {
    path: '/admin/add-menu-item',
    name: 'admin-add-menu-item',
    component: AddMenuItemPage
  },
  {    path: '/admin/edit-menu-item/:id',
    name: 'admin-edit-menu-item',
    component: EditMenuItemPage
  },
  {    path: '/waiter',
    name: 'waiter',
    component: WaiterDashboard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

