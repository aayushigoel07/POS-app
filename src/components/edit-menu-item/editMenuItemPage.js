import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useEditMenuItemPage(itemId) {
  const router = useRouter();
  const itemData = ref(null);
  const itemImage = ref(null);
  const itemImagePreview = ref('');
  const loading = ref(false);
  const submitting = ref(false);
  const message = ref('');
  const messageType = ref('success'); // 'success' | 'error'

  const getCurrentUserRole = () => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return null;

    try {
      const user = JSON.parse(stored);
      return user.role || null;
    } catch {
      return null;
    }
  };

  const triggerImageUpload = () => {
    const fileInput = document.getElementById('edit-menu-image-file-input');
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  };

  const handleImageChange = (event) => {
    const input = event.target;
    if (!input || !input.files || input.files.length === 0) return;

    const file = input.files[0];
    itemImage.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        itemImagePreview.value = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    itemImage.value = null;
    itemImagePreview.value = '';
    const fileInput = document.getElementById('edit-menu-image-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const loadItem = async () => {
    loading.value = true;
    message.value = '';

    try {
      const response = await fetch(`http://localhost:3000/api/menu-items`);
      if (!response.ok) {
        throw new Error('Failed to load menu items.');
      }

      const allItems = await response.json();
      const item = allItems.find((i) => Number(i.id) === itemId);

      if (!item) {
        throw new Error('Menu item not found.');
      }

      itemData.value = { ...item };
      // Set preview if image exists
      if (item.imageUrl) {
        itemImagePreview.value = `http://localhost:3000${item.imageUrl}`;
      }
    } catch (err) {
      message.value = err?.message || 'Something went wrong.';
      messageType.value = 'error';
    } finally {
      loading.value = false;
    }
  };

  const submitEdits = async () => {
    message.value = '';
    messageType.value = 'success';

    if (!itemData.value) {
      message.value = 'Item data not loaded.';
      messageType.value = 'error';
      return;
    }

    const trimmedName = String(itemData.value.name || '').trim();
    const trimmedCategory = String(itemData.value.category || '').trim();

    if (!trimmedName || !trimmedCategory) {
      message.value = 'Please fill in all required fields.';
      messageType.value = 'error';
      return;
    }

    if (itemData.value.price === '' || itemData.value.price === null || itemData.value.price === undefined) {
      message.value = 'Please fill in all required fields.';
      messageType.value = 'error';
      return;
    }

    const parsedPrice = Number(itemData.value.price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      message.value = 'Please enter a valid non-negative price.';
      messageType.value = 'error';
      return;
    }

    const role = getCurrentUserRole();
    if (!role) {
      message.value = 'You are not logged in.';
      messageType.value = 'error';
      return;
    }

    submitting.value = true;

    try {
      const formData = new FormData();
      formData.append('name', trimmedName);
      formData.append('description', String(itemData.value.description || '').trim());
      formData.append('category', trimmedCategory);
      formData.append('price', String(parsedPrice));
      
      if (itemImage.value) {
        formData.append('image', itemImage.value);
      }

      console.log('Sending PUT request to:', `http://localhost:3000/api/menu-items/${itemId}`);

      const response = await fetch(`http://localhost:3000/api/menu-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'X-User-Role': role
        },
        body: formData
      });

      console.log('Response status:', response.status);

      const data = await response.json().catch((err) => {
        console.error('Failed to parse response as JSON:', err);
        return {};
      });

      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server returned ${response.status}`);
      }

      message.value = 'Menu item updated successfully.';
      messageType.value = 'success';

      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err) {
      console.error('submitEdits error:', err);
      message.value = err?.message || 'Something went wrong.';
      messageType.value = 'error';
    } finally {
      submitting.value = false;
    }
  };

  const deleteItem = async () => {
    if (!confirm('Are you sure you want to delete this menu item? This cannot be undone.')) {
      return;
    }

    message.value = '';
    messageType.value = 'success';

    const role = getCurrentUserRole();
    if (!role) {
      message.value = 'You are not logged in.';
      messageType.value = 'error';
      return;
    }

    submitting.value = true;

    try {
      console.log('Sending DELETE request to:', `http://localhost:3000/api/menu-items/${itemId}`);

      const response = await fetch(`http://localhost:3000/api/menu-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': role
        }
      });

      console.log('DELETE response status:', response.status);

      const data = await response.json().catch((err) => {
        console.error('Failed to parse DELETE response as JSON:', err);
        return {};
      });

      console.log('DELETE response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server returned ${response.status}`);
      }

      message.value = 'Menu item deleted successfully.';
      messageType.value = 'success';

      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err) {
      console.error('deleteItem error:', err);
      message.value = err?.message || 'Something went wrong.';
      messageType.value = 'error';
    } finally {
      submitting.value = false;
    }
  };

  return {
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
  };
}
