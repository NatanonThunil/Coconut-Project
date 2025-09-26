<template>
  <div class="be-bg-cl">
    <div class="login-form-container">
      <img src="/logo/CKH-round.ico" draggable="false" alt="Logo" />
      <h2 class="login-title">สร้างบัญชีผู้ดูแล (Admin Only)</h2>
      <p class="login-subtitle">Available for Superadmin only</p>

      <!-- Authorized form -->
      <form v-if="isSuperAdmin" @submit.prevent="onSubmit" class="form-stack">
        <div class="field">
          <label class="label">Name</label>
          <input v-model.trim="name" class="input" placeholder="Optional" />
        </div>

        <div class="field">
          <label class="label">Email</label>
          <input v-model.trim="email" type="email" required class="input" placeholder="you@example.com" />
        </div>

        <div class="field">
          <label class="label">Password</label>
          <input v-model="password" type="password" required class="input" placeholder="Min 8 chars, A-Z, a-z, 0-9" />
          <p class="hint">Must include uppercase, lowercase, and a number.</p>
          <!-- strength meter (เบา ๆ) -->
          <div class="meter">
            <div :style="{ width: strength.width, background: strength.color }"></div>
          </div>
        </div>

        <p v-if="err" class="error-message">{{ err }}</p>

        <button :disabled="loading" class="btn w-full">
          {{ loading ? 'Creating…' : 'Create account' }}
        </button>
      </form>

      <!-- Unauthorized -->
      <div v-else class="unauth">
        <p class="text-red-600">You are not authorized to access this page.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Backend - Create Admin',
  meta: [{ name: 'description', content: 'Create admin account (Superadmin only)' }],
})
definePageMeta({ layout: 'admin-login' })

import { ref, computed, onMounted } from 'vue'
import { useState, useRuntimeConfig, navigateTo } from '#imports'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: number
  email: string
  name: string | null
  role: string
  created_at?: string
}
interface RegisterResponse { user: User }

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

// แถบความแข็งแรง (เล็ก ๆ)
const strength = computed(() => {
  const pw = password.value || ''
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  const widths = ['0%', '25%', '50%', '75%', '100%']
  const colors = ['transparent', '#FCA5A5', '#FCD34D', '#93C5FD', '#86EFAC']
  return { width: widths[score], color: colors[score] }
})

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
    const res = await $fetch<RegisterResponse>(`${useRuntimeConfig().public.apiBase}/auth/register`, {
      baseURL: base,
      method: 'POST',
      credentials: 'include',
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
/* พื้นหลังและการ์ด: ใช้สไตล์เดียวกับหน้า Login */
.be-bg-cl {
  background: linear-gradient(135deg, #6E85B7, #B6E3DB);
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: 'Poppins', sans-serif;
}

.login-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  width: 90%;
  max-width: 480px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, .2);
  animation: fadeIn .6s ease-in-out;
}

.login-form-container img {
  height: 7rem;
  margin-bottom: .6rem;
}

.login-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: .25rem;
  color: #3A506B;
}

.login-subtitle {
  font-size: .95rem;
  color: #7D8597;
  margin-bottom: 1.25rem;
}

/* ฟอร์ม */
.form-stack {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: .4rem;
}

.label {
  font-size: .9rem;
  color: #475569;
}

.input {
  height: 2.8rem;
  width: 100%;
  padding: .8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: all .3s ease;
  background: #fff;
}

.input:focus {
  outline: none;
  border-color: #6E85B7;
  box-shadow: 0 0 5px rgba(110, 133, 183, .5);
}

.hint {
  font-size: .8rem;
  color: #7D8597;
  margin-top: .1rem;
}

/* meter */
.meter {
  width: 100%;
  height: .35rem;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  margin-top: .4rem;
}

.meter>div {
  height: 100%;
  width: 0%;
  transition: width .25s ease;
}

/* ปุ่ม */
.btn {
  height: 3rem;
  background: linear-gradient(135deg, #6E85B7, #B6E3DB);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform .3s ease, background .3s ease, opacity .2s ease;
}

.btn:hover {
  background: linear-gradient(135deg, #5C72A6, #A5D6C8);
  transform: scale(1.02);
}

.btn:active {
  background: linear-gradient(135deg, #4B607D, #93B8A8);
  transform: scale(.98);
}

.btn[disabled] {
  opacity: .6;
  cursor: not-allowed;
}

/* error + unauthorized */
.error-message {
  color: #dc2626;
  font-size: .9rem;
  text-align: center;
}

.unauth {
  width: 100%;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px) scale(.98)
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1)
  }
}

@media (max-width: 768px) {
  .login-form-container {
    width: 95%
  }

  .login-form-container img {
    height: 5.5rem
  }

  .login-title {
    font-size: 1.4rem
  }

  .login-subtitle {
    font-size: .9rem
  }
}
</style>
