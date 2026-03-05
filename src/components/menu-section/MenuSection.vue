
<template>
  <section>
    <!-- Search Bar -->
    <div class="mb-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search menu items..."
          class="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          type="button"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Categories -->
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
import { onMounted, ref, computed, watch } from 'vue';
import MenuCards from '../menu-cards/MenuCards.vue';
import type { MenuItem } from '../menu-cards/MenuCards.vue';

const menuItems = ref<MenuItem[]>([]);
const selectedCategory = ref<string>('');
const searchQuery = ref<string>('');
const loading = ref(false);
const error = ref('');
const isAdmin = ref(false);

const categories = computed<string[]>(() => {
  const cats = Array.from(new Set(menuItems.value.map((item) => item.category)));
  return ['All', ...cats.sort()];
});

const itemsInCategory = computed(() => {
  let filtered = menuItems.value;
  
  // Apply search filter if search query exists
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => 
      item.name.toLowerCase().startsWith(query) || 
      item.description.toLowerCase().startsWith(query)
    );
  } else if (selectedCategory.value && selectedCategory.value !== 'All') {
    // Apply category filter only if no search query and not "All"
    filtered = filtered.filter((item) => item.category === selectedCategory.value);
  }
  // If "All" is selected and no search, return all items (no filter)
  
  return filtered;
});

// Watch for search changes and update category accordingly
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    // When searching, update category to first result's category
    const query = newQuery.toLowerCase();
    const matches = menuItems.value.filter((item) => 
      item.name.toLowerCase().startsWith(query) || 
      item.description.toLowerCase().startsWith(query)
    );
    const firstMatch = matches[0];
    if (firstMatch) {
      selectedCategory.value = firstMatch.category;
    }
  }
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
          selectedCategory.value = firstCategory; // This will be "All"
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

