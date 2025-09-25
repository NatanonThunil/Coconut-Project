<template>
  <div v-if="isAuthorized">
    <header><!-- Header content --></header>
    <main>
      <div class="admin-content">
        <section class="admin-content-l"><Adminsidebar /></section>
        <section class="admin-content-r"><slot /></section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MeResponse {
  user: { id: number; email: string; name: string | null; role: string; created_at: string }
}

const config = useRuntimeConfig()
const base = config.public.beUrl
const route = useRoute()
const baseapi = config.public.apiBase
// Optional: restrict roles here (or remove if not needed)
const allowedRoles = ['admin', 'superadmin'] as const

// Fetch user using httpOnly cookies (works on SSR & client)
const { data, error } = await useFetch<MeResponse>(`${baseapi}/auth/me`, {
  baseURL: base,
  credentials: 'include',
  headers: process.server ? useRequestHeaders(['cookie']) : undefined,
})

// Derive auth state
const user = computed(() => data.value?.user ?? null)
const isAuthorized = computed(() => {
  if (!user.value) return false
  return allowedRoles.includes(user.value.role as (typeof allowedRoles)[number])
})

// Redirect if not authorized
if (error.value || !isAuthorized.value) {
  await navigateTo('/backend/login?next=' + encodeURIComponent(route.fullPath))
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