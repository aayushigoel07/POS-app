<template>
  <AdminAuthGuard>
    <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">

      <main class="flex-1 flex justify-center items-start p-6">
        <div class="w-full max-w-xl">
          <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-lg font-semibold mb-1 text-slate-900">
              Create Waiter Account
            </h2>
            <p class="text-xs text-slate-500 mb-5">
              Add new waiters who can take orders on the POS.
            </p>

            <form @submit.prevent="createWaiter" class="space-y-4">
              <div>
                <label for="waiter-username" class="block text-sm font-medium mb-1">
                  Waiter Username
                </label>
                <input
                  id="waiter-username"
                  v-model="waiterUsername"
                  type="text"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="New waiter username"
                />
              </div>

              <div>
                <label for="waiter-password" class="block text-sm font-medium mb-1">
                  Waiter Password
                </label>
                <input
                  id="waiter-password"
                  v-model="waiterPassword"
                  type="password"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="New waiter password"
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-xl transition"
              >
                {{ loading ? 'Creating...' : 'Create Waiter' }}
              </button>
            </form>

            <p
              v-if="message"
              :class="[
                'mt-3 text-sm',
                messageType === 'error' ? 'text-red-600' : 'text-emerald-600'
              ]"
            >
              {{ message }}
            </p>
          </section>
        </div>
      </main>
    </div>
  </AdminAuthGuard>
</template>

<script setup>
import AdminAuthGuard from '../user/auth/AdminAuthGuard.vue';
import AdminHeader from '../header/AdminHeader.vue';
import { useCreateWaiterPage } from './createWaiterPage.js';

const {
  waiterUsername,
  waiterPassword,
  loading,
  message,
  messageType,
  createWaiter
} = useCreateWaiterPage();
</script>
