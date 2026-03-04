<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-sm bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-semibold text-center mb-4">POS Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium mb-1">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-1">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded transition"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="error" class="text-red-600 text-sm text-center mt-2">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    const user = data;

    // Save logged-in user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin');
    } else if (user.role === 'waiter') {
      router.push('/waiter');
    } else {
      router.push('/');
    }
  } catch (err: any) {
    error.value = err?.message || 'Something went wrong.';
  } finally {
    loading.value = false;
  }
};
</script>

