<template>
  <AdminAuthGuard>
    <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">

      <div class="flex flex-1 overflow-hidden">
        <main class="flex-1 overflow-y-auto p-6 space-y-8">
          <OrderList :allow-complete="true" :allow-cancel="true" :allow-delete="true" :show-filters="true" />
          <MenuSection />
        </main>

        <OrderSidebar />
      </div>
    </div>
  </AdminAuthGuard>
</template>

<script setup lang="ts">
import AdminAuthGuard from './auth/AdminAuthGuard.vue';
import OrderList from '../order-list/OrderList.vue';
import MenuSection from '../menu-section/MenuSection.vue';
import OrderSidebar from '../order-sidebar/OrderSidebar.vue';
</script>
