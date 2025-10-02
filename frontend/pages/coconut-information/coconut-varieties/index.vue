<template>
  <div>
    <div style="height: 8rem"></div>
    <div class="faqs-path">
      <NuxtLinkLocale to="/">{{ $t("Home") }}</NuxtLinkLocale>/
      <NuxtLinkLocale to="/coconut-information/">{{ $t('CoconutInfo') }}</NuxtLinkLocale>/
      <NuxtLinkLocale to="/coconut-information/coconut-varieties">{{ $t('Coconut-varieties') }}</NuxtLinkLocale>
    </div>
    <div style="height: 1rem"></div>

    <h1 class="context-header">{{ $t('CoconutInfo') }}</h1>
    <div style="height: 5rem;"></div>

    <!-- Search -->
    <label class="coconut-v-input">
      <img src="/icon/search.svg" alt="search icon" />
      <input
        type="text"
        :placeholder="currentLocale === 'th' ? 'ค้นหาด้วยชื่อ...' : 'Search by name...'"
        v-model="searchQuery"
        @input="filterCoconuts"
      />
    </label>

    <!-- Filters -->
    <div class="all-filter-container">
      <label class="filter-dropdown">
        <select v-model="filterType" @change="filterCoconuts" class="filter-select">
          <option value="">{{ currentLocale === 'th' ? 'ทั้งหมด' : 'All' }}</option>
          <option value="Young">{{ currentLocale === 'th' ? 'มะพร้าวพันธ์ุแคระ' : 'Dwarf Coconut' }}</option>
          <option value="Old">{{ currentLocale === 'th' ? 'มะพร้าวพันธ์ุสูง' : 'Tall Coconut' }}</option>
        </select>
      </label>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="coconut-v-cards-container">
      <CardShimmer v-for="i in 30" :key="i" />
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredCoconuts.length === 0" class="no-results">
      <img class="no-result-image" src="/img/News404.png" draggable="false" alt="No items" />
      <h1>{{ currentLocale === 'th' ? 'ไม่พบข้อมูล' : 'No items found' }}</h1>
    </div>

    <!-- Cards -->
    <div v-else class="coconut-v-cards-container">
      <CoconutCards
        v-for="coconut in paginatedCoconuts"
        :key="coconut.id"
        :img="coconut.image || noimageHandle"
        :url="`/coconut-information/coconut-varieties/details/${coconut.id}`"
        :name="coconut.name_th || 'ชื่อไทย'"
        :sci_front="coconut.sci_name_f || ''"
        :sci_middle="coconut.sci_name_m || ''"
        :sci_back="coconut.sci_name_l || ''"
        @click="goToDetails(coconut.id)"
      />
    </div>

    <!-- Pagination (only when there are results) -->
    <div v-if="!loading && filteredCoconuts.length > 0" class="pagination">
      <div class="pagination-line"></div>
      <div class="pagination-controller">
        <button @click="changePage('prev')" :disabled="currentPage === 1">
          {{ currentLocale === 'th' ? 'กลับ' : 'Prev' }}
        </button>

        <input
          type="number"
          v-model.number="pageInput"
          @change="goToPage"
          :min="1"
          :max="totalPages"
          class="page-input"
        />

        <span style="display: flex; align-self: center;">
          {{ currentLocale === 'th' ? 'จาก' : 'of' }} {{ totalPages }}
        </span>

        <button @click="changePage('next')" :disabled="currentPage === totalPages">
          {{ currentLocale === 'th' ? 'ถัดไป' : 'Next' }}
        </button>
      </div>
      <div class="pagination-line"></div>
    </div>

    <div style="height: 3rem;"></div>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head'
import { useCoconuts } from '~/composables/useCoconuts'
import noimageHandle from '/img/no-image-handle.png'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { getCoconuts } = useCoconuts()

