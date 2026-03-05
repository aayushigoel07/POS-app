<template>
  <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Order History</h1>
            <p class="text-sm text-slate-500 mt-1">View completed and canceled orders</p>
          </div>
          <button
            v-if="historyOrders.length > 0 && isAdmin"
            @click="clearHistory"
            type="button"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition"
          >
            Clear History
          </button>
        </div>

        <div v-if="historyOrders.length === 0" class="text-center py-12">
          <p class="text-slate-400">No order history yet</p>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Order ID</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Customer</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Table</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Items</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Total</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Status</th>
                <th v-if="isAdmin" class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Waiter</th>
                <th class="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="order in historyOrders" :key="order.id" class="hover:bg-slate-50 transition">
                <td class="px-6 py-4 text-sm font-bold text-slate-700">#{{ order.id }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ order.customerName }}</td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ order.table }}</td>
                <td class="px-6 py-4 text-sm text-slate-500">
                  <div class="space-y-1">
                    <div v-for="item in order.items" :key="item.id" class="text-xs">
                      {{ item.name }} x{{ item.quantity }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-slate-700">
                  ₹{{ calculateTotalWithTax(order.items).toFixed(2) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    v-if="order.status === 'completed'"
                    class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase"
                  >
                    Completed
                  </span>
                  <span
                    v-else-if="order.status === 'canceled'"
                    class="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-full uppercase"
                  >
                    Canceled
                  </span>
                </td>
                <td v-if="isAdmin" class="px-6 py-4 text-sm text-slate-600">
                  {{ order.waiterUsername }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">
                  {{ formatDate(order.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOrderStore } from '../../stores/orderStore';
import type { CartItem } from '../../stores/orderStore';

const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();
const isAdmin = ref(false);
const currentUsername = ref('');
const TAX_RATE = 0.05; // 5% GST

const historyOrders = computed(() => {
  // Combine orders and archived orders for history display
  const allOrders = [
    ...orderStore.orders.filter(order => 
      (order.status === 'completed' || order.status === 'canceled') &&
      !orderStore.clearedFromHistory.includes(order.id)
    ),
    ...orderStore.archivedOrders.filter(order => 
      !orderStore.clearedFromHistory.includes(order.id)
    )
  ];
  
  // Filter by waiter if not admin
  const filteredOrders = isAdmin.value 
    ? allOrders 
    : allOrders.filter(order => order.waiterUsername === currentUsername.value);
  
  return filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const calculateSubtotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const calculateTotalWithTax = (items: CartItem[]) => {
  const subtotal = calculateSubtotal(items);
  const tax = subtotal * TAX_RATE;
  return subtotal + tax;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const clearHistory = () => {
  if (confirm('Are you sure you want to clear all order history? This action cannot be undone.')) {
    orderStore.clearHistory();
  }
};

onMounted(() => {
  const stored = localStorage.getItem('currentUser');

  if (!stored) {
    router.push('/');
    return;
  }

  try {
    const user = JSON.parse(stored);
    
    // Check if user is admin and store username
    isAdmin.value = user.role === 'admin';
    currentUsername.value = user.username || '';
    const expectedRole = route.path.startsWith('/admin') ? 'admin' : 'waiter';

    if (user.role !== expectedRole) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'waiter') {
        router.push('/waiter');
      } else {
        router.push('/');
      }
    }
  } catch {
    router.push('/');
  }
});
</script>
