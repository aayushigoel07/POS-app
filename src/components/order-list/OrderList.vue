
<template>
  <section>
    <div class="flex justify-between items-end mb-4">
      <h2 class="text-lg font-bold">Order List</h2>
      <button class="text-xs text-slate-400" type="button">See All</button>
    </div>
    <div class="flex gap-4 overflow-x-auto pb-2">
      <div
        v-for="order in orders"
        :key="order.id"
        class="min-w-[220px] bg-white p-4 rounded-2xl shadow-sm border border-slate-50"
      >
        <div class="flex justify-between items-start mb-2">
          <p class="font-bold text-sm">{{ order.customerName }}</p>
          <span class="text-[10px] text-slate-400">#{{ order.id }}</span>
        </div>
        <p class="text-[10px] text-slate-400 mb-3">
          {{ order.items.length }} Items • {{ order.table }}
        </p>
        <span
          v-if="order.status === 'pending'"
          class="px-3 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full uppercase"
        >
          Pending
        </span>
        <span
          v-else-if="order.status === 'ready'"
          class="px-3 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded-full uppercase"
        >
          Ready to Serve
        </span>
        <span
          v-else-if="order.status === 'canceled'"
          class="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-full uppercase"
        >
          Canceled
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOrderStore } from '../../stores/orderStore';

const orderStore = useOrderStore();
const orders = computed(() => orderStore.orders);
</script>

