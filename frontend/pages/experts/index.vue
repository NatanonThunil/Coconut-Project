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
      <input type="text" :placeholder="locale === 'th' ? 'ค้นหาด้วยชื่อหรือแท็ก...' : 'Search by Expert name or Tag'" v-model="searchQuery" aria-label="Search experts" />
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
      <ExpertCard v-for="expert in paginatedExperts" :key="expert.id" :id="expert.id" :image="expert.image"
        :name="locale === 'th' ? expert.name : expert.name_en"
        :description="locale === 'th' ? expert.description : expert.description_en" :phone-number="expert.phoneNumber"
        :email="expert.email" @tag-click="onTagClick" />
    </div>

    <!-- Empty -->
    <div class="no-events" v-else>
      <p>No experts found for the selected criteria.</p>
    </div>
  </div>

  <!-- Pagination -->
  <div class="pagination" v-if="filteredExperts.length">
    <div class="pagination-line"></div>
    <div class="pagination-controller">
      <button @click="changePage('prev')" :disabled="currentPage === 1">
        {{ locale === 'th' ? 'กลับ' : 'Back' }}
      </button>

      <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages"
        class="page-input" />
      <span style="display: flex; align-self: center;">
        {{ locale === 'th' ? 'จาก' : 'of' }} {{ totalPages }}
      </span>

      <button @click="changePage('next')" :disabled="currentPage === totalPages">
        {{ locale === 'th' ? 'ถัดไป' : 'Next' }}
      </button>
    </div>
    <div class="pagination-line"></div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useExperts } from '~/composables/useExperts'
import { useExpertTags } from '~/composables/useExpertTags'

type ExpertInPage = {
  id: number
  image?: string | null
  name: string
  name_en: string
  description?: string | null
  description_en?: string | null
  phoneNumber?: string | null
  address?: string | null
  address_en?: string | null
  email?: string | null
  type?: number | null
  status?: 0 | 1 | boolean
  tags: string[]
  category: 'farmer' | 'private' | 'academic' | 'unknown'
}

const { locale } = useI18n()
const route = useRoute()
const { getExperts } = useExperts()
const { getExpertsByTag } = useExpertTags()

/* ---------- state ---------- */
const isLoading = ref(true)
const experts = ref<ExpertInPage[]>([])
const searchQuery = ref('')
const selectedFilter = ref<'all' | 'farmer' | 'private' | 'academic'>('all')

/* ---------- tag click -> fill search ---------- */
const onTagClick = (tag: string) => {
  searchQuery.value = tag
  selectedFilter.value = 'all'
}

/* ---------- route tag (server filtered) ---------- */
const selectedTagRaw = computed<string | null>(() => {
  const q = route.query.tag
  return typeof q === 'string' ? q : Array.isArray(q) ? q[0] : null
})
const selectedTag = computed<string | null>(() =>
  selectedTagRaw.value ? selectedTagRaw.value.trim().toLowerCase() : null
)
const serverFilteredByTag = computed(() => !!selectedTagRaw.value)

/* ---------- helpers ---------- */
const mapCategory = (type?: number | null) => {
  const m: Record<number, 'farmer' | 'private' | 'academic'> = { 1: 'farmer', 2: 'private', 3: 'academic' }
  return type && m[type] ? m[type] : 'unknown'
}
const normalizeTags = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.map(t => String(t).trim().toLowerCase()).filter(Boolean)
  if (typeof raw === 'string') return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
  return []
}

/* ---------- prefill from ?q= or localStorage ---------- */
const prefillFromQuery = computed(() => {
  const q = route.query.q
  return typeof q === 'string' ? q : (Array.isArray(q) ? q[0] : '')
})
watch(prefillFromQuery, (val) => {
  const v = (val || '').trim()
  if (v) {
    searchQuery.value = v
    selectedFilter.value = 'all'
  }
}, { immediate: true })
onMounted(() => {
  if (!searchQuery.value && process.client) {
    try {
      const saved = localStorage.getItem('experts:prefill')
      if (saved && saved.trim()) {
        searchQuery.value = saved.trim()
        selectedFilter.value = 'all'
      }
      localStorage.removeItem('experts:prefill')
    } catch {}
  }
})

