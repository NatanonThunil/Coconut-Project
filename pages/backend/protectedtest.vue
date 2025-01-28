
<template></template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();
const adminEmail = ref('');

onMounted(() => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      adminEmail.value = decodedToken.email;
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
  } else {
    logout();
  }
});

const logout = () => {
  localStorage.removeItem('adminToken');
  router.push('/backend/login');
};
</script>