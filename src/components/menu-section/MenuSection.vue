<template>
  <section>
    <div class="flex items-center gap-4 mb-6 bg-slate-100/50 p-1 rounded-xl w-fit overflow-x-auto">
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        @click="selectedCategory = cat"
        :class="[
          'px-6 py-2 rounded-lg text-sm transition whitespace-nowrap',
          cat === selectedCategory ? 'bg-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-600'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <p v-if="loading" class="text-sm text-slate-500">Loading menu items...</p>
    <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>
    <MenuCards v-else :menu-items="itemsInCategory" :is-admin="isAdmin" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import MenuCards from '../menu-cards/MenuCards.vue';
import type { MenuItem } from '../menu-cards/MenuCards.vue';

const menuItems = ref<MenuItem[]>([]);
const selectedCategory = ref<string>('');
const loading = ref(false);
const error = ref('');
const isAdmin = ref(false);

const categories = computed<string[]>(() => {
  const cats = Array.from(new Set(menuItems.value.map((item) => item.category)));
  return cats.sort();
});

const itemsInCategory = computed(() => {
  if (!selectedCategory.value) return menuItems.value;
  return menuItems.value.filter((item) => item.category === selectedCategory.value);
});

const fetchMenuItems = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('http://localhost:3000/api/menu-items');
    const data = await response.json().catch(() => []);

    if (!response.ok) {
      throw new Error('Failed to load menu items.');
    }

    menuItems.value = Array.isArray(data)
      ? data.map((item) => ({
          id: Number(item?.id) || 0,
          name: String(item?.name || ''),
          imageUrl: String(item?.imageUrl || ''),
          description: String(item?.description || ''),
          category: String(item?.category || 'Uncategorized'),
          price: Number(item?.price) || 0
        }))
      : [];

    // Select first category by default
      if (categories.value.length > 0) {
        const firstCategory = categories.value[0];
        if (firstCategory) {
          selectedCategory.value = firstCategory;
        }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong while loading menu.';
  } finally {
    loading.value = false;
  }
};

const checkAdminRole = () => {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      isAdmin.value = user.role === 'admin';
    } catch {
      isAdmin.value = false;
    }
  }
};

onMounted(() => {
  checkAdminRole();
  fetchMenuItems();
});
</script>

