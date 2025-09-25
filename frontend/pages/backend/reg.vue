<template>
  <div class="container" style="max-width: 420px; margin: 4rem auto;">
    <h1 class="text-2xl font-bold mb-6">Create a new account (Admin only)</h1>

    <form @submit.prevent="onSubmit" class="space-y-4" v-if="isSuperAdmin">
      <div>
        <label class="block text-sm mb-1">Name</label>
        <input v-model.trim="name" class="input" placeholder="Optional" />
      </div>

      <div>
        <label class="block text-sm mb-1">Email</label>
        <input v-model.trim="email" type="email" required class="input" placeholder="you@example.com" />
      </div>

      <div>
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          required
          class="input"
          placeholder="Min 8 chars, A-Z, a-z, 0-9"
        />
        <p class="text-xs opacity-70 mt-1">Must include uppercase, lowercase, and a number.</p>
      </div>

      <p v-if="err" class="text-sm text-red-600">{{ err }}</p>

      <button :disabled="loading" class="btn w-full">
        <span v-if="!loading">Create account</span>
        <span v-else>Creating…</span>
      </button>
    </form>

    <p v-else class="text-center text-red-600 mt-6">
      You are not authorized to access this page.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useState, useRuntimeConfig, navigateTo } from '#imports'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: number
  email: string
  name: string | null
  role: string
  created_at?: string
}

interface RegisterResponse {
  user: User
}

const name = ref('')
const email = ref('')
const password = ref('')
const err = ref<string | null>(null)
const loading = ref(false)
const isSuperAdmin = ref(false)

const config = useRuntimeConfig()
const base = config.public.beUrl // e.g., http://localhost:5100

function validatePassword(pw: string) {
  return /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 8
}

// --- check superadmin on mount ---
onMounted(() => {
  const token = localStorage.getItem('adminToken')
  if (!token) return navigateTo('/backend/login')

  try {
    const decoded: { role: string; exp: number } = jwtDecode(token)
    if (decoded.role !== 'superadmin' || (decoded.exp && decoded.exp * 1000 < Date.now())) {
      navigateTo('/backend/dashboard')
      return
    }
    isSuperAdmin.value = true
  } catch {
    navigateTo('/backend/login')
  }
})

const onSubmit = async () => {
  err.value = null

  if (!validatePassword(password.value)) {
    err.value = 'Password must be at least 8 chars and include uppercase, lowercase, and a number.'
    return
  }

  loading.value = true
  try {
    const res = await $fetch<RegisterResponse>('/auth/register', {
      baseURL: base,
      method: 'POST',
      credentials: 'include', // receive auth cookies
      body: {
        name: name.value || null,
        email: email.value,
        password: password.value,
        role: 'admin' // superadmin can create admin
      }
    })

    // Save user globally
    const user = useState<User | null>('auth_user', () => null)
    user.value = res.user

    await navigateTo('/backend/dashboard')
  } catch (e: any) {
    err.value = e?.data?.message || e?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: .5rem;
  padding: .65rem .8rem;
  background: var(--bg, #fff);
}
.btn {
  border: 0;
  border-radius: .6rem;
  padding: .7rem 1rem;
  font-weight: 600;
  background: #111827;
  color: white;
  cursor: pointer;
}
.btn[disabled] { opacity: .6; cursor: not-allowed; }
</style>
