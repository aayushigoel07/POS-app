<template>
  <aside
    class="w-96 bg-white border-l border-slate-100 p-6 flex flex-col gap-8 overflow-y-auto"
  >
    <div>
      <h3 class="font-bold mb-4">Customer Information</h3>
      <input
        type="text"
        placeholder="Customer Name"
        class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm mb-3 focus:ring-2 focus:ring-indigo-500"
      />
      <select
        class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option>Select Table</option>
      </select>
    </div>

    <div class="flex-1">
      <h3 class="font-bold mb-4">Order Details</h3>
      <div class="flex gap-3 mb-4">
        <img
          src="https://placehold.co/60x60"
          class="w-16 h-16 rounded-xl object-cover"
          alt="Menu item"
        />
        <div class="flex-1">
          <p class="text-sm font-bold">Crispy Dory Sambal Matah</p>
          <div class="flex justify-between items-center mt-2">
            <div class="flex items-center gap-3 bg-slate-50 rounded-lg px-2 py-1">
              <button class="text-slate-400" type="button">-</button>
              <span class="text-xs font-bold">2</span>
              <button class="text-indigo-600" type="button">+</button>
            </div>
            <p class="font-bold text-sm">$101.00</p>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-2 border-t border-dashed border-slate-200">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-slate-400">Subtotal</span>
        <span class="font-bold">$382.00</span>
      </div>
      <div class="flex justify-between text-sm mb-6">
        <span class="text-slate-400">Tax (10%)</span>
        <span class="font-bold">$38.20</span>
      </div>
      <button
        class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
        type="button"
      >
        Process Transaction
      </button>
    </div>
  </aside>
</template>

