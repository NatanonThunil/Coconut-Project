<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const signUp = async () => {
  try {
    await $fetch('/api/signupAdmin', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    });
    router.push('/backend/login');
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div>
    <h2>Admin Sign Up</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="signUp">Register</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>
