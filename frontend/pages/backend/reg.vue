<template>
  <div class="container" style="max-width: 420px; margin: 4rem auto;">
    <h1 class="text-2xl font-bold mb-6">Create your account</h1>

    <form @submit.prevent="onSubmit" class="space-y-4">
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

    <p class="mt-4 text-sm">
      Already have an account?
      <NuxtLink to="/login" class="underline">Log in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useState, useRuntimeConfig, navigateTo } from '#imports'

interface User {
  id: number
  email: string
  name: string | null
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

const config = useRuntimeConfig()
const base = config.public.beUrl // e.g., http://localhost:5100

function validatePassword(pw: string) {
  return /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 8
}

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
        password: password.value
      }
    })

    // Save user globally
    const user = useState<User | null>('auth_user', () => null)
    user.value = res.user

    await navigateTo('/dashboard')
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
