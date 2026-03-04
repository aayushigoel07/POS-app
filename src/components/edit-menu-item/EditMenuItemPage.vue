<template>
  <AdminAuthGuard>
    <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
      <main class="flex-1 flex justify-center items-start p-6">
        <div class="w-full max-w-xl">
          <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-lg font-semibold mb-1 text-slate-900">Edit Menu Item</h2>
            <p class="text-xs text-slate-500 mb-5">
              Update the menu item details below.
            </p>

            <form v-if="!loading && itemData" @submit.prevent="submitEdits" class="space-y-4">
              <div>
                <label for="item-name" class="block text-sm font-medium mb-1">
                  Item Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="item-name"
                  v-model="itemData.name"
                  type="text"
                  required
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Item name"
                />
              </div>

              <div>
                <label for="item-image" class="block text-sm font-medium mb-1">
                  Image
                </label>
                <div class="space-y-2">
                  <button
                    v-if="!itemImagePreview"
                    type="button"
                    @click="triggerImageUpload"
                    class="w-full bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-slate-300 rounded-xl px-3 py-6 text-sm text-slate-600 transition"
                  >
                    📸 Click to upload or drag image
                  </button>
                  <div v-else class="relative">
                    <img
                      :src="itemImagePreview"
                      alt="Preview"
                      class="w-full h-32 object-cover rounded-xl border border-slate-300"
                    />
                    <button
                      type="button"
                      @click="clearImage"
                      class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label for="item-description" class="block text-sm font-medium mb-1">
                  Short Description
                </label>
                <textarea
                  id="item-description"
                  v-model="itemData.description"
                  rows="3"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Short item description"
                />
              </div>

              <div>
                <label for="item-category" class="block text-sm font-medium mb-1">
                  Category <span class="text-red-500">*</span>
                </label>
                <input
                  id="item-category"
                  v-model="itemData.category"
                  type="text"
                  required
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Main course, Appetizer, Dessert, Beverage"
                />
              </div>

              <div>
                <label for="item-price" class="block text-sm font-medium mb-1">
                  Price <span class="text-red-500">*</span>
                </label>
                <input
                  id="item-price"
                  v-model="itemData.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  type="submit"
                  :disabled="submitting"
                  class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-xl transition"
                >
                  {{ submitting ? 'Saving...' : 'Submit Edits' }}
                </button>

                <button
                  type="button"
                  @click="deleteItem"
                  :disabled="submitting"
                  class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-xl transition"
                >
                  {{ submitting ? 'Deleting...' : 'Delete Item' }}
                </button>
              </div>
            </form>

            <div v-else-if="loading" class="text-sm text-slate-500">
              Loading item details...
            </div>

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

    <input
      id="edit-menu-image-file-input"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageChange"
    />
  </AdminAuthGuard>
</template>

<script setup>
import AdminAuthGuard from '../user/auth/AdminAuthGuard.vue';
import { useEditMenuItemPage } from './editMenuItemPage.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const itemId = Number(route.params.id);

const {
  itemData,
  itemImage,
  itemImagePreview,
  loading,
  submitting,
  message,
  messageType,
  loadItem,
  triggerImageUpload,
  handleImageChange,
  clearImage,
  submitEdits,
  deleteItem
} = useEditMenuItemPage(itemId);

// Load item when component mounts
loadItem();
</script>