/* ---------- fetch ---------- */
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
        id: Number(e.id),
        image: e.image ?? null,

        // bilingual with fallback
        name: e.name ?? '',
        name_en: e.name_en ?? e.name ?? '',

        description: e.description ?? null,
        description_en: e.description_en ?? e.description ?? null,

        address: e.address ?? null,
        address_en: e.address_en ?? e.address ?? null,

        phoneNumber: e.phoneNumber ?? null,
        email: e.email ?? null,
        type: e.type ?? null,
        status: e.status ?? 1,
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

/* ---------- filter (MUST be before pagination) ---------- */
const filteredExperts = computed(() => {
  const q = (searchQuery.value || '').toLowerCase().trim()
  const tag = selectedTag.value
  const cat = selectedFilter.value

  return experts.value.filter((e) => {
    if (!e.status) return false

    const nameText = `${e.name ?? ''} ${e.name_en ?? ''}`.toLowerCase()
    const matchesQuery = !q || nameText.includes(q) || e.tags.some(t => t.includes(q))
    const matchesTag = serverFilteredByTag.value ? true : (!tag || e.tags.includes(tag))
    const matchesCategory = (cat === 'all' || tag) ? true : e.category === cat

    return matchesQuery && matchesTag && matchesCategory
  })
})

/* ---------- pagination (AFTER filteredExperts) ---------- */
const currentPage = ref(1)
const itemsPerPage = ref(32)
const pageInput = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredExperts.value.length / itemsPerPage.value))
)

const paginatedExperts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredExperts.value.slice(start, start + itemsPerPage.value)
})

// reset page when results or page size change
watch([filteredExperts, itemsPerPage], () => {
  currentPage.value = 1
  pageInput.value = 1
})

// clamp when total pages shrink
watch(totalPages, (tp) => {
  if (currentPage.value > tp) {
    currentPage.value = tp
    pageInput.value = tp
  }
})

// keep input synced
watch(currentPage, (p) => { pageInput.value = p })

function changePage(direction: 'prev' | 'next') {
  if (direction === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--
  }
  scrollToListTop()
}

function goToPage() {
  if (pageInput.value >= 1 && pageInput.value <= totalPages.value) {
    currentPage.value = pageInput.value
    scrollToListTop()
  } else {
    pageInput.value = currentPage.value
  }
}

function scrollToListTop() {
  if (process.client) {
    const el = document.querySelector('.event-card-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* ---------- expose to template (auto in <script setup>) ---------- */
// locale, paginatedExperts, totalPages, currentPage, pageInput, changePage, goToPage, onTagClick, etc.
</script>





<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #4e6d16;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination .page-input {
  width: 3.25rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.3rem 0.4rem;
  height: 2.25rem;
}

.pagination .pagination-line {
  width: fit-content;
  min-width: 20%;
  height: 4px;
  background-color: #4e6d16;
  border-radius: 9999px;
}

.pagination-controller {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 22rem;
}

.expert-page-container {
  min-height: 100dvh;
}

.skeleton-card {
  height: 26rem;
  width: 100%;
  /* เดิม fix 22rem → ให้เต็มช่อง grid */
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
  font-size: clamp(14px, 2vw, 20px);
}

ul.homeeventfiltercontainer li.filtli.selecto {
  font-weight: 700;
  background: #c5d944;
  transform: scale(1.03);
}

.event-card-section {

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
   justify-content: center;  
  gap: 1rem;
  width: min(1300px, 90%);
  margin: 0 auto;
  padding: 1rem;
  animation: fadeinbelow 1s;
  align-items: stretch;
  /* ให้ทุกคอลัมน์สูงเท่ากัน */
}

:deep(.expert-card) {
  display: flex;
  margin: 0 auto;
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



@media (max-width: 640px) {

  .event-card-section {
    grid-template-columns: 1fr;
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
