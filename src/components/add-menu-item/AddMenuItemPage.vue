<template>
  <AdminAuthGuard>
    <div class="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-slate-700">
      <main class="flex-1 flex justify-center items-start p-6">
        <div class="w-full max-w-xl">
          <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-lg font-semibold mb-1 text-slate-900">Add Menu Item</h2>
            <p class="text-xs text-slate-500 mb-5">
              Create a new menu item for the dashboard cards.
            </p>

            <form @submit.prevent="addMenuItem" class="space-y-4">
              <div>
                <label for="item-name" class="block text-sm font-medium mb-1">
                  Item Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="item-name"
                  v-model="itemName"
                  type="text"
                  required
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Paneer Tikka Pizza"
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
                  v-model="itemDescription"
                  rows="3"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Short, clear item description"
                />
              </div>

              <div>
                <label for="item-category" class="block text-sm font-medium mb-1">
                  Category <span class="text-red-500">*</span>
                </label>
                <input
                  id="item-category"
                  v-model="itemCategory"
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
                  v-model="itemPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-xl transition"
              >
                {{ loading ? 'Adding...' : 'Add Menu Item' }}
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

    <input
      id="menu-image-file-input"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageChange"
    />
  </AdminAuthGuard>
</template>

<script setup>
import AdminAuthGuard from '../user/auth/AdminAuthGuard.vue';
import { useAddMenuItemPage } from './addMenuItemPage.js';

const {
  itemName,
  itemImage,
  itemImagePreview,
  itemDescription,
  itemCategory,
  itemPrice,
  loading,
  message,
  messageType,
  triggerImageUpload,
  handleImageChange,
  clearImage,
  addMenuItem
} = useAddMenuItemPage();
</script>
