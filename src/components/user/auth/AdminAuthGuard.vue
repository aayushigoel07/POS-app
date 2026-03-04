<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  const stored = localStorage.getItem('currentUser');

  if (!stored) {
    router.push('/');
    return;
  }

  try {
    const user = JSON.parse(stored);

    if (user.role !== 'admin') {
      if (user.role === 'waiter') {
        router.push('/waiter');
      } else {
        router.push('/');
      }
    }
  } catch {
    router.push('/');
  }
});
</script>

