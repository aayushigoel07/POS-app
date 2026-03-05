<template>
  <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Bills & Invoices</h1>
          <p class="text-sm text-slate-500 mt-1">View and print invoices for completed orders</p>
        </div>

        <div v-if="completedOrders.length === 0" class="text-center py-12 text-slate-400">
          <svg class="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium">No completed orders yet</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="order in completedOrders" 
            :key="order.id"
            class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
          >
            <!-- Invoice Header -->
            <div class="bg-slate-800 text-white px-6 py-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-bold">Invoice #{{ order.id }}</h3>
                  <p class="text-xs text-slate-300 mt-1">{{ formatDateTime(order.createdAt) }}</p>
                </div>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold',
                    order.orderType === 'dine-in' ? 'bg-amber-500' : 
                    order.orderType === 'takeout' ? 'bg-blue-500' : 'bg-emerald-500'
                  ]"
                >
                  {{ order.orderType === 'takeout' ? 'Take Away' : order.orderType.replace('-', ' ').toUpperCase() }}
                </span>
              </div>
            </div>

            <!-- Invoice Body -->
            <div class="p-6">
              <!-- Customer Info -->
              <div class="mb-4 pb-4 border-b border-slate-200">
                <p class="text-sm text-slate-500">Customer</p>
                <p class="font-semibold text-slate-800">{{ order.customerName }}</p>
                <p class="text-sm text-slate-600 mt-1">{{ order.table }}</p>
                <p class="text-xs text-slate-500 mt-1">Served by: {{ order.waiterName }}</p>
              </div>

              <!-- Items List -->
              <div class="mb-4">
                <p class="text-sm font-semibold text-slate-700 mb-2">Order Items</p>
                <div class="space-y-2">
                  <div 
                    v-for="item in order.items" 
                    :key="item.id"
                    class="flex justify-between items-center text-sm"
                  >
                    <div class="flex-1">
                      <p class="text-slate-700">{{ item.name }}</p>
                      <p class="text-xs text-slate-500">{{ item.quantity }} × ₹{{ item.price }}</p>
                    </div>
                    <p class="font-semibold text-slate-800">₹{{ (item.quantity * item.price).toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div class="pt-4 border-t-2 border-slate-300">
                <div class="flex justify-between items-center mb-1">
                  <p class="text-sm text-slate-600">Subtotal</p>
                  <p class="text-sm text-slate-800">₹{{ getOrderSubtotal(order).toFixed(2) }}</p>
                </div>
                <div class="flex justify-between items-center mb-2">
                  <p class="text-sm text-slate-600">Tax (5%)</p>
                  <p class="text-sm text-slate-800">₹{{ getOrderTax(order).toFixed(2) }}</p>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-slate-200">
                  <p class="text-base font-bold text-slate-800">Total</p>
                  <p class="text-lg font-bold text-slate-800">₹{{ getOrderTotal(order).toFixed(2) }}</p>
                </div>
              </div>

              <!-- Print Button -->
              <button
                @click="printInvoice(order)"
                class="w-full mt-4 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Hidden Print Template -->
    <div id="print-area" class="hidden print:block">
      <div v-if="printingOrder" class="p-8 max-w-2xl mx-auto bg-white">
        <div class="text-center mb-6 pb-4 border-b-2 border-slate-800">
          <h1 class="text-3xl font-bold text-slate-800">INVOICE</h1>
          <p class="text-slate-600 mt-2">POS Restaurant</p>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p class="text-slate-500">Invoice Number</p>
            <p class="font-bold text-slate-800">#{{ printingOrder.id }}</p>
          </div>
          <div class="text-right">
            <p class="text-slate-500">Date</p>
            <p class="font-bold text-slate-800">{{ formatDateTime(printingOrder.createdAt) }}</p>
          </div>
        </div>

        <div class="mb-6 pb-4 border-b border-slate-300">
          <p class="text-slate-500 text-sm mb-1">Customer Details</p>
          <p class="font-bold text-slate-800">{{ printingOrder.customerName }}</p>
          <p class="text-slate-600 text-sm">{{ printingOrder.table }}</p>
          <p class="text-slate-600 text-sm">Order Type: {{ printingOrder.orderType }}</p>
          <p class="text-slate-500 text-xs mt-2">Served by: {{ printingOrder.waiterName }}</p>
        </div>

        <table class="w-full mb-6">
          <thead>
            <tr class="border-b-2 border-slate-800">
              <th class="text-left py-2 text-sm font-bold text-slate-800">Item</th>
              <th class="text-center py-2 text-sm font-bold text-slate-800">Qty</th>
              <th class="text-right py-2 text-sm font-bold text-slate-800">Price</th>
              <th class="text-right py-2 text-sm font-bold text-slate-800">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in printingOrder.items" :key="item.id" class="border-b border-slate-200">
              <td class="py-2 text-sm text-slate-800">{{ item.name }}</td>
              <td class="text-center py-2 text-sm text-slate-600">{{ item.quantity }}</td>
              <td class="text-right py-2 text-sm text-slate-600">₹{{ item.price }}</td>
              <td class="text-right py-2 text-sm font-semibold text-slate-800">₹{{ (item.quantity * item.price).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="text-right mb-8">
          <div class="flex justify-end mb-2">
            <p class="text-slate-600 mr-8">Subtotal:</p>
            <p class="font-semibold text-slate-800 w-24">₹{{ getOrderSubtotal(printingOrder).toFixed(2) }}</p>
          </div>
          <div class="flex justify-end mb-2">
            <p class="text-slate-600 mr-8">Tax (5%):</p>
            <p class="font-semibold text-slate-800 w-24">₹{{ getOrderTax(printingOrder).toFixed(2) }}</p>
          </div>
          <div class="flex justify-end pt-2 border-t-2 border-slate-800">
            <p class="text-lg font-bold text-slate-800 mr-8">Total:</p>
            <p class="text-lg font-bold text-slate-800 w-24">₹{{ getOrderTotal(printingOrder).toFixed(2) }}</p>
          </div>
        </div>

        <div class="text-center pt-4 border-t border-slate-300 text-sm text-slate-500">
          <p>Thank you for your business!</p>
          <p class="text-xs mt-1">This is a computer generated invoice</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useOrderStore } from '../../stores/orderStore';
import type { Order } from '../../stores/orderStore';

const orderStore = useOrderStore();
const printingOrder = ref<Order | null>(null);
const TAX_RATE = 0.05; // 5% GST

const completedOrders = computed(() => {
  return orderStore.orders
    .filter(order => order.status === 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const getOrderSubtotal = (order: Order) => {
  return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const getOrderTax = (order: Order) => {
  return getOrderSubtotal(order) * TAX_RATE;
};

const getOrderTotal = (order: Order) => {
  return getOrderSubtotal(order) + getOrderTax(order);
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const printInvoice = (order: Order) => {
  printingOrder.value = order;
  
  // Use setTimeout to ensure the DOM is updated before printing
  setTimeout(() => {
    window.print();
  }, 100);
};
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #print-area,
  #print-area * {
    visibility: visible;
  }
  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
