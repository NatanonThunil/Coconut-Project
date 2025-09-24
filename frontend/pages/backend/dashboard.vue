<script setup lang="ts">
definePageMeta({ auth: true, layout: 'admin' })

interface MeResponse {
  user: { id: number; email: string; name: string | null; created_at: string }
}

const base = useRuntimeConfig().public.beUrl

// Fetch user info
const { data, error } = await useFetch<MeResponse>('/auth/me', {
  baseURL: base,
  credentials: 'include',
})

if (error.value) {
  await navigateTo('/backend/login?next=' + encodeURIComponent('/backend/dashboard'))
}

const userName = computed(() => data.value?.user?.name || data.value?.user?.email || 'User')

// Demo stats
const stats = ref([
  { label: 'News', value: 128 },
  { label: 'Events', value: 23 },
  { label: 'Experts', value: 57 },
  { label: 'Employees', value: 41 },
])

// Actions
const actions = [
  { label: 'Create News', to: '/backend/news/create' },
  { label: 'Add Event', to: '/backend/events/create' },
  { label: 'New Expert', to: '/backend/experts/create' },
  { label: 'Upload PDF', to: '/backend/uploads' },
]

// Logout
const logout = async () => {
  try {
    await $fetch('/auth/logout', { baseURL: base, method: 'POST', credentials: 'include' })
    const user = useState<MeResponse['user'] | null>('auth_user', () => null)
    user.value = null
    await navigateTo('/backend/login') // ✅ redirect to login
  } catch (e) {
    console.error('Logout failed:', e)
  }
}
</script>

<template>
  <div class="dash-wrap">
    <header class="hero">
      <h1>Welcome back, <span class="accent">{{ userName }}</span> 👋</h1>
      <button class="btn danger" @click="logout">Logout</button>
    </header>

    <section class="grid stats">
      <div v-for="s in stats" :key="s.label" class="card stat">
        <div class="stat-value">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </section>

    <section class="grid actions">
      <NuxtLink v-for="a in actions" :key="a.label" :to="a.to" class="action">
        {{ a.label }}
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.dash-wrap {
  min-height: 100vh;
  padding: 2rem;
  background: #0f172a;
  color: #e5e7eb;
}

/* Header */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.hero .accent {
  color: #a78bfa;
}

/* Stats */
.grid.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card.stat {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  color: #9ca3af;
  font-size: 0.9rem;
}

/* Actions */
.grid.actions {
  display: grid;
  gap: 1rem;
}

.action {
  display: block;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.action:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Buttons */
.btn {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn.danger {
  background: rgba(239, 68, 68, .8);
  border: none;
  color: white;
}
</style>
