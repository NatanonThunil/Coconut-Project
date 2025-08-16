<template>
  <Navbar selecto="aboutus" />

  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/aboutus">{{ $t('AboutUs') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/aboutus/achievements">{{ $t('Achievement') }}</NuxtLinkLocale>
  </div>
  <div style="height: 1rem"></div>
  <h1 class="context-header">{{ $t("Achievement") }}</h1>
  <div style="height: 5rem"></div>
  <frontesearch :placeholder="'ค้นหาด้วยชื่องาน...'" v-model:search="searchQuery" />

  <div class="all-filter-container">
    <label class="filter-dropdown" v-for="(filter, key) in filters" :key="key">
      <select v-model="filter.model" class="filter-select" @change="filterEvents">
        <option value="">{{ filter.label }}</option>
        <option v-for="option in filter.options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </label>
  </div>

  <div style="height: 1rem"></div>

  <!-- Achievements Display -->
  <div class="card-achivments-container">
    <Achievemento v-for="achievement in paginatedAchievements" :key="achievement.id"
      :picture="achievement.thumbnail || noimageHandle" 
      :title="achievement.title" 
      :text="achievement.description"
      :url="`/aboutus/achievements/details/${achievement.id}`" 
      color="white" 
      :author="achievement.author" />
  </div>

  <!-- Pagination -->
  <div class="pagination">
    <div class="pagination-line"></div>
    <div class="pagination-controller">
      <button @click="changePage('prev')" :disabled="currentPage === 1">กลับ</button>
      <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages"
        class="page-input" />
      <span style="display: flex; align-self: center">จาก {{ totalPages }}</span>
      <button @click="changePage('next')" :disabled="currentPage === totalPages">ถัดไป</button>
    </div>
    <div class="pagination-line"></div>
  </div>

  <div style="height: 5rem"></div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).href

import noimageHandle from '/img/no-image-handle.png'
import { useAchievements } from '~/composables/useAchievements'
const { getAchievements } = useAchievements()

const Achievements = ref([])
const searchQuery = ref("")
const currentPage = ref(1)
const itemsPerPage = ref(10)
const pageInput = ref(1)
const loading = ref(true)
const filters = ref([
  {
    label: 'Sort By',
    model: 'newest',
    options: [
      { value: 'newest', text: 'Newest' },
      { value: 'oldest', text: 'Oldest' },
    ],
  },
])

// ---- PDF Thumbnail Generation ----
const generateThumbnail = async (pdfUrl) => {
  if (!pdfUrl) return 'https://placehold.co/600x400'
  try {
    // Ensure it runs only on client
    if (process.client) {
      console.log('Generating thumbnail for:', pdfUrl)
      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      const pdf = await loadingTask.promise
      if (!pdf.numPages) throw new Error('PDF has no pages')
      const page = await pdf.getPage(1)
      const scale = 1.5
      const viewport = page.getViewport({ scale })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Cannot get canvas context')
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: context, viewport }).promise
      return canvas.toDataURL()
    }
  } catch (err) {
    console.error('PDF thumbnail error:', pdfUrl, err.message)
    return 'https://placehold.co/600x400'
  }
  return 'https://placehold.co/600x400'
}

// ---- Fetch Achievements ----
const fetchAchievements = async () => {
  loading.value = true
  try {
    const raw = await getAchievements()
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.achievements) ? raw.achievements : []
    const filtered = list.filter(a => a.status === 1)
    Achievements.value = await Promise.all(
      filtered.map(async a => {
        a.thumbnail = await generateThumbnail(a.pdf)
        return a
      })
    )
  } catch (err) {
    console.error('Error fetching achievements:', err)
    Achievements.value = []
  } finally {
    loading.value = false
  }
}

// ---- Filtering / Pagination ----
watch(searchQuery, () => { currentPage.value = 1 })

const filteredAchievements = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return Achievements.value.filter(a => a.title?.toLowerCase().includes(query))
})

const filterEvents = () => {
  const sortBy = filters.value.find(f => f.label === 'Sort By').model
  let list = filteredAchievements.value
  if (sortBy === 'newest') list = list.sort((a, b) => b.id - a.id)
  else if (sortBy === 'oldest') list = list.sort((a, b) => a.id - b.id)
  return list
}

const totalPages = computed(() => Math.max(1, Math.ceil(filterEvents().length / itemsPerPage.value)))
const paginatedAchievements = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filterEvents().slice(start, start + itemsPerPage.value)
})
const changePage = dir => {
  if (dir === 'next' && currentPage.value < totalPages.value) currentPage.value++
  else if (dir === 'prev' && currentPage.value > 1) currentPage.value--
}
const goToPage = () => {
  if (pageInput.value >= 1 && pageInput.value <= totalPages.value) currentPage.value = pageInput.value
  else pageInput.value = currentPage.value
}

// ---- On Mounted ----
onMounted(fetchAchievements)
</script>


<style scoped>
.filter-dropdown {
  width: 100%;
}

.filter-select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.all-filter-container {
  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}

.card-achivments-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  justify-content: center;
  gap: 1rem;
  margin: 0% 10%;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #4e6d16;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination .page-input {
  width: 3rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.3rem;
}

.pagination .pagination-line {
  width: fit-content;
  min-width: 20%;
  height: 4px;
  background-color: #4e6d16;
}

.pagination-controller {
  justify-content: center;
  display: flex;
  justify-content: space-around;
  width: 20rem;
}
</style>
