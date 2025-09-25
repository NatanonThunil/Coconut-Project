<template>
  <div style="height: 5rem;"></div>
  <div class="dash-wrap">

    <div class="dash-title-container">
      <div class="dash-title">
        <h1>ยินดีต้อนรับ </h1>
      
        <h1 class="green">{{ userName }}</h1>

      </div>

      <div>

        <button @click="logout"
          style="padding: 0.5rem 1rem; background-color: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
          ออกจากระบบ
        </button>
      </div>

    </div>
    <div class="chart-container">
      <DashDonutChart :counts="statsData || {}" :generated-at="statsData?.generated_at ?? null"
        :include="['news', 'events', 'coconuts', 'experts', 'pests', 'services', 'achievements', 'tags', 'members', 'employees', 'faqs', 'chain_values']"
        :top-n="6" />

    </div>
    <div class="dash-quickaccess">
      <h2 class="dash-section">Quick access</h2>
    </div>
    <div class="dash-quickaccess">
      <h2 class="dash-section">ทั้งหมด</h2>
    </div>
    <div class="dash-card-container">
      <dash-card v-for="c in cards" :key="c.key" :link="c.link" :title="c.title" :count="c.count" :icon="c.icon" />
    </div>



  </div>
 <div style="height: 5rem;"></div>
</template>

<script setup lang="ts">
import DashDonutChart from '~/components/dashDonutChart.vue';

definePageMeta({ auth: true, layout: 'admin' })

interface MeResponse {
  user: { id: number; email: string; name: string | null; created_at: string }
}
type StatsOverview = Record<string, number> & { generated_at?: string }

const base = useRuntimeConfig().public.beUrl

// ✅ กำหนดการ์ดที่อยากโชว์ + map ไปยังคีย์ของ /stats/overview
const cardsConfig = [
  { key: 'news', title: 'ข่าวสารทั้งหมด', link: '/backend/news', icon: '/icon/newsnevents.svg' },
  { key: 'events', title: 'กิจกรรมทั้งหมด', link: '/backend/events', icon: '/icon/calendar.svg' },
  { key: 'coconuts', title: 'มะพร้าวทั้งหมด', link: '/backend/coconuts', icon: '/icon/coconut.svg' },

  { key: 'experts', title: 'ผู้เชี่ยวชาญ', link: '/backend/experts', icon: '/icon/expert.svg' },
  { key: 'pests', title: 'ศัตรูพืช', link: '/backend/pests', icon: '/icon/bug.svg' },
  { key: 'services', title: 'บริการ', link: '/backend/services', icon: '/icon/service.svg' },
  { key: 'achievements', title: 'ผลงาน/ความสำเร็จ', link: '/backend/achievements', icon: '/icon/trophy.svg' },
  { key: 'tags', title: 'แท็กทั้งหมด', link: '/backend/tags', icon: '/icon/tag.svg' },
  { key: 'members', title: 'สมาชิก', link: '/backend/members', icon: '/icon/users.svg' },
  { key: 'employees', title: 'พนักงาน', link: '/backend/employees', icon: '/icon/users.svg' },
  { key: 'faqs', title: 'คำถามที่พบบ่อย', link: '/backend/faqs', icon: '/icon/help.svg' },
  { key: 'chain_values', title: 'ห่วงโซ่มูลค่า', link: '/backend/chain-values', icon: '/icon/chain.svg' },

]

// ส่ง only=... เพื่อลดข้อมูลที่ backend ต้องรวม
const onlyKeys = cardsConfig.map(c => c.key).join(',')

const { data: statsData, error: statsError } = await useFetch<StatsOverview>('/stats/overview', {
  baseURL: base,
  credentials: 'include',
  headers: process.server ? useRequestHeaders(['cookie']) : undefined,
  query: { only: onlyKeys },
})

// รวม count ใส่การ์ด (ถ้า key ไหนไม่มี ให้เป็น 0)
const cards = computed(() =>
  cardsConfig.map(c => ({
    ...c,
    count: Number((statsData.value?.[c.key] as number) ?? 0),
  }))
)

// ---------- Me (show name/email) ----------
const { data, error } = await useFetch<MeResponse>('/auth/me', {
  baseURL: base,
  credentials: 'include',
  headers: process.server ? useRequestHeaders(['cookie']) : undefined,
})
if (error.value) {
  await navigateTo('/backend/login?next=' + encodeURIComponent('/backend/dashboard'))
}
const userName = computed(() => data.value?.user?.name || 'User')

// ---------- Logout ----------
const logout = async () => {
  try {
    await $fetch('/auth/logout', { baseURL: base, method: 'POST', credentials: 'include' })
    const user = useState<MeResponse['user'] | null>('auth_user', () => null)
    user.value = null
    await navigateTo('/backend/login')
  } catch (e) {
    console.error('Logout failed:', e)
  }
}
</script>





<style scoped>
.dash-section {

  margin: 1rem 0;
}

.dash-wrap {
  min-height: 100vh;
  width: 85%;
  margin: 0 auto;
}

/* Header: 2 cols on desktop, stack on mobile */
.dash-title-container {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.dash-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: .5rem;
  margin: 0;
  /* remove extra gap, handled by container */
}

.green {
  color: #4e6d16;
}

/* Cards: responsive grid */
.dash-card-container {
  display: grid;
  gap: 1rem;
  /* 1–4 columns automatically, no weird spacing */
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: stretch;
}

/* ——— Breakpoints ——— */
@media (max-width: 768px) {
  .dash-title-container {
    grid-template-columns: 1fr;
    /* stack title + button */
  }

  .dash-title-container button {
    justify-self: start;
  }

  .dash-wrap {
    width: 92%;
  }
}

@media (min-width: 1280px) {
  .dash-card-container {
    /* allow more columns on very wide screens if needed */
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
  }
}
</style>
