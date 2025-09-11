<template>
  
  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/aboutus">{{ $t('AboutUs') }}</NuxtLinkLocale>/<NuxtLinkLocale to="/aboutus/benefitandservice">
      {{ $t('Benefit and service') }}</NuxtLinkLocale>
  </div>
  <div style="height: 1rem"></div>
  <h1 class="context-header">{{ $t('Benefit and service') }}</h1>
  <div style="height: 5rem;"></div>

  <Frontesearch :placeholder="$t('Search...')" @update:search="onSearch" />

  <!-- Loading State -->
  <div v-if="loading" class="coconut-v-cards-container">
    <CardShimmer v-for="index in 30" :key="index" />
  </div>

  <!-- Loaded Content -->
  <div v-else class="coconut-v-cards-container">
    <!-- <CoconutCards
        v-for="coconut in paginatedCoconuts"
        :key="coconut.id"
        :img="coconut.image || 'https://via.placeholder.com/1280x720'"
        :url="`/coconut-varieties/details/${coconut.id}`"
        :name="coconut.name_th || 'ชื่อไทย'"
        :sci_front="coconut.sci_name_f || 'วิทย์ 1'"
        :sci_middle="coconut.sci_name_m || 'วิทย์ 2'"
        :sci_back="coconut.sci_name_l || 'วิทย์ 3'"
        @click="goToDetails(coconut.id)"
      /> -->

    <AboutusCard v-if="filteredCoconuts.length" v-for="coconut in paginatedCoconuts" :name="coconut.title || 'ชื่อไทย'"
      :description="coconut.description" :key="coconut.id"
      :image="coconut.image || 'https://via.placeholder.com/1280x720'" :url="`aboutus/benefitandservice/details/${coconut.id}`"
      @click="goToDetails(coconut.id)" />

    <div v-else-if="!filteredCoconuts.length" class="coconut-v-cards-container">
      <p style="opacity:.7">{{ $t('No result found') }}</p>
    </div>
  </div>

  <div class="pagination">
    <div class="pagination-line"></div>
    <div class="pagination-controller">
      <button @click="changePage('prev')" :disabled="currentPage === 1">
        กลับ
      </button>
      <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages"
        class="page-input" />
      <span style="display: flex; align-self: center">
        จาก {{ totalPages }}
      </span>
      <button @click="changePage('next')" :disabled="currentPage === totalPages">
        ถัดไป
      </button>
    </div>
    <div class="pagination-line"></div>
  </div>
</template>

<script>
import { useServices } from "~/composables/useServices";
import { useHead } from "@vueuse/head";
const { getServices } = useServices();

export default {
  data() {
    return {
      coconuts: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
      loading: true,
      _searchTimer: null, // for simple debounce
    };
  },

  computed: {
  filteredCoconuts() {
    const q = (this.searchQuery || "").trim().toLowerCase();
    // start from published only
    const base = this.coconuts.filter(c => Number(c.status) === 1);

    if (!q) return base;

    return base.filter((c) => {
      const t  = (c.title || "").toLowerCase();
      const te = (c.title_en || "").toLowerCase();
      const d  = (c.description || "").toLowerCase();
      const de = (c.description_en || "").toLowerCase();
      return t.includes(q) || te.includes(q) || d.includes(q) || de.includes(q);
    });
  },

    // paginate the *filtered* results
    totalPages() {
      const total = Math.ceil(this.filteredCoconuts.length / this.itemsPerPage);
      return total || 1;
    },

    paginatedCoconuts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCoconuts.slice(start, end);
    },
  },

  watch: {
    currentPage(newPage) {
      this.pageInput = newPage;
    },
  },

  async mounted() {
    window.scrollTo(0, 0);
    try {
      setTimeout(async () => {
        const data = await getServices();
        this.coconuts = data;
        this.loading = false;
      }, 200);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  },

  methods: {
    // receives value from <Frontesearch @update:search="onSearch">
    onSearch(val) {
      // simple debounce (150ms)
      clearTimeout(this._searchTimer);
      this._searchTimer = setTimeout(() => {
        this.searchQuery = (val || "").trim();
        this.currentPage = 1;
        this.pageInput = 1;
      }, 150);
    },

    changePage(direction) {
      if (direction === "next" && this.currentPage < this.totalPages) {
        this.currentPage++;
      } else if (direction === "prev" && this.currentPage > 1) {
        this.currentPage--;
      }
    },

    goToPage() {
      if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
        this.currentPage = this.pageInput;
      } else {
        this.pageInput = this.currentPage;
      }
    },

    goToDetails(id) {
      this.$router.push(`benefitandservice/details/${id}`);
    },
  },

  setup() {
    useHead({
      title: "🥥Coconut - Varieties",
      meta: [{ name: "description", content: "Home page for Coconut Knowledge Hub" }],
    });
  },
};
</script>


<style scoped>
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
</style>