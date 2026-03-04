<template>
  <div class="relative">
    <button
      type="button"
      class="flex items-center gap-2"
      @click="toggleMenu"
    >
      <img
        :src="avatarSrc"
        class="w-8 h-8 rounded-full border object-cover"
        alt="Admin avatar"
      />
    </button>

    <div
      v-if="open"
      class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20"
    >
      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        @click="goToAddMenuItem"
      >
        <span>Add menu item</span>
        <span class="text-xs text-slate-400">→</span>
      </button>

      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        @click="goToCreateWaiter"
      >
        <span>Create waiter account</span>
        <span class="text-xs text-slate-400">→</span>
      </button>

      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        @click="triggerAvatarUpload"
      >
        <span>Change profile picture</span>
      </button>

      <div class="my-1 border-t border-slate-100" />

      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        @click="logout"
      >
        <span>Logout</span>
      </button>
    </div>

    <input
      id="avatar-file-input"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { useUserSettingsDropdown } from './userSettingsDropdown.js';

const {
  open,
  avatarSrc,
  fileInput,
  toggleMenu,
  goToAddMenuItem,
  goToCreateWaiter,
  triggerAvatarUpload,
  handleFileChange,
  logout
} = useUserSettingsDropdown();
</script>

