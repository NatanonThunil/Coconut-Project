<template>
  <Navbar selecto="pests" />
  <div style="height: 10rem"></div>
  <h1 class="context-header">{{ $t("Pest") }}</h1>
  <div style="height: 5rem"></div>

  <label class="pest-v-input">
    <img src="@/assets/icon/search.svg" alt="search icon" />
    <input type="text" :placeholder="currentLocale === 'th' ? 'ค้นหา...' : 'Search...'" v-model="searchQuery"
      @input="filterPests" />
  </label>

  <div class="all-filter-container">
    <label class="filter-dropdown" v-for="(filter, key) in filters" :key="key">
      <select v-model="filter.model" class="filter-select" @change="filterPests">
        <option value="">{{ filter.label }}</option>
        <option v-for="option in filter.options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </label>
  </div>

  <div class="grid-container">
    <div v-if="loading" class="all-pest-card-container">
      <PestCardShimmer v-for="index in itemsPerPage" :key="index" />
    </div>
    <div v-else-if="paginatedPests.length === 0" class="no-results">
      <img src="@/assets/icon/notfound.png" draggable="false" alt="No pests found" />
      {{ $t("No pests found") }}
    </div>
    <div v-else class="all-pest-card-container">
      <PestCards v-for="pest in paginatedPests" :key="pest.id" :url="`/pests/details/${pest.id}`"
        :image="pest.image || 'https://placehold.co/600x400'" :title="currentLocale === 'th'
            ? pest.title || 'No title provided'
            : pest.title_en || 'No English title provided'
          " :datestart="formatDate(pest.date_start) || 'No date provided'" :location="currentLocale === 'th'
            ? pest.location_name || 'Unknown'
            : pest.location_name_en || 'No English location provided'
          " :description="currentLocale === 'th'
            ? pest.description || 'No description available'
            : pest.description_en || 'No description available'
          " />
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
      <span style="display: flex; align-self: center">จาก {{ totalPages }}</span>
      <button @click="changePage('next')" :disabled="currentPage === totalPages">
        ถัดไป
      </button>
    </div>
    <div class="pagination-line"></div>
  </div>
</template>

<script>
import nfi from "@/assets/img/News404.png";
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { locale, t } = useI18n();
    const currentLocale = computed(() => locale.value);

    const filters = reactive({
      category: {
        label: computed(() => t("category")),
        model: "",
        options: [
          { value: "Young-coconut", text: computed(() => t("Young-coconut")) },
          { value: "Old-coconut", text: computed(() => t("Old-coconut")) },
        ],
      },
      status: {
        label: computed(() => t("All")),
        model: "",
        options: [
          { value: "1", text: computed(() => t("Pest")) },
          { value: "2", text: computed(() => t("Weed")) },
          { value: "3", text: computed(() => t("Disease")) },
          { value: "4", text: computed(() => t("Insect")) },
          { value: "5", text: computed(() => t("Other enemies")) },
        ],
      },
    });

    return { currentLocale, filters };
  },
  data() {
    return {
      pests: [],
      filteredPests: [],
      searchQuery: "",
      loading: true,
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
    };
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
      const response = await fetch("/api/pests", {
        headers: {
          CKH: "541986Cocon",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch pests");
      const data = await response.json();
      this.pests = Array.isArray(data)
        ? data.filter((pest) => pest.status === 1)
        : [];
      this.filterPests();
    } catch (error) {
      console.error("Error fetching pests:", error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    filterPests() {
      const Category = filters.value.find(filter => filter.label === 'Sort By').model;
      const status = filters.value.find(filter => filter.label === 'Downloadable').model;

      let filteredList = filteredAchievements.value;

      // Apply sorting based on the selected option
      if (sortBy === 'newest') {
        filteredList = filteredList.sort((a, b) => b.id - a.id); // Higher ID first
      } else if (sortBy === 'oldest') {
        filteredList = filteredList.sort((a, b) => a.id - b.id); // Lower ID first
      }

      // Apply downloadable filter if selected
      if (downloadable === '1') {
        filteredList = filteredList.filter(achievement => achievement.canDownload === 1);
      } else if (downloadable === '0') {
        filteredList = filteredList.filter(achievement => achievement.canDownload === 0);

      }
      this.currentPage = 1;
      return filteredList;

      
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
  },
};
</script>

<style scoped>
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

.no-results {
  text-align: center;
  flex-direction: column;
  font-size: 3rem;
  color: #777;
  min-height: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-results img {
  height: 10rem;
  margin: 2rem;
  opacity: 0.5;
}

.all-filter-container {
  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}

.all-pest-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 20rem));
  max-width: calc(5 * 20rem + 4 * 15px);
  gap: 15px;
  width: 80%;
  justify-content: center;
  margin: 1rem auto;
}

h1.context-header {
  text-align: center;
}

label.pest-v-input {
  transition: ease-in-out 0.5s;
  display: flex;
  justify-self: center;
  width: 60%;
  height: 3rem;
  outline: 3px solid #4e6d16;
  border-radius: 10px;
  overflow: hidden;
}

label.pest-v-input:hover {
  outline: 4px solid #4e6d16;
}

label.pest-v-input img {
  align-self: center;
  padding-left: 0.5rem;
  width: 10%;
  height: 2rem;
}

label.pest-v-input input {
  all: unset;
  padding-left: 1rem;
  width: 90%;
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

@media (max-width: 1024px) {
  .all-pest-card-container {
    grid-template-columns: repeat(2, 20rem);
  }
}

/* Mobile View (1-2 Columns) */
@media (max-width: 691px) {
  .all-pest-card-container {
    grid-template-columns: repeat(1, 20rem);
  }
}
</style>
