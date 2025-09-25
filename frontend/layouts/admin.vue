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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode' // แก้ import ให้ถูกต้อง

interface MeResponse {
  user: { id: number; email: string; name: string | null; role: string; created_at: string }
}

onMounted(() => {
  window.scrollTo(0, 0)

  const token = localStorage.getItem('adminToken')
  if (!token) {
    router.push('/backend/login')
    return
  }

  try {
    // decode token
    const decoded: { exp?: number; role?: string } = jwtDecode(token)

    // ตรวจสอบ expired
    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('adminToken')
      router.push('/backend/login')
      return
    }

    // ตรวจสอบ role
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      localStorage.removeItem('adminToken')
      router.push('/backend/login')
      return
    }

    // token ถูกต้อง
    isAuthorized.value = true
  } catch (err) {
    // decode error, token ไม่ถูกต้อง
    console.error('[AUTH][TOKEN]', err)
    localStorage.removeItem('adminToken')
    router.push('/backend/login')
  }
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