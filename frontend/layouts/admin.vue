<template>
  <div v-if="isAuthorized">
    <header>
      <!-- Header content -->
    </header>
    <main>
      <div class="admin-content">
        <section class="admin-content-l">
          <Adminsidebar />
        </section>
        <section class="admin-content-r">
          <slot />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const isAuthorized = ref(false)

onMounted(() => {
  // scroll to top
  window.scrollTo(0, 0)

  // check token from localStorage
  const token = localStorage.getItem('adminToken')
  if (!token) {
    router.push('/backend/login')
    return
  }

  try {
    const decoded: { exp: number; role: string } = jwtDecode(token)
    
    // ตรวจสอบหมดอายุ
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('adminToken')
      router.push('/backend/login')
      return
    }

    // ตรวจสอบ role
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      router.push('/backend/login')
      return
    }

    isAuthorized.value = true
  } catch (error) {
    localStorage.removeItem('adminToken')
    router.push('/backend/login')
  }
})
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