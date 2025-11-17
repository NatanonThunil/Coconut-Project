<template>
  <div>
    <div style="height: 8rem"></div>

    <breadcrumb />
    <h1 class="context-header">{{ $t("News") }}</h1>
    <div style="height: 5rem;"></div>

    <frontesearch :placeholder="locale === 'th' ? 'ค้นหาข่าว...' : 'Search news...'" @update:search="onSearch" />

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

    <div style="height: 2rem;"></div>

    <!-- โหมดค้นหา / ใช้ paginatedNews -->
    <div class="aresearching" v-if="isSearching">
      <section class="news-etc-container">
        <section class="news-etc">
          <etcNews v-for="news in paginatedNews" :key="news.id" :url="`/announcements/news/details/${news.id}`"
            :image="news.image || notfound"
            :title="(locale === 'th') ? (news.title || news.title_en) : (news.title_en || news.title)"
            :date="formatDate(news.upload_date) || ''" :isHotnews="news.hot_new" />
        </section>
      </section>
    </div>

    <!-- โหมดปกติ -->
    <div class="notsearching" v-else>
      <div class="hot-news-section">
        <section class="beeg-news">
          <HotBigAllNews v-if="hotNews" :url="`/announcements/news/details/${hotNews.id}`"
            :image="hotNews.image || notfound" :title="hotNews.title || ''"
            :date="formatDate(hotNews.upload_date) || ''" />
          <div v-else style="height:100%">
            <HotBigAllNewsShimmer />
          </div>
        </section>

        <section class="smol-news" v-if="loading">
          <HotSmallAllNewsShimmer />
          <HotSmallAllNewsShimmer />
        </section>
        <section class="smol-news" v-else>
          <HotSmallAllNews v-for="news in smallHotNews" :key="news.id" :url="`/announcements/news/details/${news.id}`"
            :image="news.image || notfound"
            :title="(locale === 'th') ? (news.title || news.title_en) : (news.title_en || news.title)"
            :date="formatDate(news.upload_date) || ''" />
        </section>
      </div>

      <ContentHeader :contexto="$t('othernews')" />

      <section class="news-etc-container">
        <section class="news-etc">
          <etcNews v-for="news in paginatedNews" :key="news.id" :url="`/announcements/news/details/${news.id}`"
            :image="news.image || notfound"
            :title="(locale === 'th') ? (news.title || news.title_en) : (news.title_en || news.title)"
            :date="formatDate(news.upload_date) || ''" :isHotnews="news.hot_new" />
        </section>
      </section>
    </div>

    <!-- 🔹 pagination ใช้กับทั้งสองโหมด เพราะ baseNewsList เปลี่ยนตาม isSearching -->
    <div class="pagination">
  <div class="pagination-line"></div>

  <div class="pagination-controller">
    <button @click="changePage('prev')" :disabled="currentPage === 1">
      กลับ
    </button>

    <input
      type="number"
      v-model.number="pageInput"
      @change="goToPage"
      :min="1"
      :max="totalPages"
      class="page-input"
    />

    <span>จาก {{ totalPages }}</span>

    <button
      @click="changePage('next')"
      :disabled="currentPage === totalPages"
    >
      ถัดไป
    </button>
  </div>

  <div class="pagination-line"></div>
</div>

  </div>
</template>


<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'

import notfound from '/img/News404.png'
import { useI18n } from 'vue-i18n'

const { getNews } = useNews()
const { locale } = useI18n()

/* ---------- state ---------- */
const searchQuery = ref('')
const newsItems = ref([])
const hotNews = ref(null)
const loading = ref(true)
const regularNews = ref([])

/* ---------- ฟิลเตอร์ dropdown ---------- */
const filters = reactive({
  kind: {
    label: computed(() => locale.value === 'th' ? 'ประเภทข่าว' : 'Type'),
    model: '', // '', 'hot', 'regular'
    options: [
      { value: 'hot', text: computed(() => locale.value === 'th' ? 'ข่าวเด่น' : 'Hot news') },
      { value: 'regular', text: computed(() => locale.value === 'th' ? 'ข่าวทั่วไป' : 'News') },
    ],
  },
  sort: {
    label: computed(() => locale.value === 'th' ? 'เรียงลำดับ' : 'Sort'),
    model: 'newest', // 'newest' | 'oldest'
    options: [
      { value: 'newest', text: computed(() => locale.value === 'th' ? 'ใหม่ → เก่า' : 'Newest') },
      { value: 'oldest', text: computed(() => locale.value === 'th' ? 'เก่า → ใหม่' : 'Oldest') },
    ],
  },
})

