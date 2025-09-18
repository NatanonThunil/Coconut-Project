<template>
  <div class="expert-page-container">
  <div style="height: 8rem"></div>

  <div class="faqs-path">
    <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale> /
    <NuxtLinkLocale to="/experts">{{ $t('Experts') }}</NuxtLinkLocale>
  </div>

   <h1 class="context-header">{{ $t('Experts') }}</h1>
  <div style="height: 5rem;"></div>

  <!-- Search bar -->
  <label class="coconut-v-input">
    <img src="/icon/search.svg" alt="Search Icon" />
    <input type="text" placeholder="ค้นหาด้วยชื่อหรือแท็ก..." v-model="searchQuery" aria-label="Search experts" />
  </label>

  <div style="height: 1rem"></div>

  <!-- Filter options -->
  <ul class="homeeventfiltercontainer">
    <li class="filtli" :class="{ selecto: selectedFilter === 'all' }" @click="selectedFilter = 'all'">
      {{ $t('All') }}
    </li>
    <li class="filtli" :class="{ selecto: selectedFilter === 'farmer' }" @click="selectedFilter = 'farmer'">
      {{ $t('Farmer') }}
    </li>
    <li class="filtli" :class="{ selecto: selectedFilter === 'private' }" @click="selectedFilter = 'private'">
      {{ $t('Private') }}
    </li>
    <li class="filtli" :class="{ selecto: selectedFilter === 'academic' }" @click="selectedFilter = 'academic'">
      {{ $t('Academic') }}
    </li>
  </ul>

  <!-- Loading -->
  <div class="event-card-section" v-if="isLoading">
    <div style="display: flex; gap: 1rem; flex-wrap: wrap">
      <div v-for="n in 8" :key="n" class="skeleton-card" />
    </div>
  </div>

  <!-- Results -->
  <div class="event-card-section" v-else-if="filteredExperts.length">
    <ExpertCard v-for="expert in filteredExperts" :key="expert.id" :id="expert.id" :image="expert.image"
      :name="expert.name" :description="expert.description" :phone-number="expert.phoneNumber" :email="expert.email" @tag-click="onTagClick"/>
  </div>

  <!-- Empty -->
  <div class="no-events" v-else>
    <p>No experts found for the selected criteria.</p>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useExperts } from '~/composables/useExperts'
import { useExpertTags } from '~/composables/useExpertTags'

type ExpertInPage = {
  id: number
  image?: string | null
  name: string
  description?: string | null
  phoneNumber?: string | null
  email?: string | null
  type?: number | null
  status?: 0 | 1 | boolean
  tags: string[] 
  category: 'farmer' | 'private' | 'academic' | 'unknown'
}

const route = useRoute()
const { getExperts } = useExperts()
const { getExpertsByTag } = useExpertTags()

const isLoading = ref(true)
const experts = ref<ExpertInPage[]>([])
const searchQuery = ref('')

const selectedFilter = ref<'all' | 'farmer' | 'private' | 'academic'>('all')
const onTagClick = (tag: string) => {
  searchQuery.value = tag        
  selectedFilter.value = 'all'   
}

const selectedTagRaw = computed<string | null>(() => {
  const q = route.query.tag
  return typeof q === 'string' ? q : Array.isArray(q) ? q[0] : null
})
const selectedTag = computed<string | null>(() =>
  selectedTagRaw.value ? selectedTagRaw.value.trim().toLowerCase() : null
)


const serverFilteredByTag = computed(() => !!selectedTagRaw.value)


const mapCategory = (type?: number | null) => {
  const m: Record<number, 'farmer' | 'private' | 'academic'> = { 1: 'farmer', 2: 'private', 3: 'academic' }
  return type && m[type] ? m[type] : 'unknown'
}
const normalizeTags = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.map(t => String(t).trim().toLowerCase()).filter(Boolean)
  if (typeof raw === 'string') return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
  return []
}


