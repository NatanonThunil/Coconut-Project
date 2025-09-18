<template>

  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/">Home</NuxtLinkLocale>/
    <NuxtLinkLocale to="/coconut-information/">{{ $t('CoconutInfo') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/coconut-information/value-chain">{{ $t('Value Chain') }}</NuxtLinkLocale>
  </div>
  <h1 class="context-header">{{ $t('Value Chain') }}</h1>
  <div style="height: 5rem;"></div>

  <!-- Search Input -->
  <label class="coconut-v-input">
    <img src="/icon/search.svg" alt="search icon" />
    <input type="text" placeholder="ค้นหาด้วยชื่อ..." v-model="searchQuery" @input="filterChainvalues" />
  </label>

  <!-- Filters -->
  <div class="all-filter-container">
    <label class="filter-dropdown" v-for="(filter, key) in filters" :key="key">
      <select v-model="filter.model" class="filter-select" @change="filterChainvalues">
        <option value="">{{ filter.label }}</option>
        <option v-for="option in filter.options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </label>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="coconut-v-cards-container">
    <CardShimmer v-for="index in 30" :key="index" />
  </div>

  <div v-else-if="filteredChainvalues.length === 0" class="no-results">
    <img src="/icon/notfound.png" draggable="false" alt="No chain values found" />
    {{ $t('No chain values found') }}
  </div>

  <div v-else class="coconut-v-cards-container">
    <CoconutCards v-for="chainvalue in paginatedChainvalues" :key="chainvalue.id"
      :img="chainvalue.image || defaultImage" :url="`/coconut-information/value-chain/details/${chainvalue.id}`"
      :name="currentLocale === 'th' ? chainvalue.title : chainvalue.title_en" :sci_front="chainvalue.description || ''"
      :sci_middle="''" :sci_back="''" @click="goToDetails(chainvalue.id)" />
  </div>

  <!-- Pagination -->
  <div v-if="!loading" class="pagination">
    <div class="pagination-line"></div>
    <button @click="changePage('prev')" :disabled="currentPage === 1">Prev</button>
    <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages" />
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage('next')" :disabled="currentPage === totalPages">Next</button>
     <div class="pagination-line"></div>
  </div>
 
  <div style="height: 3rem;"></div>
</template>

<script>
import { useHead } from '@vueuse/head';
import CoconutCards from '@/components/CoconutCards.vue';
import CardShimmer from '@/components/CardShimmer.vue';
import { useI18n } from 'vue-i18n';
import { useChainvalues } from '@/composables/useChainvalues';

const { getChainvalues } = useChainvalues();

export default {
  components: { CoconutCards, CardShimmer },
  data() {
    return {
      chainvalues: [],
      filteredChainvalues: [],
      searchQuery: '',
      loading: true,
      defaultImage: 'https://placehold.co/600x400',
      filters: {
        category: {
          label: this.$t('Category'),
          model: '',
          options: [
            { value: '0', text: this.$t('Young Coconut') },
            { value: '1', text: this.$t('Mature Coconut') },
          ],
        },
        type: {
          label: this.$t('Type'),
          model: '',
          options: [
            { value: '0', text: this.$t('Upstream') },
            { value: '1', text: this.$t('Midstream') },
            { value: '2', text: this.$t('Downstream') },
          ],
        },
      },
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
    };
  },
  computed: {
    currentLocale() {
      const { locale } = useI18n();
      return locale.value;
    },
    totalPages() {
      return Math.ceil(this.filteredChainvalues.length / this.itemsPerPage);
    },
    paginatedChainvalues() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredChainvalues.slice(start, start + this.itemsPerPage);
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    try {
      const data = await getChainvalues();
      this.chainvalues = Array.isArray(data) ? data : [];
      this.filteredChainvalues = this.chainvalues;
      this.loading = false;
    } catch (error) {
      console.error('Error fetching chain values:', error);
    }
  },
  methods: {
    filterChainvalues() {
      const query = this.searchQuery.toLowerCase();
      this.filteredChainvalues = this.chainvalues.filter((chainvalue) => {
        const title = (chainvalue.title || '').toLowerCase();
        const titleEn = (chainvalue.title_en || '').toLowerCase();
        const matchesQuery = title.includes(query) || titleEn.includes(query);
        const matchesCategory =
          this.filters.category.model === '' ||
          chainvalue.category.toString() === this.filters.category.model;
        const matchesType =
          this.filters.type.model === '' ||
          chainvalue.type.toString() === this.filters.type.model;
        return matchesQuery && matchesCategory && matchesType;
      });
    },
    changePage(direction) {
      if (direction === 'next' && this.currentPage < this.totalPages)
        this.currentPage++;
      else if (direction === 'prev' && this.currentPage > 1)
        this.currentPage--;
    },
    goToPage() {
      if (this.pageInput >= 1 && this.pageInput <= this.totalPages)
        this.currentPage = this.pageInput;
      else this.pageInput = this.currentPage;
    },
    goToDetails(id) {
      this.$router.push(`/coconut-information/value-chain/details/${id}`);
    },
  },
  setup() {
    useHead({
      title: '🥥Coconut - Value Chain',
      meta: [
        {
          name: 'description',
          content: 'Value Chain page for Coconut Knowledge Hub',
        },
      ],
    });
  },
};
</script>

<style scoped>
.all-filter-container {
  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}

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

/* ✅ ใช้ขนาดการ์ดเดียวกับ Coconut Varieties */
.coconut-card {
  height: 18rem;
  width: 15rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: transform 0.3s ease-in-out;
  animation: fadeIn 0.5s ease-in-out;
  overflow: hidden;
}
</style>