/* ---------- ควบคุมโหมดผลลัพธ์ ---------- */
const isSearching = computed(() => {
  const hasQuery = (searchQuery.value || '').trim().length > 0
  const usingKind = !!filters.kind.model          // 'hot' | 'regular'
  const usingSort = filters.sort.model !== 'newest' // เปลี่ยนเป็น 'oldest' ถือว่าใช้ฟิลเตอร์
  return hasQuery || usingKind || usingSort
})
/* ---------- ดึงข่าว ---------- */
const fetchNews = async () => {
  loading.value = true
  try {
    const response = await getNews()
    const items = [...(response ?? [])]
      .filter(Boolean)
      .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())

    newsItems.value = items

    const published = items.filter(n => n?.status === 1 || n?.status === true)
    const hotTop3 = published.filter(n => !!n?.hot_new).slice(0, 3)

    hotNews.value = hotTop3[0] || null
    const hotIds = new Set(hotTop3.map(h => h.id))
    regularNews.value = published.filter(n => !hotIds.has(n.id))
  } catch (error) {
    console.error('Error fetching news:', error)
    newsItems.value = []
  } finally {
    loading.value = false
  }
}
onMounted(fetchNews)

/* ---------- รายการ Hot เล็ก (ข้าง HERO) ---------- */
const smallHotNews = computed(() => {
  const publishedHot = newsItems.value.filter(n => (n?.status === 1 || n?.status === true) && !!n?.hot_new)
  publishedHot.sort((a, b) => {
    const da = new Date(a.upload_date).getTime()
    const db = new Date(b.upload_date).getTime()
    return filters.sort.model === 'oldest' ? da - db : db - da
  })
  return publishedHot.filter(n => !hotNews.value || n.id !== hotNews.value.id).slice(0, 2)
})

/* ---------- โหมดผลลัพธ์: ค้นหา + กรอง + เรียง ---------- */
const filteredNews = computed(() => {
  const q = (searchQuery.value || '').toLowerCase().trim()
  let list = newsItems.value.filter(n => n?.status === 1 || n?.status === true)

  if (filters.kind.model === 'hot') list = list.filter(n => !!n.hot_new)
  if (filters.kind.model === 'regular') list = list.filter(n => !n.hot_new)

  if (q) {
    list = list.filter(n => {
      const th = (n.title || '').toLowerCase()
      const en = (n.title_en || '').toLowerCase()
      return th.includes(q) || en.includes(q)
    })
  }

  list.sort((a, b) => {
    const da = new Date(a.upload_date).getTime()
    const db = new Date(b.upload_date).getTime()
    return filters.sort.model === 'oldest' ? da - db : db - da
  })

  return list
})

/* ---------- โหมดปกติ: other news เรียงตาม sort ---------- */
const regularNewsSorted = computed(() => {
  const list = [...regularNews.value]
  list.sort((a, b) => {
    const da = new Date(a.upload_date).getTime()
    const db = new Date(b.upload_date).getTime()
    return filters.sort.model === 'oldest' ? da - db : db - da
  })
  return list
})

/* ---------- handlers ---------- */
function onSearch(val) {
  searchQuery.value = String(val || '')
}
function filterEvents() {
  // no-op; ใช้ computed ข้างบนจัดการแล้ว
}

/* ---------- Pagination ---------- */
const itemsPerPage = ref(30)
const currentPage = ref(1)
const pageInput = ref(1)

// list ที่จะใช้ paginate ตามโหมด (search / ปกติ)
const baseNewsList = computed(() =>
  isSearching.value ? filteredNews.value : regularNewsSorted.value
)

const totalPages = computed(() => {
  if (!baseNewsList.value.length) return 1
  return Math.ceil(baseNewsList.value.length / itemsPerPage.value)
})

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return baseNewsList.value.slice(start, start + itemsPerPage.value)
})

