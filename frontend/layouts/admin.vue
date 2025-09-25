<template>
  <div class="be-bg-cl">
    <div class="login-form-container">
      <img src="/logo/CKH-round.ico" draggable="false" alt="Logo" />
      <h2 class="login-title">เข้าสู่ระบบหลังบ้าน</h2>
      <p class="login-subtitle">Please enter your credentials to continue</p>

      <div class="space-y-3">
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          @keyup.enter="login"
          class="input"
        />
        <button @click="login" :disabled="isLoading" class="btn w-full">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </div>

      <p v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Backend - Login',
  meta: [{ name: 'description', content: 'Home page for Coconut Knowledge Hub' }],
})
definePageMeta({ layout: 'admin-login' })

import { ref } from 'vue'
import { useRouter, useState, useRuntimeConfig } from '#imports'

interface User {
  id: number
  email: string
  name: string | null
  role: string
  created_at?: string
}

interface LoginResponse {
  user: User
  accessToken?: string
}

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const base = useRuntimeConfig().public.beUrl // e.g., http://localhost:5100

const validateInputs = (): boolean => {
  if (!email.value || !password.value) {
    errorMessage.value = 'กรุณากรอกอีเมลและรหัสผ่าน'
    return false
  }
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    errorMessage.value = 'กรุณากรอกอีเมลให้ถูกต้อง'
    return false
  }
  return true
}

const login = async () => {
  errorMessage.value = ''
  if (!validateInputs()) return

  isLoading.value = true
  try {
    const res = await $fetch<LoginResponse>('/auth/login', {
      baseURL: base,
      method: 'POST',
      credentials: 'include', // สำคัญ ต้องส่ง cookie
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: email.value.trim(),
        password: password.value,
      },
    })

    // Save user globally
    const userState = useState<User | null>('auth_user', () => null)
    userState.value = res.user

    // Save JWT locally (optional)
    if (res.accessToken) {
      localStorage.setItem('adminToken', res.accessToken)
    }

    await router.push('/backend/dashboard')
  } catch (e: any) {
    console.error('Login error:', e)
    if (e?.status === 401 || e?.data?.message === 'Invalid email or password') {
      errorMessage.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    } else {
      errorMessage.value =
        e?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.admin-content {
  display: flex;
  height: 100dvh;

}

.admin-content-l {

  display: flex;
  flex-direction: row;

}

.admin-content-r {
  width: 100%;

}
</style>