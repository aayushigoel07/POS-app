<script setup lang="ts">
import AdminHeader from './components/header/AdminHeader.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showAdminHeader = computed(() => route.path.startsWith('/admin'));
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <AdminHeader v-if="showAdminHeader" />
    <router-view />
  </div>
</template>
