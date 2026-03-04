<template>
  <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <article
      v-for="item in menuItems"
      :key="item.id"
      class="bg-white rounded-2xl shadow-sm border border-slate-200/70 hover:shadow-md transition-shadow flex flex-col overflow-hidden"
    >
      <div
        class="h-28 w-full bg-slate-100 overflow-hidden flex items-center justify-center"
      >
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          :alt="item.name"
          class="h-full w-full object-cover"
        />
        <span v-else class="text-xs text-slate-400">Menu image</span>
      </div>

      <div class="p-4 flex-1 flex flex-col">
        <header class="flex items-start justify-between gap-3 mb-1.5">
          <h2 class="text-sm font-semibold text-slate-900">
            {{ item.name }}
          </h2>
          <span class="text-sm font-bold text-sky-600 shrink-0">
            {{ item.price.toFixed(2) }} AED
          </span>
        </header>

        <p class="text-xs text-slate-500 leading-relaxed flex-1">
          {{ item.description }}
        </p>
      </div>

      <footer
        class="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-3"
      >
        <div v-if="isAdmin" class="flex items-center gap-2">
          <button
            type="button"
            @click="editItem(item.id)"
            class="inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
            title="Edit item"
          >
            <PencilLine class="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-sky-500 text-white text-lg leading-none hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1"
        >
          +
        </button>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { PencilLine } from 'lucide-vue-next';

const router = useRouter();

export type MenuItem = {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  category: string;
};

interface Props {
  menuItems: MenuItem[];
  isAdmin?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false
});

const editItem = (itemId: number) => {
  router.push(`/admin/edit-menu-item/${itemId}`);
};
</script>

