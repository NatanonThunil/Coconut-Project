<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const login = async () => {
  errorMessage.value = '';
  
  if (!validateInputs()) return;

  isLoading.value = true;
  console.log('Attempting login...');  // Debugging

  try {
    const response = await $fetch('/api/loginAdmin', {
      method: 'POST',
      body: { email: email.value.trim(), password: password.value }
    });

    console.log('Response received:', response);  // Debugging

    if (response.error) {
      errorMessage.value = response.error;
      return;
    }

    // Store the token securely
    localStorage.setItem('adminToken', response.token);

    // Redirect to Admin Dashboard
    router.push('/backend/dashboard');
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.';
    console.error('Login error:', error);  // Debugging
  } finally {
    isLoading.value = false;
  }
};

const validateInputs = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Email and password are required.';
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    errorMessage.value = 'Enter a valid email address.';
    return false;
  }
  return true;
};
</script>

<template>
  <div class="login-container">
    <h2>Admin Login</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login" :disabled="isLoading">
      {{ isLoading ? 'Logging in...' : 'Login' }}
    </button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
