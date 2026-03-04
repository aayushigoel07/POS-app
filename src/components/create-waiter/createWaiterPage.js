import { ref } from 'vue';

export function useCreateWaiterPage() {
  const waiterUsername = ref('');
  const waiterPassword = ref('');
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

  const createWaiter = async () => {
    message.value = '';
    messageType.value = 'success';

    if (!waiterUsername.value || !waiterPassword.value) {
      message.value = 'Please fill in both fields.';
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
      const response = await fetch('http://localhost:3000/api/auth/create-waiter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': role
        },
        body: JSON.stringify({
          username: waiterUsername.value,
          password: waiterPassword.value
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create waiter.');
      }

      message.value = `Waiter "${data.username}" created successfully.`;
      messageType.value = 'success';
      waiterUsername.value = '';
      waiterPassword.value = '';
    } catch (err) {
      message.value = err?.message || 'Something went wrong.';
      messageType.value = 'error';
    } finally {
      loading.value = false;
    }
  };

  return {
    waiterUsername,
    waiterPassword,
    loading,
    message,
    messageType,
    createWaiter
  };
}

