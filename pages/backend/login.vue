<script setup>
useHead({
  title: 'Backend - Login',
  meta: [
    {
      name: 'description',
      content: 'Home page for Coconut Knowledge Hub',
    },
  ],
});
definePageMeta({
  layout: 'adminLogin'
});

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
  console.log('Attempting login...');  

  try {
    const response = await $fetch('/api/loginAdmin', {
      method: 'POST',
      body: { email: email.value.trim(), password: password.value }
    });

    console.log('Response received:', response);  

    if (response.error) {
      errorMessage.value = response.error;
      return;
    }
    localStorage.setItem('adminToken', response.token);


    router.push('/backend/dashboard');
  } catch (error) {
    errorMessage.value = 'รหัสผ่านไม่ถูกต้อง';
    console.error('Login error:', error); 
  } finally {
    isLoading.value = false;
  }
};

const validateInputs = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'กรุณากรอกอีเมลและรหัสผ่านที่ถูกต้อง';
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    errorMessage.value = 'กรุณากรอกอีเมลให้ถูกต้อง';
    return false;
  }
  return true;
};
</script>

<template>
  <div class="be-bg-cl">
    <div class="login-form-container">
      <img src="@/assets/logo/CKH-round.ico" draggable="false" alt="Logo">
      <h2 class="login-title">เข้าสู่ระบบหลังบ้าน</h2>
      <p class="login-subtitle">Please enter your credentials to continue</p>
      <div> <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="login" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.be-bg-cl {
  background: linear-gradient(135deg, #6E85B7, #B6E3DB);
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}


.login-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.6s ease-in-out;
}

.login-form-container img {
  height: 8rem;
  margin-bottom: 1rem;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #3A506B;
}

.login-subtitle {
  font-size: 1rem;
  color: #7D8597;
  margin-bottom: 1.5rem;
}


.login-form-container div {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form-container div input {
  height: 2.8rem;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.login-form-container div input:focus {
  outline: none;
  border-color: #6E85B7;
  box-shadow: 0 0 5px rgba(110, 133, 183, 0.5);
}

/* Button Styles */
.login-form-container div button {
  height: 3rem;
  background: linear-gradient(135deg, #6E85B7, #B6E3DB);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
}

.login-form-container div button:hover {
  background: linear-gradient(135deg, #5C72A6, #A5D6C8);
  transform: scale(1.05);
}

.login-form-container div button:active {
  background: linear-gradient(135deg, #4B607D, #93B8A8);
  transform: scale(0.95);
}

/* Error Message */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-form-container {
    width: 95%;
  }

  .login-form-container img {
    height: 6rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .login-subtitle {
    font-size: 0.9rem;
  }
}
</style>
