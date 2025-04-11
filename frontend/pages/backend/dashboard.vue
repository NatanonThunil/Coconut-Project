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

<template>
  <div class="dashboard-container">
    <h2>Admin Dashboard</h2>
    <p>Welcome, {{ adminEmail || 'Administrator' }}!</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<style scoped>
.dashboard-container {
  text-align: center;
  padding: 50px;
}
button {
  padding: 10px 20px;
  background: red;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
