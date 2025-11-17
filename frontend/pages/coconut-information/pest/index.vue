<template>

  <div style="height: 8rem"></div>
  
  <Breadcrumb/>
  <h1 class="context-header">{{ $t("Pest") }}</h1>
     
  <div style="height: 5rem"></div>

  <!-- Search Input -->
  <label class="coconut-v-input">
    <img src="/icon/search.svg" alt="search icon" />
    <input
      type="text"
      :placeholder="currentLocale === 'th' ? 'ค้นหาด้วยชื่อ...' : 'Search by name...'"
      v-model="searchQuery"
      @input="filterPests"
    />
  </label>

  <!-- Filters -->
  <div class="all-filter-container">
    <label class="filter-dropdown">
      <select
        v-model="filters.category"
        class="filter-select"
        @change="filterPests"
      >
        <option value="">{{ $t("Category") }}</option>
        <option value="0">{{ $t("Young-coconut") }}</option>
        <option value="1">{{ $t("Old-coconut") }}</option>
      </select>
    </label>
    <label class="filter-dropdown">
      <select
        v-model="filters.type"
        class="filter-select"
        @change="filterPests"
      >
        <option value="">{{ $t("All") }}</option>
        <option value="0">{{ $t("Pest") }}</option>
        <option value="1">{{ $t("Weed") }}</option>
        <option value="2">{{ $t("Disease") }}</option>
        <option value="3">{{ $t("Insect") }}</option>
        <option value="4">{{ $t("Other enemies") }}</option>
      </select>
    </label>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="coconut-v-cards-container">
    <CardShimmer v-for="index in 30" :key="index" />
  </div>

  <!-- No Results -->
  <div v-else-if="filteredPests.length === 0" class="no-results">
    <img
      class="no-result-image"
      src="/img/News404.png"
      draggable="false"
      alt="No pests found"
    />
    <h1>{{ $t("No pests found") }}</h1>
  </div>

  <!-- Pest Cards -->
  <div v-else class="coconut-v-cards-container">
    <CoconutCards
      v-for="pest in paginatedPests"
      :key="pest.id"
      :img="pest.image || defaultImage"
      :url="`/coconut-information/pest/details/${pest.id}`"
      :name="currentLocale === 'th' ? pest.name : pest.name_en"
      :sci_front="pest.sci_name || ''"
      :sci_middle="''"
      :sci_back="''"
      @click="goToDetails(pest.id)"
    />
  </div>

  <!-- Pagination -->
  <div v-if="!loading" class="pagination">
     <div class="pagination-line"></div>
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
     <div class="pagination-line"></div>
  </div>
  <div style="height: 3rem;"></div>
</template>

<script>
import { useHead } from "@vueuse/head";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { usePests } from "@/composables/usePests";
import CoconutCards from "@/components/CoconutCards.vue";
import noimageHandle from "/img/News404.png";

const { getPests } = usePests();

export default {
  data() {
    return {
      pests: [],
      filteredPests: [],
      searchQuery: "",
      filters: {
        category: "",
        type: "",
      },
      loading: true,
      defaultImage: noimageHandle,
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
    };
  },
  setup() {
    const { locale } = useI18n();
    const currentLocale = computed(() => locale.value);

    useHead({
      title: "🥥Coconut - Pest Information",
      meta: [
        {
          name: "description",
          content: "Pest Information page for Coconut Knowledge Hub",
        },
      ],
    });

    return { currentLocale };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredPests.length / this.itemsPerPage);
    },
    paginatedPests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredPests.slice(start, start + this.itemsPerPage);
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    try {
      const data = await getPests();
      this.pests = Array.isArray(data) ? data : [];
      this.filteredPests = this.pests;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching pests:", error);
      this.pests = [];
      this.filteredPests = [];
      this.loading = false;
    }
  },
  methods: {
    filterPests() {
      const query = this.searchQuery.toLowerCase();
      this.filteredPests = this.pests.filter((pest) => {
        const nameTh = (pest.name || "").toLowerCase();
        const nameEng = (pest.name_en || "").toLowerCase();
        const matchesQuery = nameTh.includes(query) || nameEng.includes(query);
        const matchesCategory =
          this.filters.category === "" ||
          pest.category?.toString() === this.filters.category;
        const matchesType =
          this.filters.type === "" ||
          pest.type?.toString() === this.filters.type;

        return matchesQuery && matchesCategory && matchesType;
      });

      this.currentPage = 1;
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
      this.$router.push(`/coconut-information/pest/details/${id}`);
    },
  },
};
</script>

<style scoped>
.no-results h1{
  font-size: 3rem;
  font-weight: normal;
}
.no-results img{
  width: 20rem;
  height: 20rem;
}
.no-results{
  margin-top: 3rem;
  flex-direction: column;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.pagination .pagination-line {
  width: fit-content;
  min-width: 20%;
  height: 4px;
  background-color: #4e6d16;
}
/* ===== Filters ===== */
.all-filter-container {
  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
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

/* ===== Search Box ===== */
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

/* ===== Cards Container ===== */
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

/* ===== Loading Shimmer ===== */
.CardShimmer {
  height: 18rem;
  width: 15rem;
  border-radius: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer-effect 1.5s infinite;
}
@keyframes shimmer-effect {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ===== Pagination ===== */
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

/* ===== Responsive ===== */
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
