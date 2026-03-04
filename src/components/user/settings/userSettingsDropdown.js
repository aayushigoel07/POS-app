import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export function useUserSettingsDropdown() {
  const router = useRouter();
  const open = ref(false);
  const avatarSrc = ref('https://ui-avatars.com/api/?name=Admin');

  const toggleMenu = () => {
    open.value = !open.value;
  };

  const handleClickOutside = (event) => {
    const target = event.target;
    if (!target) return;

    const root = document.getElementById('user-settings-dropdown-root');
    if (root && !root.contains(target)) {
      open.value = false;
    }
  };

  const goToCreateWaiter = () => {
    open.value = false;
    router.push('/admin/create-waiter');
  };

  const goToAddMenuItem = () => {
    open.value = false;
    router.push('/admin/add-menu-item');
  };

  const triggerAvatarUpload = () => {
    const fileInput = document.getElementById('avatar-file-input');
    console.log('triggerAvatarUpload called, fileInput:', fileInput);
    if (fileInput) {
      fileInput.value = '';
      console.log('Clicking file input...');
      fileInput.click();
    } else {
      console.warn('fileInput element not found');
    }
  };

  const handleFileChange = (event) => {
    const input = event.target;
    if (!input || !input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        avatarSrc.value = result;
        localStorage.setItem('adminProfileImage', result);
      }
    };

    reader.readAsDataURL(file);
  };

  const logout = () => {
    open.value = false;
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  onMounted(() => {
    const savedAvatar = localStorage.getItem('adminProfileImage');
    if (savedAvatar) {
      avatarSrc.value = savedAvatar;
    }

    window.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside);
  });

  return {
    open,
    avatarSrc,
    toggleMenu,
    goToAddMenuItem,
    goToCreateWaiter,
    triggerAvatarUpload,
    handleFileChange,
    logout
  };
}

