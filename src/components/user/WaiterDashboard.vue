<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow p-6 w-full max-w-md text-center space-y-4">
      <h1 class="text-2xl font-semibold">Waiter Dashboard</h1>
      <p class="text-slate-600">
        Welcome, <span class="font-semibold">{{ currentUser?.username }}</span>.
      </p>
      <p class="text-sm text-slate-500">
        This is a placeholder page. You can later add tables, orders, and other POS features here.
      </p>
      <button
        class="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const currentUser = ref<{ id: number; username: string; role: string } | null>(null);

onMounted(() => {
  const stored = localStorage.getItem('currentUser');

  if (!stored) {
    router.push('/');
    return;
  }

  try {
    const user = JSON.parse(stored);
    currentUser.value = user;

    if (user.role !== 'waiter') {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  } catch {
    router.push('/');
  }
});

const logout = () => {
  localStorage.removeItem('currentUser');
  router.push('/');
};
</script>

