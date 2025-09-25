<template>
  <div style="height: 5rem;"></div>
  <div class="dash-wrap">
    <div class="dash-title-container">
      <div class="dash-title">
        <h1>ยินดีต้อนรับ </h1>
        <h1 class="green">{{ userName }}</h1>
      </div>

      <div>
        <button @click="logout" class="btn-logout">
          ออกจากระบบ
        </button>
      </div>
    </div>

    <div class="chart-container">
      <DashDonutChart :counts="statsData || {}" :generated-at="statsData?.generated_at ?? null"
        :include="['news', 'events', 'coconuts', 'experts', 'pests', 'services', 'achievements', 'tags', 'members', 'employees', 'faqs', 'chain_values']"
        :top-n="6" />
    </div>

    <!-- ✅ QUICK ACCESS -->
    <div class="dash-quickaccess">
      <h2 class="dash-section">ใช้บ่อย</h2>

      <div v-if="quickCards.length" class="dash-card-container quick-access">
        <dash-card v-for="q in quickCards" :key="q.key" :link="q.link" :title="q.title" :count="q.count" :icon="q.icon"
          @clicked="onCardClicked(q)" />
      </div>
      <p v-else style="opacity:.7;margin:.25rem 0 1rem">
        ยังไม่มีประวัติการเข้าถึงบ่อย — ลองคลิกการ์ดในส่วน “ทั้งหมด” ด้านล่าง
      </p>
    </div>

    <div class="dash-quickaccess">
      <h2 class="dash-section">ทั้งหมด</h2>
    </div>

    <div class="dash-card-container">
      <dash-card v-for="c in cards" :key="c.key" :link="c.link" :title="c.title" :count="c.count" :icon="c.icon"
        @clicked="onCardClicked(c)" />
    </div>
  </div>
  <div style="height: 5rem;"></div>
</template>

<script setup lang="ts">
const apibases = useRuntimeConfig().public.apiBase
import DashDonutChart from '~/components/dashDonutChart.vue'
import { useState, useRuntimeConfig, navigateTo } from '#imports'

definePageMeta({ auth: true, layout: 'admin' })

interface MeResponse {
  user: { id: number; email: string; name: string | null; created_at: string }
}
type StatsOverview = Record<string, number> & { generated_at?: string }

const base = useRuntimeConfig().public.beUrl


const cardsConfig = [
  { key: 'news', title: 'ข่าวสารทั้งหมด', link: '/backend/news', icon: '/icon/newsnevents.svg' },
  { key: 'events', title: 'กิจกรรมทั้งหมด', link: '/backend/events', icon: '/icon/event.png' },
  { key: 'coconuts', title: 'มะพร้าวทั้งหมด', link: '/backend/coconuts', icon: '/icon/coconuti.png' },
  { key: 'experts', title: 'ผู้เชี่ยวชาญ', link: '/backend/experts', icon: '/icon/expert.svg' },
  { key: 'pests', title: 'ศัตรูพืช', link: '/backend/pests', icon: '/icon/bugs.png' },
  { key: 'services', title: 'บริการ', link: '/backend/services', icon: '/icon/customer-support.png' },
  { key: 'achievements', title: 'ผลงาน/ความสำเร็จ', link: '/backend/achievements', icon: '/icon/medal-.png' },
  { key: 'tags', title: 'แท็กทั้งหมด', link: '/backend/tags', icon: '/icon/price-tag.png' },
  { key: 'members', title: 'สมาชิก', link: '/backend/members', icon: '/icon/employee.png' },
  { key: 'employees', title: 'พนักงาน', link: '/backend/employees', icon: '/icon/team.png' },
  { key: 'faqs', title: 'คำถามที่พบบ่อย', link: '/backend/faqs', icon: '/icon/help.png' },
  { key: 'chain_values', title: 'ห่วงโซ่มูลค่า', link: '/backend/chain-values', icon: '/icon/value-chain.png' },
]