const fetchExperts = async () => {
  try {
    isLoading.value = true

    const data = serverFilteredByTag.value
      ? await getExpertsByTag(selectedTagRaw.value as string)
      : await getExperts()

    experts.value = (data || []).map((e: any) => {
      const tags = normalizeTags(e.tags)

    
      if (serverFilteredByTag.value && selectedTag.value && !tags.includes(selectedTag.value)) {
        tags.push(selectedTag.value)
      }

      return {
        id: e.id,
        image: e.image ?? null,
        name: e.name,
        description: e.description ?? null,
        phoneNumber: e.phoneNumber ?? null,
        email: e.email ?? null,
        type: e.type ?? null,
        status: e.status,
        tags,
        category: mapCategory(e.type ?? null),
      } as ExpertInPage
    })


    if (selectedTag.value) selectedFilter.value = 'all'
  } catch (err) {
    console.error('Error fetching experts:', err)
    experts.value = []
  } finally {
    isLoading.value = false
  }
}


watch(selectedTagRaw, fetchExperts, { immediate: true })


const filteredExperts = computed(() => {
  const q = (searchQuery.value || '').toLowerCase().trim()
  const tag = selectedTag.value
  const cat = selectedFilter.value

  return experts.value.filter((e) => {
    if (!e.status) return false

    const matchesQuery =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.tags.some(t => t.includes(q))  

   
    const matchesTag =
      serverFilteredByTag.value ? true : (!tag || e.tags.includes(tag))

    const matchesCategory =
      cat === 'all' || tag ? true : e.category === cat

    return matchesQuery && matchesTag && matchesCategory
  })
})
</script>




<style scoped>
.expert-page-container{
  min-height: 100dvh;
}

.skeleton-card {
  height: 26rem;
  width: 100%;                 /* เดิม fix 22rem → ให้เต็มช่อง grid */
  border-radius: 12px;
  background: linear-gradient(90deg, #eee, #f6f6f6, #eee);
  background-size: 200% 100%;
  animation: shine 1.2s infinite linear;
}

@keyframes shine {
  0% {
    background-position: 200% 0
  }

  100% {
    background-position: -200% 0
  }
}

.header-container {
  text-align: center;
  margin-top: 0;
  padding-top: 20px;
}

.header-content {
  color: #ffffff;
  margin-left: 2%;
  font-weight: 300;
}

label.coconut-v-input {
  transition: ease-in-out 0.5s;
  display: flex;
  width: 60%;
  height: 3rem;
  outline: 3px solid #4e6d16;
  border-radius: 10px;
  overflow: hidden;
  cursor: text;
  margin: 0 auto;
}

label.coconut-v-input img {
  align-self: center;
  padding-left: .5rem;
  width: 2rem;
  height: 2rem;
}

label.coconut-v-input input {
  all: unset;
  padding: 0 1rem;
  width: 100%;
}

ul.homeeventfiltercontainer {
  margin: 2rem auto;
  list-style: none;
  display: flex;
  justify-content: center;
  gap: .25rem;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, .2);
  outline: solid rgba(0, 0, 0, .2) 4px;
  background: transparent;
  height: 3.5rem;
  width: min(900px, 90%);
  overflow: hidden;
  border-radius: 20px;
}

ul.homeeventfiltercontainer li.filtli {
  flex: 1 1 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 100%;
  transition: all .2s;
  font-size: 20px;
}

ul.homeeventfiltercontainer li.filtli.selecto {
  font-weight: 700;
  background: #c5d944;
  transform: scale(1.03);
}

.event-card-section {
  
   display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); /* การ์ดยืดปรับตามพื้นที่ */
  gap: 1rem;
  width: min(1300px, 90%);
  margin: 0 auto;
  padding: 1rem;
  animation: fadeinbelow 1s;
  align-items: stretch; /* ให้ทุกคอลัมน์สูงเท่ากัน */
}

:deep(.expert-card) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* รูปภาพบนการ์ดไม่ดัน layout แปลก */
:deep(.expert-card .expert-card-image img) {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  display: block;
  border-radius: 0.5rem;
}

.no-events {
  display: flex;
  justify-content: center;
  margin: 4rem;
}

@media (max-width: 1024px) {
  ul.homeeventfiltercontainer li.filtli {
    font-size: 18px;
  }
}
@media (max-width: 640px) {
  .event-card-section {
    grid-template-columns: 1fr; /* หนึ่งคอลัมน์บนจอเล็ก */
  }
}
@keyframes fadeinbelow {
  0% {
    opacity: 0;
    transform: translateY(50px)
  }

  100% {
    opacity: 1;
    transform: translateY(0)
  }
}
</style>
