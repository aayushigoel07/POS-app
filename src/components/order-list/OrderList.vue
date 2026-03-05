
<template>
  <section>
    <div class="flex items-center justify-between gap-4 mb-4">
      <h2 class="text-lg font-bold">Order List</h2>
      
      <!-- Filter Tabs -->
      <div v-if="showFilters" class="flex items-center gap-2 overflow-x-auto">
        <button
          @click="selectedFilter = 'all'"
          type="button"
          :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap',
            selectedFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
          ]"
        >
          All
          <span 
            :class="[
              'flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold transition',
              selectedFilter === 'all' ? 'bg-white/20' : 'bg-slate-200'
            ]"
          >
            {{ allCount }}
          </span>
        </button>
        
        <button
          @click="selectedFilter = 'dine-in'"
          type="button"
          :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap',
            selectedFilter === 'dine-in' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
          ]"
        >
          Dine in
          <span 
            :class="[
              'flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold transition',
              selectedFilter === 'dine-in' ? 'bg-white/20' : 'bg-slate-200'
            ]"
          >
            {{ dineInCount }}
          </span>
        </button>
        
        <button
          @click="selectedFilter = 'takeout'"
          type="button"
          :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap',
            selectedFilter === 'takeout' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
          ]"
        >
          Take away
          <span 
            :class="[
              'flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold transition',
              selectedFilter === 'takeout' ? 'bg-white/20' : 'bg-slate-200'
            ]"
          >
            {{ takeoutCount }}
          </span>
        </button>
        
        <button
          @click="selectedFilter = 'delivery'"
          type="button"
          :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap',
            selectedFilter === 'delivery' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
          ]"
        >
          Delivery
          <span 
            :class="[
              'flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold transition',
              selectedFilter === 'delivery' ? 'bg-white/20' : 'bg-slate-200'
            ]"
          >
            {{ deliveryCount }}
          </span>
        </button>
      </div>
    </div>
    
    <div class="flex gap-4 overflow-x-auto pb-2">
      <div
        v-for="order in orders"
        :key="order.id"
        class="min-w-[220px] bg-white p-4 rounded-2xl shadow-sm border border-slate-50 relative"
      >
        <!-- Delete Button (Admin Only - Completed/Canceled Orders) -->
        <button
          v-if="props.allowDelete && (order.status === 'completed' || order.status === 'canceled')"
          type="button"
          @click.stop="deleteOrder(order.id)"
          class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition z-10"
          title="Delete order"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="flex justify-between items-start mb-2">
          <p class="font-bold text-sm">{{ order.customerName }}</p>
          <span class="text-[10px] text-slate-400">#{{ order.id }}</span>
        </div>
        <p class="text-[10px] text-slate-400 mb-3">
          {{ order.items.length }} Items • {{ order.table }}
        </p>
        
        <!-- Order Items List (Only visible when showItems is true) -->
        <div v-if="showItems && order.items.length > 0" class="mb-3 space-y-2">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between items-center text-xs border-t border-slate-100 pt-2"
          >
            <div class="flex-1">
              <p class="font-medium text-slate-700">{{ item.name }}</p>
              <p class="text-slate-400 text-[10px]">{{ item.price.toFixed(2) }} AED</p>
            </div>
            <span class="text-slate-500 font-bold">x{{ item.quantity }}</span>
          </div>
        </div>
        
        <!-- Status Badge -->
        <div class="mb-3">
          <span
            v-if="order.status === 'pending'"
            class="px-3 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full uppercase"
          >
            Pending
          </span>
          <span
            v-else-if="order.status === 'preparing'"
            class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase"
          >
            Preparing
          </span>
          <span
            v-else-if="order.status === 'ready'"
            class="px-3 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded-full uppercase"
          >
            Ready to Serve
          </span>
          <span
            v-else-if="order.status === 'completed'"
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
        </div>

        <!-- Kitchen Action Buttons (Only visible when allowStatusChange is true) -->
        <div v-if="allowStatusChange" class="space-y-2">
          <button
            v-if="order.status === 'pending'"
            @click="updateStatus(order.id, 'preparing')"
            class="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition"
          >
            Start Preparing
          </button>
          <button
            v-if="order.status === 'preparing'"
            @click="updateStatus(order.id, 'ready')"
            class="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition"
          >
            Mark Ready
          </button>
        </div>

        <!-- Waiter Complete Button (Only visible when allowComplete is true) -->
        <div v-if="allowComplete" class="space-y-2">
          <button
            v-if="order.status === 'ready'"
            type="button"
            @click="updateStatus(order.id, 'completed')"
            class="w-full px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
          >
            Complete Order
          </button>
        </div>

        <!-- Cancel Button (Only visible when allowCancel is true) -->
        <div v-if="allowCancel" class="space-y-2">
          <button
            v-if="order.status !== 'completed' && order.status !== 'canceled'"
            type="button"
            @click="updateStatus(order.id, 'canceled')"
            class="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition"
          >
            Cancel Order
          </button>
        </div>

        <!-- Remove Button (Kitchen - Remove canceled orders from view) -->
        <div v-if="allowRemove" class="space-y-2">
          <button
            v-if="order.status === 'canceled'"
            type="button"
            @click="hideFromKitchen(order.id)"
            class="w-full px-3 py-2 bg-slate-400 hover:bg-slate-500 text-white text-xs font-bold rounded-lg transition"
          >
            Remove from View
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useOrderStore } from '../../stores/orderStore';
import type { Order } from '../../stores/orderStore';

// Props
const props = defineProps<{
  showItems?: boolean;
  allowStatusChange?: boolean;
  allowComplete?: boolean;
  allowCancel?: boolean;
  allowRemove?: boolean;
  allowDelete?: boolean;
  hideCompleted?: boolean;
  hideFromKitchen?: boolean;
  showFilters?: boolean;
}>();

const orderStore = useOrderStore();
const selectedFilter = ref<'all' | 'dine-in' | 'takeout' | 'delivery'>('all');

// Get base filtered orders
const baseOrders = computed(() => {
  let filteredOrders = orderStore.orders;
  if (props.hideCompleted) {
    filteredOrders = filteredOrders.filter(order => order.status !== 'completed');
  }
  if (props.hideFromKitchen) {
    filteredOrders = filteredOrders.filter(order => !orderStore.hiddenFromKitchen.includes(order.id));
  }
  return filteredOrders;
});

// Counts for each filter
const allCount = computed(() => baseOrders.value.length);
const dineInCount = computed(() => baseOrders.value.filter(order => order.orderType === 'dine-in').length);
const takeoutCount = computed(() => baseOrders.value.filter(order => order.orderType === 'takeout').length);
const deliveryCount = computed(() => baseOrders.value.filter(order => order.orderType === 'delivery').length);

// Filtered orders based on selected filter
const orders = computed(() => {
  if (selectedFilter.value === 'all') {
    return baseOrders.value;
  }
  return baseOrders.value.filter(order => order.orderType === selectedFilter.value);
});

const updateStatus = (orderId: number, status: Order['status']) => {
  orderStore.setOrderStatus(orderId, status);
};

const deleteOrder = (orderId: number) => {
  if (confirm('Are you sure you want to delete this order?')) {
    orderStore.deleteOrder(orderId);
  }
};

const hideFromKitchen = (orderId: number) => {
  orderStore.hideFromKitchen(orderId);
};
</script>

