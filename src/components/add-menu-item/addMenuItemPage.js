import { ref } from 'vue';

export function useAddMenuItemPage() {
  const itemName = ref('');
  const itemImage = ref(null);
  const itemImagePreview = ref('');
  const itemDescription = ref('');
  const itemCategory = ref('');
  const itemPrice = ref('');
  const loading = ref(false);
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
    const fileInput = document.getElementById('menu-image-file-input');
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
    const fileInput = document.getElementById('menu-image-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const addMenuItem = async () => {
    message.value = '';
    messageType.value = 'success';

    const trimmedName = itemName.value.trim();
    const trimmedCategory = itemCategory.value.trim();

    if (!trimmedName || !trimmedCategory || !itemPrice.value) {
      message.value = 'Please fill in all required fields.';
      messageType.value = 'error';
      return;
    }

    const parsedPrice = Number(itemPrice.value);
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

    loading.value = true;

    try {
      const formData = new FormData();
      formData.append('name', trimmedName);
      formData.append('description', itemDescription.value.trim());
      formData.append('category', trimmedCategory);
      formData.append('price', String(parsedPrice));
      
      if (itemImage.value) {
        formData.append('image', itemImage.value);
      }

      const response = await fetch('http://localhost:3000/api/menu-items', {
        method: 'POST',
        headers: {
          'X-User-Role': role
        },
        body: formData
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add menu item.');
      }

      message.value = `Menu item "${data.name}" added successfully.`;
      messageType.value = 'success';
      itemName.value = '';
      clearImage();
      itemDescription.value = '';
      itemCategory.value = '';
      itemPrice.value = '';
    } catch (err) {
      message.value = err?.message || 'Something went wrong.';
      messageType.value = 'error';
    } finally {
      loading.value = false;
    }
  };

  return {
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
  };
}
