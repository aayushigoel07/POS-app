
<template>
  <aside
    class="w-96 bg-white border-l border-slate-100 p-6 flex flex-col gap-8 overflow-y-auto min-h-0"
    style="height: calc(100vh - var(--header-height, 56px)); max-height: calc(100vh - var(--header-height, 56px));"
  >
    <div>
      <h3 class="font-bold mb-4">Customer Information</h3>
      <input
        v-model="customerName"
        type="text"
        placeholder="Customer Name"
        class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm mb-3 focus:ring-2 focus:ring-indigo-500"
      />
      <select
        v-model="table"
        class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Table</option>
        <option v-for="n in 10" :key="n" :value="`Table ${n}`">Table {{ n }}</option>
      </select>
    </div>

    <div class="flex-1">
      <h3 class="font-bold mb-4">Order Details</h3>
      <div v-if="cart.length === 0" class="text-slate-400 text-sm">No items in cart.</div>
      <div v-else>
        <div v-for="item in cart" :key="item.id" class="flex gap-3 mb-4">
          <img
            :src="item.imageUrl || 'https://placehold.co/60x60'"
            class="w-16 h-16 rounded-xl object-cover"
            :alt="item.name"
          />
          <div class="flex-1">
            <p class="text-sm font-bold">{{ item.name }}</p>
            <div class="flex justify-between items-center mt-2">
              <div class="flex items-center gap-3 bg-slate-50 rounded-lg px-2 py-1">
                <button class="text-slate-400" type="button" @click="updateQty(item, item.quantity - 1)">-</button>
                <span class="text-xs font-bold">{{ item.quantity }}</span>
                <button class="text-indigo-600" type="button" @click="updateQty(item, item.quantity + 1)">+</button>
              </div>
              <p class="font-bold text-sm">{{ (item.price * item.quantity).toFixed(2) }} AED</p>
              <button class="ml-2 text-red-500 text-xs" type="button" @click="removeItem(item.id)">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-2 border-t border-dashed border-slate-200">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-slate-400">Subtotal</span>
        <span class="font-bold">{{ subtotal.toFixed(2) }} AED</span>
      </div>
      <div class="flex justify-between text-sm mb-6">
        <span class="text-slate-400">Tax (10%)</span>
        <span class="font-bold">{{ tax.toFixed(2) }} AED</span>
      </div>
      <button
        class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
        type="button"
        :disabled="cart.length === 0"
        @click="processOrder"
      >
        Process Transaction
      </button>
      <p v-if="errorMsg" class="mt-3 text-sm text-red-600">{{ errorMsg }}</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore } from '../../stores/orderStore';

const orderStore = useOrderStore();
const customerName = ref('');
const table = ref('');
const errorMsg = ref('');

const cart = computed(() => orderStore.cart);
const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
const tax = computed(() => subtotal.value * 0.1);

import type { CartItem } from '../../stores/orderStore';

function updateQty(item: CartItem, qty: number) {
  orderStore.updateCartQuantity(item.id, qty);
}
function removeItem(itemId: number) {
  orderStore.removeFromCart(itemId);
}
function processOrder() {
  if (!customerName.value.trim() || !table.value.trim()) {
    errorMsg.value = 'Please enter customer name and select table before processing.';
    return;
  }
  errorMsg.value = '';
  orderStore.processTransaction(customerName.value, table.value);
  customerName.value = '';
  table.value = '';
}
</script>