export default {
  data() {
    return {
      coconuts: [],
      filteredCoconuts: [],
      searchQuery: '',
      filterType: '',
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
      loading: true,
      noimageHandle,
    }
  },
  setup() {
    const { locale } = useI18n()
    const currentLocale = computed(() => locale.value)

    useHead({
      title: '🥥Coconut - Varieties',
      meta: [{ name: 'description', content: 'Coconut varieties for Coconut Knowledge Hub' }],
    })

    return { currentLocale }
  },
  computed: {
    totalPages() {
      const pages = Math.ceil(this.filteredCoconuts.length / this.itemsPerPage)
      return Math.max(pages, 1)
    },
    paginatedCoconuts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredCoconuts.slice(start, start + this.itemsPerPage)
    },
  },
  async mounted() {
    window.scrollTo(0, 0)
    try {
      const data = await getCoconuts()
      const coconutArray = Array.isArray(data) ? data : data?.coconuts || []
      this.coconuts = coconutArray.filter(c => c.status)
      this.filteredCoconuts = [...this.coconuts]
    } catch (err) {
      console.error('Error fetching coconuts:', err)
      this.coconuts = []
      this.filteredCoconuts = []
    } finally {
      this.loading = false
    }
  },
  methods: {
    filterCoconuts() {
      const q = this.searchQuery.toLowerCase().trim()
      this.filteredCoconuts = this.coconuts.filter(c => {
        const nameTh = (c.name_th || '').toLowerCase()
        const nameEn = (c.name_eng || '').toLowerCase()
        const matchesName = nameTh.includes(q) || nameEn.includes(q)

        const matchesType = this.filterType
          ? (c.youngold || '').toLowerCase() === this.filterType.toLowerCase()
          : true

        return matchesName && matchesType
      })
      this.currentPage = 1
      this.pageInput = 1
    },
    changePage(dir) {
      if (dir === 'next' && this.currentPage < this.totalPages) this.currentPage++
      if (dir === 'prev' && this.currentPage > 1) this.currentPage--
      this.pageInput = this.currentPage
    },
    goToPage() {
      if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
        this.currentPage = this.pageInput
      } else {
        this.pageInput = this.currentPage
      }
    },
    goToDetails(id) {
      this.$router.push(`/coconut-information/coconut-varieties/details/${id}`)
    },
  },
}
</script>



<style scoped>
.no-results {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.no-results h1 { font-size: 3rem; font-weight: normal; }
.no-results .no-result-image,
.no-results img { width: 20rem; height: 20rem; }
.filters-container {
  display: flex;
  justify-content: center;
}

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

.filter-select:focus {
  border-color: #4e6d16;
}

.all-filter-container {

  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}
.context-header {
  display: flex;
  justify-self: center;
}

label.coconut-v-input {
  transition: ease-in-out 0.5s;
  display: flex;
  justify-self: center;
  width: 60%;
  height: 3rem;
  outline: 3px solid #4e6d16;
  border-radius: 10px;
  overflow: hidden;
  cursor: text;
  animation: btnexpand 0.5s ease-in-out forwards;
}

label.coconut-v-input:hover {
  outline: 4px solid #4e6d16;
}

label.coconut-v-input img {
  display: flex;
  align-self: center;
  padding-left: 0.5rem;
  width: 10%;
  height: 2rem;
}

label.coconut-v-input input {
  all: unset;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow: hidden;
  width: 90%;
}

@keyframes shimmer-effect {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.coconut-v-cards-container {
  height: auto;
  width: 80%;
  display: flex;
  justify-self: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem;
}

.CardShimmer {
  height: 18rem;
  width: 15rem;
  border-radius: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer-effect 1.5s infinite;
}

/* Pagination */
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

@media (max-width: 662px) {
  .coconut-v-cards-container {
    width: 90%;
  }
}

@keyframes btnexpand {
  0% {
    opacity: 0;
    width: 20%;
  }

  100% {
    opacity: 1;
    width: 60%;
  }
}
</style>