const cardMetaMap = Object.fromEntries(cardsConfig.map(c => [c.key, c]))


const onlyKeys = cardsConfig.map(c => c.key).join(',')

const { data: statsData } = await useFetch<StatsOverview>(`${apibases}/stats/overview`, {
  baseURL: base,
  credentials: 'include',
  headers: process.server ? useRequestHeaders(['cookie']) : undefined,
  query: { only: onlyKeys },
})

const cards = computed(() =>
  cardsConfig.map(c => ({ ...c, count: Number(statsData.value?.[c.key] ?? 0) }))
)


const { data, error } = await useFetch<MeResponse>(`${apibases}/auth/me`, {
  baseURL: base,
  credentials: 'include',
  headers: process.server ? useRequestHeaders(['cookie']) : undefined,
})
if (error.value || !data.value?.user) {
  await navigateTo('/backend/login')
}


const userData = computed(() => data.value?.user ?? { name: '', email: '', id: 0, created_at: '' })
const userName = computed(() => userData.value.name || userData.value.email || 'User')


const authHeader = computed(() => {
  if (!process.client) return {}
  const t = localStorage.getItem('adminToken')
  return t ? { Authorization: `Bearer ${t}` } : {}
})
const hasToken = computed(() => process.client && !!localStorage.getItem('adminToken'))


const trackQuick = async (meta: { key: string; title?: string; link?: string; icon?: string }) => {
  try {
    if (!hasToken.value) return
    await $fetch(`${apibases}/quick-access/track`, {
      baseURL: base,
      method: 'POST',
      body: meta,
      headers: authHeader.value,
    })
  } catch (e) {
    console.error('[QuickAccess] track failed', e)
  }
}

const { data: quickTopRes } = await useAsyncData(
  'quick-top',
  async () => {
    try {
      if (!hasToken.value) return { items: [] }
      return await $fetch<{ items: any[] }>(`${apibases}/quick-access/top`, {
        baseURL: base,
        query: { limit: 4 },
        headers: authHeader.value,
      })
    } catch (e) {
      console.error('[QuickAccess] fetchTop failed', e)
      return { items: [] }
    }
  },
  { server: false }
)


const quickCards = computed(() => {
  const items = quickTopRes.value?.items ?? []
  return items.map((it) => {
    const meta = cardMetaMap[it.key]
    return {
      key: it.key,
      title: meta.title,
      link: meta.link,
      icon: meta.icon,
      count: Number(statsData.value?.[it.key] ?? 0),
      click_count: it.click_count ?? 0,
    }
  })
})



const onCardClicked = (c: { key: string; title?: string; link?: string; icon?: string }) => {
  trackQuick({ key: c.key, title: c.title, link: c.link, icon: c.icon })
}


const logout = async () => {
  try {
    await $fetch(`${apibases}/auth/logout`, { baseURL: base, method: 'POST', credentials: 'include' })
    const user = useState<MeResponse['user'] | null>('auth_user', () => null)
    user.value = null
    await navigateTo('/backend/login')
  } catch (e) {
    console.error('Logout failed:', e)
  }
}
</script>

<style scoped>
.btn-logout {
  background-color: #ffffff;
  color: rgb(255, 0, 0);
  font-weight: medium;
  font-size: larger;
  outline: red 2px solid;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-logout:hover {
  background-color: #ff0000;
  color: white;
  transform: scale(1.05);
}
.quick-access {
  margin: 0;
  background-color: #4e6d16;
  padding: 1rem;
  border-radius: 8px;
}

.dash-section {
  margin: 1rem 0;
}

.dash-wrap {
  min-height: 100vh;
  width: 85%;
  margin: 0 auto;
}

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
}

.green {
  color: #4e6d16;
}

.dash-card-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: stretch;
}

@media (max-width: 768px) {
  .dash-title-container {
    grid-template-columns: 1fr;
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
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
  }
}
</style>