function changePage(direction) {
  if (direction === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--
  }
  pageInput.value = currentPage.value
}

function goToPage() {
  if (!pageInput.value) {
    pageInput.value = currentPage.value
    return
  }
  if (pageInput.value < 1) pageInput.value = 1
  if (pageInput.value > totalPages.value) pageInput.value = totalPages.value
  currentPage.value = pageInput.value
}

// เวลา search / filter เปลี่ยน ให้ reset กลับหน้า 1
watch(
  [
    searchQuery,
    () => filters.kind.model,
    () => filters.sort.model,
  ],
  () => {
    currentPage.value = 1
    pageInput.value = 1
  }
)

</script>

<style scoped>
.filter-select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #4e6d16;
}

.filters-container {
  display: flex;
  justify-content: center;
}

.filter-dropdown {
  width: 100%;
}

.all-filter-container {

  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}

.news-etc-container {
  display: flex;
  width: 80%;
  justify-self: center;
  justify-content: center;
}

.news-etc {
  display: grid;
  /* ช่องกว้างเท่ากัน ยืดหยุ่นตามพื้นที่ */
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  align-items: stretch;
  /* ให้ทุก cell สูงเท่ากันตามแถว */
}

.news-etc>* {
  height: 100%;
}

.hot-news-section .beeg-news {
  padding: 1rem;
  height: 100%;
  width: 70%;
}

.hot-news-section .smol-news {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  height: 100%;
  width: 28%;
  gap: 1rem;
}

.hot-news-section {
  display: flex;
  flex-direction: row;
  justify-self: center;
  background-color: #A6AB82;
  height: 40rem;
  width: 80%;
  border-radius: 10px;
}

h1.context-header {
  text-align: center;
}

.header-content {
  color: #aca8a8;
  margin-left: 2%;
  font-weight: 300;
}

.news-etc :deep(a),
.news-etc :deep(.etc-card),
.news-etc :deep(.card) {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .08);
  text-decoration: none;
  color: inherit;
}

/* ส่วนรูปด้านบน — ล็อกอัตราส่วนให้เท่ากันทุกใบ */
.news-etc :deep(.thumb),
.news-etc :deep(.image),
.news-etc :deep(.cover),
.news-etc :deep(.media),
/* เผื่อกรณีการ์ดมี <img> เป็นลูกคนแรก */
.news-etc :deep(a)>img:first-child {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
  display: block;
}

/* เนื้อหาในตัวการ์ดให้ยืดเติมที่ว่างได้ */
.news-etc :deep(.card-body),
.news-etc :deep(.details),
.news-etc :deep(.content),
/* เผื่อกรณีไม่มี class ใด ๆ */
.news-etc :deep(a)>*:not(img):not(.thumb):not(.image):not(.cover):not(.media) {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: 1rem;
  flex: 1 1 auto;
  /* ยืดกินความสูงที่เหลือ */
}

/* หัวเรื่อง จำกัดบรรทัดกันการ์ดสูงไม่เท่ากัน */
.news-etc :deep(h2),
.news-etc :deep(.title) {
  font-size: clamp(1rem, 2.2vw, 1.125rem);
  line-height: 1.25;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 2 บรรทัดพอ */
  overflow: hidden;
}

/* แถบ meta / วันที่ ดันไปชิดล่างของการ์ด */
.news-etc :deep(.meta),
.news-etc :deep(.footer),
.news-etc :deep(.date),
.news-etc :deep(.bottom) {
  margin-top: auto;
  /* ดันลงล่าง */
  opacity: .8;
  font-size: clamp(.8rem, 2vw, .9rem);
}

/* Hover สวย ๆ เฉพาะอุปกรณ์มี hover */
@media (hover:hover) and (pointer:fine) {

  .news-etc :deep(a),
  .news-etc :deep(.etc-card),
  .news-etc :deep(.card) {
    transition: transform .15s ease, box-shadow .15s ease;
  }

  .news-etc :deep(a:hover),
  .news-etc :deep(.etc-card:hover),
  .news-etc :deep(.card:hover) {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, .18);
  }
}

/* จอเล็ก: 1 คอลัมน์อ่านง่าย */
@media (max-width: 640px) {
  .news-etc {
    grid-template-columns: 1fr;
  }
}

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
