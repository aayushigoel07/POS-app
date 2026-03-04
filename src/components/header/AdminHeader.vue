<template>
  <header
    class="bg-white border-b border-slate-100 py-3 flex items-center justify-between relative"
  >
    <!-- Left: logo + brand, flush to left edge -->
    <div class="flex items-center gap-2 pl-4">
      <img
        :src="hungryDukeLogo"
        alt="Hungry Duke logo"
        class="w-8 h-8 rounded-lg object-cover"
      />
      <h1 class="font-md text-lg text-black">Hungry Duke</h1>
    </div>

    <!-- Center: nav absolutely centered on the page -->
    <nav
      class="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm font-medium"
    >
      <RouterLink
        to="/admin"
        :class="navLinkClass('/admin')"
      >
        <LayoutDashboard class="w-4 h-4" />
        <span>Dashboard</span>
      </RouterLink>
      <RouterLink
        to="/admin/orders"
        :class="navLinkClass('/admin/orders')"
      >
        <NotepadText class="w-4 h-4" />
        <span>Order List</span>
      </RouterLink>
      <RouterLink
        to="/admin/history"
        :class="navLinkClass('/admin/history')"
      >
        <History class="w-4 h-4" />
        <span>History</span>
      </RouterLink>
      <RouterLink
        to="/admin/bills"
        :class="navLinkClass('/admin/bills')"
      >
        <Receipt class="w-4 h-4" />
        <span>Bills</span>
      </RouterLink>
    </nav>

    <!-- Right: user controls, flush to right edge -->
    <div class="flex items-center gap-4 pr-4" id="user-settings-dropdown-root">
      <button class="p-2 text-slate-400" type="button">
        <span class="pi pi-bell" />
      </button>
      <UserSettingsDropdown />
    </div>
  </header>
</template>

<script setup lang="ts">
import UserSettingsDropdown from '../user/settings/UserSettingsDropdown.vue';
import hungryDukeLogo from '../../assets/hungryDukeLogo.png';
import { LayoutDashboard, NotepadText, History, Receipt } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const route = useRoute();

const navLinkClass = (path: string) =>
  route.path === path
    ? "inline-flex items-center gap-2 pb-1 relative transition-colors duration-800 text-[#eb8f34] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#eb8f34] after:origin-left after:scale-x-100 after:transition-transform after:duration-800"
    : "inline-flex items-center gap-2 pb-1 relative transition-colors duration-800 text-slate-500 hover:text-[#eb8f34] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#eb8f34] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-800";
</script>

